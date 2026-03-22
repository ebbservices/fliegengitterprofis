"""
Setup script for Fliegengitter Shop environments.

Creates PostgreSQL databases, users, generates secrets, and uploads
them to Kubernetes. Run once per environment (dev/prod).

Usage:
    py -m scripts.setup-env --pg-root-user postgres --pg-root-pass <pw> --env dev
    py -m scripts.setup-env --pg-root-user postgres --pg-root-pass <pw> --env prod
"""

import argparse
import json
import secrets
import subprocess
import sys

try:
    import psycopg2
    from psycopg2 import sql
except ImportError:
    print("psycopg2-binary is required. Install with: pip install psycopg2-binary")
    sys.exit(1)


ENV_CONFIG = {
    "dev": {
        "db_name": "dfp_dev",
        "db_user": "dfp_dev_user",
        "redis_url": "redis://redis.default.svc.cluster.local:6379/0",
    },
    "prod": {
        "db_name": "dfp_prod",
        "db_user": "dfp_prod_user",
        "redis_url": "redis://redis.default.svc.cluster.local:6379/1",
    },
}

DEFAULT_SMTP = {
    "host": "smtp-relay.brevo.com",
    "port": "587",
    "user": "916265001@smtp-brevo.com",
    "password": "LRgn1DQawrj5dqXV",
    "from_email": "info@mobatix.de",
    "from_name": "Mobatix GmbH",
}

K8S_NAMESPACE = "diefliegengitterprofis"


def run_cmd(cmd, check=True, capture=True):
    if isinstance(cmd, str):
        cmd_list = cmd.split()
    else:
        cmd_list = cmd
    result = subprocess.run(
        cmd_list, capture_output=capture, text=True
    )
    if check and result.returncode != 0:
        print(f"Command failed: {' '.join(cmd_list)}")
        if result.stderr:
            print(f"  stderr: {result.stderr.strip()}")
        return None
    return result


def ensure_namespace(namespace):
    print(f"\n[1/6] Ensuring namespace '{namespace}' exists...")
    result = run_cmd(f"kubectl get namespace {namespace}", check=False)
    if result and result.returncode == 0:
        print(f"  Namespace '{namespace}' already exists.")
    else:
        run_cmd(f"kubectl create namespace {namespace}")
        print(f"  Namespace '{namespace}' created.")


def copy_registry_secret(namespace):
    print(f"\n[2/6] Ensuring registry-secret in namespace '{namespace}'...")
    result = run_cmd(
        ["kubectl", "get", "secret", "registry-secret", "-n", namespace], check=False
    )
    if result and result.returncode == 0:
        print("  registry-secret already exists in namespace.")
        return

    result = run_cmd(
        ["kubectl", "get", "secret", "registry-secret", "-n", "default", "-o", "json"], check=True
    )
    if not result or result.returncode != 0:
        print("  ERROR: registry-secret not found in default namespace.")
        print("  Create it first, then re-run this script.")
        sys.exit(1)

    secret_data = json.loads(result.stdout)
    secret_data["metadata"]["namespace"] = namespace
    secret_data["metadata"].pop("resourceVersion", None)
    secret_data["metadata"].pop("uid", None)
    secret_data["metadata"].pop("creationTimestamp", None)

    proc = subprocess.run(
        ["kubectl", "apply", "-f", "-"],
        input=json.dumps(secret_data),
        capture_output=True,
        text=True,
    )
    if proc.returncode == 0:
        print(f"  registry-secret copied to '{namespace}'.")
    else:
        print(f"  ERROR copying registry-secret: {proc.stderr}")
        sys.exit(1)


def setup_database(pg_host, pg_port, pg_root_user, pg_root_pass, env):
    config = ENV_CONFIG[env]
    db_name = config["db_name"]
    db_user = config["db_user"]
    db_pass = secrets.token_urlsafe(32)

    print(f"\n[3/6] Setting up PostgreSQL database '{db_name}'...")

    conn = psycopg2.connect(
        host=pg_host,
        port=pg_port,
        user=pg_root_user,
        password=pg_root_pass,
        dbname="postgres",
    )
    conn.autocommit = True
    cur = conn.cursor()

    cur.execute(
        "SELECT 1 FROM pg_database WHERE datname = %s", (db_name,)
    )
    if cur.fetchone():
        print(f"  Database '{db_name}' already exists.")
    else:
        cur.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(db_name)))
        print(f"  Database '{db_name}' created.")

    cur.execute(
        "SELECT 1 FROM pg_roles WHERE rolname = %s", (db_user,)
    )
    if cur.fetchone():
        print(f"  User '{db_user}' already exists, updating password.")
        cur.execute(
            sql.SQL("ALTER USER {} WITH PASSWORD %s").format(
                sql.Identifier(db_user)
            ),
            (db_pass,),
        )
    else:
        cur.execute(
            sql.SQL("CREATE USER {} WITH PASSWORD %s").format(
                sql.Identifier(db_user)
            ),
            (db_pass,),
        )
        print(f"  User '{db_user}' created.")

    cur.execute(
        sql.SQL("GRANT ALL PRIVILEGES ON DATABASE {} TO {}").format(
            sql.Identifier(db_name), sql.Identifier(db_user)
        )
    )

    cur.close()
    conn.close()

    conn = psycopg2.connect(
        host=pg_host,
        port=pg_port,
        user=pg_root_user,
        password=pg_root_pass,
        dbname=db_name,
    )
    conn.autocommit = True
    cur = conn.cursor()

    cur.execute(
        sql.SQL("GRANT ALL ON SCHEMA public TO {}").format(
            sql.Identifier(db_user)
        )
    )
    cur.execute(
        sql.SQL(
            "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO {}"
        ).format(sql.Identifier(db_user))
    )
    cur.execute(
        sql.SQL(
            "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO {}"
        ).format(sql.Identifier(db_user))
    )

    cur.close()
    conn.close()

    print(f"  Grants configured for '{db_user}' on '{db_name}'.")

    database_url = (
        f"postgresql://{db_user}:{db_pass}@{pg_host}:{pg_port}/{db_name}"
    )
    return database_url, db_pass


def create_k8s_secret(env, namespace, database_url, smtp):
    config = ENV_CONFIG[env]
    secret_name = f"medusa-secrets-{env}"
    jwt_secret = secrets.token_urlsafe(64)
    cookie_secret = secrets.token_urlsafe(64)

    print(f"\n[4/6] Creating K8s secret '{secret_name}' in namespace '{namespace}'...")

    result = run_cmd(
        ["kubectl", "get", "secret", secret_name, "-n", namespace], check=False
    )
    if result and result.returncode == 0:
        print(f"  Secret '{secret_name}' already exists. Deleting and recreating...")
        run_cmd(["kubectl", "delete", "secret", secret_name, "-n", namespace])

    cmd = [
        "kubectl", "create", "secret", "generic", secret_name,
        "-n", namespace,
        f"--from-literal=DATABASE_URL={database_url}",
        f"--from-literal=REDIS_URL={config['redis_url']}",
        f"--from-literal=JWT_SECRET={jwt_secret}",
        f"--from-literal=COOKIE_SECRET={cookie_secret}",
        f"--from-literal=SMTP_HOST={smtp['host']}",
        f"--from-literal=SMTP_PORT={smtp['port']}",
        f"--from-literal=SMTP_USER={smtp['user']}",
        f"--from-literal=SMTP_PASSWORD={smtp['password']}",
        f"--from-literal=SMTP_FROM_EMAIL={smtp['from_email']}",
        f"--from-literal=SMTP_FROM_NAME={smtp['from_name']}",
        "--from-literal=STRIPE_API_KEY=",
        "--from-literal=STRIPE_WEBHOOK_SECRET=",
    ]

    result = run_cmd(cmd)
    if result and result.returncode == 0:
        print(f"  Secret '{secret_name}' created successfully.")
    else:
        print(f"  ERROR creating secret.")
        sys.exit(1)

    return jwt_secret, cookie_secret


def label_secret(env, namespace):
    secret_name = f"medusa-secrets-{env}"
    print(f"\n[5/6] Labeling secret '{secret_name}'...")
    run_cmd([
        "kubectl", "label", "secret", secret_name, "-n", namespace,
        "app.kubernetes.io/managed-by=setup-script",
        f"environment={env}",
        "--overwrite",
    ])
    print("  Labels applied.")


def print_summary(env, pg_host, pg_port, database_url, db_pass, jwt_secret, cookie_secret):
    config = ENV_CONFIG[env]
    print("\n" + "=" * 60)
    print(f"  SETUP COMPLETE - Environment: {env.upper()}")
    print("=" * 60)
    print(f"\n  Database:     {config['db_name']}")
    print(f"  DB User:      {config['db_user']}")
    print(f"  DB Password:  {db_pass}")
    print(f"  DB Host:      {pg_host}:{pg_port}")
    print(f"  DATABASE_URL: {database_url}")
    print(f"\n  Redis URL:    {config['redis_url']}")
    print(f"\n  JWT Secret:    {jwt_secret[:20]}...")
    print(f"  Cookie Secret: {cookie_secret[:20]}...")
    print(f"\n  K8s Secret:   medusa-secrets-{env}")
    print(f"  K8s Namespace: {K8S_NAMESPACE}")
    print("\n  IMPORTANT: Save these credentials securely!")
    print("  They will not be shown again.")
    print("=" * 60)


def main():
    parser = argparse.ArgumentParser(
        description="Setup Fliegengitter Shop environment (DB + K8s Secrets)"
    )
    parser.add_argument(
        "--pg-host", default="10.0.0.6", help="PostgreSQL host (default: 10.0.0.6)"
    )
    parser.add_argument(
        "--pg-port", default=5432, type=int, help="PostgreSQL port (default: 5432)"
    )
    parser.add_argument(
        "--pg-root-user", required=True, help="PostgreSQL root username"
    )
    parser.add_argument(
        "--pg-root-pass", required=True, help="PostgreSQL root password"
    )
    parser.add_argument(
        "--env",
        required=True,
        choices=["dev", "prod"],
        help="Environment to setup",
    )
    parser.add_argument(
        "--namespace",
        default=K8S_NAMESPACE,
        help=f"K8s namespace (default: {K8S_NAMESPACE})",
    )
    parser.add_argument(
        "--smtp-user", default=DEFAULT_SMTP["user"], help="SMTP user"
    )
    parser.add_argument(
        "--smtp-pass", default=DEFAULT_SMTP["password"], help="SMTP password"
    )

    args = parser.parse_args()

    smtp = {
        **DEFAULT_SMTP,
        "user": args.smtp_user,
        "password": args.smtp_pass,
    }

    print(f"Setting up '{args.env}' environment for Fliegengitter Shop")
    print(f"PostgreSQL: {args.pg_root_user}@{args.pg_host}:{args.pg_port}")
    print(f"Namespace:  {args.namespace}")

    ensure_namespace(args.namespace)
    copy_registry_secret(args.namespace)

    database_url, db_pass = setup_database(
        args.pg_host, args.pg_port, args.pg_root_user, args.pg_root_pass, args.env
    )

    jwt_secret, cookie_secret = create_k8s_secret(
        args.env, args.namespace, database_url, smtp
    )

    label_secret(args.env, args.namespace)

    print(f"\n[6/6] Setup complete!")
    print_summary(
        args.env,
        args.pg_host,
        args.pg_port,
        database_url,
        db_pass,
        jwt_secret,
        cookie_secret,
    )


if __name__ == "__main__":
    main()
