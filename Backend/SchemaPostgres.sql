-- ============================================================
-- E-DEFENCE - Schéma PostgreSQL v1.0
-- Initialisation complète de la base de données
-- ============================================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TYPES ÉNUMÉRÉS
-- ============================================================

CREATE TYPE user_role AS ENUM ('admin', 'client', 'student');
CREATE TYPE audit_status AS ENUM ('pending', 'running', 'completed', 'failed');
CREATE TYPE audit_type AS ENUM ('flash', 'complete');
CREATE TYPE subscription_type AS ENUM ('premium', 'academy', 'premium_academy');
CREATE TYPE subscription_status AS ENUM ('active', 'suspended', 'expired', 'cancelled');

-- ============================================================
-- TABLE: users
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    company         VARCHAR(255),
    phone           VARCHAR(50),
    role            user_role NOT NULL DEFAULT 'student',
    is_active       BOOLEAN NOT NULL DEFAULT true,
    is_email_verified BOOLEAN NOT NULL DEFAULT false,
    email_verification_token TEXT,
    totp_secret     TEXT,
    totp_enabled    BOOLEAN NOT NULL DEFAULT false,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================
-- TABLE: refresh_tokens
-- ============================================================

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked     BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);

-- ============================================================
-- TABLE: subscriptions
-- ============================================================

CREATE TABLE IF NOT EXISTS subscriptions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            subscription_type NOT NULL,
    status          subscription_status NOT NULL DEFAULT 'active',
    starts_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ,
    stripe_sub_id   VARCHAR(255),
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ============================================================
-- TABLE: leads (Audit Flash - Lead Capture)
-- ============================================================

CREATE TABLE IF NOT EXISTS leads (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    phone           VARCHAR(50),
    company         VARCHAR(255),
    target_url      TEXT,
    audit_session_id UUID,
    converted       BOOLEAN NOT NULL DEFAULT false,
    ip_address      INET,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_session ON leads(audit_session_id);

-- ============================================================
-- TABLE: audits
-- ============================================================

CREATE TABLE IF NOT EXISTS audits (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    lead_id         UUID REFERENCES leads(id) ON DELETE SET NULL,
    type            audit_type NOT NULL,
    status          audit_status NOT NULL DEFAULT 'pending',
    target_url      TEXT NOT NULL,
    global_score    NUMERIC(4,1),
    grade           VARCHAR(5),
    report_json     JSONB,
    report_pdf_path TEXT,
    error_message   TEXT,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audits_user ON audits(user_id);
CREATE INDEX idx_audits_status ON audits(status);
CREATE INDEX idx_audits_type ON audits(type);

-- ============================================================
-- TABLE: compliance_assessments
-- ============================================================

CREATE TABLE IF NOT EXISTS compliance_assessments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    standard        VARCHAR(50) NOT NULL, -- 'CIL', 'RGPD', 'ISO27001', 'PCI-DSS', 'RNS'
    answers         JSONB NOT NULL DEFAULT '{}',
    maturity_score  NUMERIC(4,1),
    gap_analysis    JSONB,
    remediation_plan JSONB,
    completed       BOOLEAN NOT NULL DEFAULT false,
    version         INTEGER NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_compliance_user ON compliance_assessments(user_id);
CREATE INDEX idx_compliance_standard ON compliance_assessments(standard);

-- ============================================================
-- TABLE: courses (Cyber-Academy - Catalogue)
-- ============================================================

CREATE TABLE IF NOT EXISTS courses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(50) UNIQUE NOT NULL, -- 'CISSP', 'CEH', etc.
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    total_modules   INTEGER NOT NULL DEFAULT 0,
    total_hours     NUMERIC(5,1),
    difficulty      VARCHAR(20), -- 'beginner', 'intermediate', 'advanced', 'expert'
    thumbnail_url   TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS modules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id       UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    content_type    VARCHAR(50) DEFAULT 'video', -- 'video', 'article', 'quiz'
    content_url     TEXT,
    content_text    TEXT,
    duration_minutes INTEGER,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    quiz_data       JSONB, -- Questions/réponses du quiz de fin de module
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_modules_course ON modules(course_id);

-- ============================================================
-- TABLE: academy_progress
-- ============================================================

CREATE TABLE IF NOT EXISTS academy_progress (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id       UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_id       UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    completed       BOOLEAN NOT NULL DEFAULT false,
    quiz_score      NUMERIC(5,2),
    quiz_passed     BOOLEAN,
    quiz_attempts   INTEGER NOT NULL DEFAULT 0,
    time_spent_sec  INTEGER NOT NULL DEFAULT 0,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

CREATE INDEX idx_progress_user_course ON academy_progress(user_id, course_id);

-- ============================================================
-- TABLE: certificates
-- ============================================================

CREATE TABLE IF NOT EXISTS certificates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id       UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    serial_number   VARCHAR(100) UNIQUE NOT NULL,
    issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    signature_hex   TEXT NOT NULL, -- Signature ECDSA du payload
    payload_hash    TEXT NOT NULL, -- Hash SHA256 du contenu signé
    metadata        JSONB DEFAULT '{}',
    UNIQUE(user_id, course_id)
);

CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_certificates_serial ON certificates(serial_number);

-- ============================================================
-- TABLE: telemetry_logs (SOC - Wazuh events summary)
-- ============================================================

CREATE TABLE IF NOT EXISTS telemetry_logs (
    id              BIGSERIAL PRIMARY KEY,
    client_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wazuh_agent_id  VARCHAR(50),
    event_id        VARCHAR(100),
    rule_id         INTEGER,
    rule_level      INTEGER, -- Severity 0-15 (Wazuh scale)
    rule_description TEXT,
    source_ip       INET,
    destination_ip  INET,
    agent_name      VARCHAR(255),
    raw_data        JSONB,
    event_timestamp TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (event_timestamp);

-- Partitions par mois (créer pour les 12 prochains mois)
CREATE TABLE telemetry_logs_2026_05 PARTITION OF telemetry_logs
    FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE telemetry_logs_2026_06 PARTITION OF telemetry_logs
    FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
CREATE TABLE telemetry_logs_2026_07 PARTITION OF telemetry_logs
    FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE telemetry_logs_2026_08 PARTITION OF telemetry_logs
    FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
CREATE TABLE telemetry_logs_2026_09 PARTITION OF telemetry_logs
    FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
CREATE TABLE telemetry_logs_2026_10 PARTITION OF telemetry_logs
    FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE TABLE telemetry_logs_2026_11 PARTITION OF telemetry_logs
    FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
CREATE TABLE telemetry_logs_2026_12 PARTITION OF telemetry_logs
    FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');

CREATE INDEX idx_telemetry_client ON telemetry_logs(client_id, event_timestamp DESC);
CREATE INDEX idx_telemetry_level ON telemetry_logs(rule_level);

-- ============================================================
-- SEED: Courses initiales
-- ============================================================

INSERT INTO courses (code, title, description, total_modules, total_hours, difficulty, sort_order) VALUES
('CPCB',    'Certifié Professionnel en Cybersécurité du Burkina', 'Certification nationale adaptée au contexte réglementaire burkinabè.', 8,  40,  'intermediate', 1),
('CDPO',    'Certified Data Protection Officer',                   'Devenez DPO certifié, maîtrisez le RGPD et la CIL.',               10, 50,  'intermediate', 2),
('WASO',    'Web Application Security Officer',                    'Sécurité des applications web : OWASP Top 10, tests de pénétration.', 12, 60, 'advanced',     3),
('CCNA',    'Cisco Certified Network Associate',                   'Fondamentaux réseaux, routage, switching et sécurité Cisco.',      14, 80,  'beginner',     4),
('CCNP',    'Cisco Certified Network Professional',                'Architecture réseau avancée et solutions entreprise Cisco.',       16, 100, 'advanced',     5),
('CEH',     'Certified Ethical Hacker',                           'Techniques de hacking éthique et tests d''intrusion.',             15, 90,  'advanced',     6),
('CISSP',   'Certified Information Systems Security Professional', 'Le standard or de la cybersécurité, 8 domaines CBK.',              20, 120, 'expert',       7),
('SECURITY_PLUS', 'CompTIA Security+',                            'Certification de base reconnue mondialement en cybersécurité.',     12, 60,  'beginner',     8),
('ISO27001', 'ISO 27001 Lead Implementer',                        'Mise en œuvre d''un SMSI conforme ISO/IEC 27001:2022.',            10, 50,  'intermediate', 9),
('CISM',    'Certified Information Security Manager',             'Management de la sécurité de l''information et gouvernance.',       10, 60,  'expert',       10)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- SEED: Admin par défaut (mot de passe: Admin@1234 - A CHANGER)
-- Hash bcrypt de 'Admin@1234' avec cost=12
-- ============================================================

INSERT INTO users (email, password_hash, full_name, role, is_email_verified) VALUES
(
    'admin@e-defence.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeS.9.Eu7BVCsatay',
    'Administrateur E-DEFENCE',
    'admin',
    true
) ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- TRIGGERS: updated_at automatique
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_compliance_updated_at
    BEFORE UPDATE ON compliance_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_progress_updated_at
    BEFORE UPDATE ON academy_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();