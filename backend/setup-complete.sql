-- =============================================
-- PostgreSQL Setup für Die Fliegengitter Profis
-- Komplett in einer Datei für pgAdmin
-- =============================================
-- 
-- ANLEITUNG:
-- 1. Verbinde dich in pgAdmin mit der 'postgres' Datenbank
-- 2. Markiere BLOCK 1 und führe ihn aus (F5)
-- 3. Markiere BLOCK 2 und führe ihn aus (F5)
-- 4. Markiere BLOCK 3 und führe ihn aus (F5)
-- 5. Wechsle zur Datenbank 'diefliegengitterprofis_dev'
-- 6. Markiere BLOCK 4 und führe ihn aus (F5)
-- 7. Wechsle zur Datenbank 'diefliegengitterprofis_prod'
-- 8. Markiere BLOCK 5 und führe ihn aus (F5)
-- =============================================

-- =============================================
-- BLOCK 1: User erstellen
-- =============================================
CREATE USER fliegengitter_user WITH PASSWORD 'IldieFliegengitterProfis2025!#';
-- Falls Fehler "role already exists" - ignorieren und weitermachen


-- =============================================
-- BLOCK 2: Dev-Datenbank erstellen
-- =============================================
CREATE DATABASE diefliegengitterprofis_dev
    WITH 
    TEMPLATE = template0
    OWNER = fliegengitter_user
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
-- Falls Fehler "database already exists" - ignorieren und weitermachen


-- =============================================
-- BLOCK 3: Prod-Datenbank erstellen
-- =============================================
CREATE DATABASE diefliegengitterprofis_prod
    WITH 
    TEMPLATE = template0
    OWNER = fliegengitter_user
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
-- Falls Fehler "database already exists" - ignorieren und weitermachen


-- =============================================
-- JETZT: Wechsle in pgAdmin zur Datenbank 'diefliegengitterprofis_dev'
-- Rechtsklick auf diefliegengitterprofis_dev -> Query Tool
-- =============================================

-- =============================================
-- BLOCK 4: Schema-Berechtigungen für DEV-DB
-- (Führe dies in der diefliegengitterprofis_dev Datenbank aus!)
-- =============================================
GRANT ALL ON SCHEMA public TO fliegengitter_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO fliegengitter_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO fliegengitter_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO fliegengitter_user;


-- =============================================
-- JETZT: Wechsle in pgAdmin zur Datenbank 'diefliegengitterprofis_prod'
-- Rechtsklick auf diefliegengitterprofis_prod -> Query Tool
-- =============================================

-- =============================================
-- BLOCK 5: Schema-Berechtigungen für PROD-DB
-- (Führe dies in der diefliegengitterprofis_prod Datenbank aus!)
-- =============================================
GRANT ALL ON SCHEMA public TO fliegengitter_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO fliegengitter_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO fliegengitter_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO fliegengitter_user;


-- =============================================
-- FERTIG!
-- =============================================
-- 
-- Connection Strings:
-- Dev:  postgresql://fliegengitter_user:IldieFliegengitterProfis2025!#@10.0.0.6:5432/diefliegengitterprofis_dev
-- Prod: postgresql://fliegengitter_user:IldieFliegengitterProfis2025!#@10.0.0.6:5432/diefliegengitterprofis_prod
-- 
-- Nächster Schritt:
-- kubectl apply -f ../k8s/redis-deployment.yaml
-- =============================================
