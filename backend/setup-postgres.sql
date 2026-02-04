-- PostgreSQL Setup für Die Fliegengitter Profis
-- Auszuführen auf PostgreSQL Server 10.0.0.6

-- User erstellen
CREATE USER fliegengitter_user WITH PASSWORD 'IldieFliegengitterProfis2025!#';

-- Dev-Datenbank erstellen
CREATE DATABASE diefliegengitterprofis_dev
    WITH 
    OWNER = fliegengitter_user
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Prod-Datenbank erstellen
CREATE DATABASE diefliegengitterprofis_prod
    WITH 
    OWNER = fliegengitter_user
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Berechtigungen für Dev-DB
GRANT ALL PRIVILEGES ON DATABASE diefliegengitterprofis_dev TO fliegengitter_user;

-- Berechtigungen für Prod-DB
GRANT ALL PRIVILEGES ON DATABASE diefliegengitterprofis_prod TO fliegengitter_user;

-- Verbindung zur Dev-DB und Schema-Berechtigungen
GRANT ALL ON SCHEMA public TO fliegengitter_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO fliegengitter_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO fliegengitter_user;

-- Verbindung zur Prod-DB und Schema-Berechtigungen
GRANT ALL ON SCHEMA public TO fliegengitter_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO fliegengitter_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO fliegengitter_user;


