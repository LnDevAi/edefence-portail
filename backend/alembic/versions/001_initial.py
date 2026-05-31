"""Initial schema creation for E-DEFENCE Portail

Revision ID: 001_initial
Revises:
Create Date: 2026-05-28 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op

revision: str = "001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE SCHEMA IF NOT EXISTS portail")

    op.execute("""
        DO $$ BEGIN
            CREATE TYPE portail.articlecategory AS ENUM (
                'actualite', 'alerte', 'tutorial', 'article_maison'
            );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$
    """)

    op.execute("""
        DO $$ BEGIN
            CREATE TYPE portail.clientstatus AS ENUM (
                'prospect', 'actif', 'inactif'
            );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$
    """)

    op.execute("""
        DO $$ BEGIN
            CREATE TYPE portail.servicetype AS ENUM (
                'boitier', 'soc', 'sauvegarde', 'audit360', 'cyberacademy'
            );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$
    """)

    op.execute("""
        DO $$ BEGIN
            CREATE TYPE portail.billingperiod AS ENUM (
                'mensuel', 'annuel', 'unique'
            );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$
    """)

    op.execute("""
        DO $$ BEGIN
            CREATE TYPE portail.contractstatus AS ENUM (
                'actif', 'expire', 'suspendu', 'resilie'
            );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$
    """)

    op.execute("""
        DO $$ BEGIN
            CREATE TYPE portail.invoicestatus AS ENUM (
                'en_attente', 'paye', 'en_retard', 'annule'
            );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$
    """)

    op.execute("""
        CREATE TABLE IF NOT EXISTS portail.articles (
            id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title       VARCHAR(500) NOT NULL,
            content     TEXT NOT NULL,
            summary     TEXT,
            source_url  VARCHAR(2000),
            image_url   VARCHAR(2000),
            category    portail.articlecategory NOT NULL DEFAULT 'actualite',
            tags        VARCHAR(500),
            is_ai_generated BOOLEAN NOT NULL DEFAULT false,
            is_published    BOOLEAN NOT NULL DEFAULT false,
            published_at    TIMESTAMPTZ,
            created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
        )
    """)

    op.execute("""
        CREATE TABLE IF NOT EXISTS portail.clients (
            id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            company_name VARCHAR(255) NOT NULL,
            contact_name VARCHAR(255) NOT NULL,
            email        VARCHAR(255) NOT NULL,
            phone        VARCHAR(50),
            sector       VARCHAR(100),
            address      TEXT,
            city         VARCHAR(100),
            country      VARCHAR(100) NOT NULL DEFAULT 'Burkina Faso',
            status       portail.clientstatus NOT NULL DEFAULT 'prospect',
            notes        TEXT,
            created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
        )
    """)

    op.execute("CREATE INDEX IF NOT EXISTS ix_clients_email  ON portail.clients (email)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_clients_status ON portail.clients (status)")

    op.execute("""
        CREATE TABLE IF NOT EXISTS portail.contracts (
            id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            client_id      UUID NOT NULL REFERENCES portail.clients(id) ON DELETE CASCADE,
            service_type   portail.servicetype NOT NULL,
            start_date     DATE NOT NULL,
            end_date       DATE,
            amount_fcfa    INTEGER NOT NULL,
            billing_period portail.billingperiod NOT NULL DEFAULT 'mensuel',
            status         portail.contractstatus NOT NULL DEFAULT 'actif',
            notes          TEXT,
            created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
        )
    """)

    op.execute("CREATE INDEX IF NOT EXISTS ix_contracts_client_id ON portail.contracts (client_id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_contracts_status    ON portail.contracts (status)")

    op.execute("""
        CREATE TABLE IF NOT EXISTS portail.invoices (
            id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            client_id      UUID NOT NULL REFERENCES portail.clients(id) ON DELETE CASCADE,
            contract_id    UUID REFERENCES portail.contracts(id) ON DELETE SET NULL,
            invoice_number VARCHAR(50) NOT NULL UNIQUE,
            amount_fcfa    INTEGER NOT NULL,
            status         portail.invoicestatus NOT NULL DEFAULT 'en_attente',
            due_date       DATE NOT NULL,
            paid_at        TIMESTAMPTZ,
            payment_method VARCHAR(100),
            payment_ref    VARCHAR(255),
            notes          TEXT,
            created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
        )
    """)

    op.execute("CREATE INDEX IF NOT EXISTS ix_invoices_client_id   ON portail.invoices (client_id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_invoices_contract_id ON portail.invoices (contract_id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_invoices_status      ON portail.invoices (status)")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS portail.invoices")
    op.execute("DROP TABLE IF EXISTS portail.contracts")
    op.execute("DROP TABLE IF EXISTS portail.clients")
    op.execute("DROP TABLE IF EXISTS portail.articles")
    op.execute("DROP TYPE IF EXISTS portail.invoicestatus")
    op.execute("DROP TYPE IF EXISTS portail.contractstatus")
    op.execute("DROP TYPE IF EXISTS portail.billingperiod")
    op.execute("DROP TYPE IF EXISTS portail.servicetype")
    op.execute("DROP TYPE IF EXISTS portail.clientstatus")
    op.execute("DROP TYPE IF EXISTS portail.articlecategory")
    op.execute("DROP SCHEMA IF EXISTS portail CASCADE")
