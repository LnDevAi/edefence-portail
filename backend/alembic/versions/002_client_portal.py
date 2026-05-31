"""Add client portal auth + service requests

Revision ID: 002_client_portal
Revises: 001_initial
Create Date: 2026-05-31 00:00:00.000000
"""
from typing import Sequence, Union
from alembic import op

revision: str = "002_client_portal"
down_revision: Union[str, None] = "001_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        ALTER TABLE portail.clients
            ADD COLUMN IF NOT EXISTS password_hash   VARCHAR(255),
            ADD COLUMN IF NOT EXISTS is_portal_active BOOLEAN NOT NULL DEFAULT false,
            ADD COLUMN IF NOT EXISTS portal_activated_at TIMESTAMPTZ
    """)

    op.execute("""
        DO $$ BEGIN
            CREATE TYPE portail.requeststatus AS ENUM (
                'en_attente', 'en_cours', 'accepte', 'refuse'
            );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$
    """)

    op.execute("""
        CREATE TABLE IF NOT EXISTS portail.service_requests (
            id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            client_id    UUID NOT NULL REFERENCES portail.clients(id) ON DELETE CASCADE,
            service_type portail.servicetype NOT NULL,
            message      TEXT,
            status       portail.requeststatus NOT NULL DEFAULT 'en_attente',
            admin_notes  TEXT,
            created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
        )
    """)

    op.execute("CREATE INDEX IF NOT EXISTS ix_svc_requests_client ON portail.service_requests (client_id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_svc_requests_status ON portail.service_requests (status)")

    op.execute("""
        CREATE TABLE IF NOT EXISTS portail.audit_results (
            id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            client_id    UUID NOT NULL REFERENCES portail.clients(id) ON DELETE CASCADE,
            target       VARCHAR(500) NOT NULL,
            score        INTEGER NOT NULL DEFAULT 0,
            results      TEXT NOT NULL DEFAULT '{}',
            created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
        )
    """)

    op.execute("CREATE INDEX IF NOT EXISTS ix_audit_results_client ON portail.audit_results (client_id)")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS portail.audit_results")
    op.execute("DROP TABLE IF EXISTS portail.service_requests")
    op.execute("DROP TYPE IF EXISTS portail.requeststatus")
    op.execute("""
        ALTER TABLE portail.clients
            DROP COLUMN IF EXISTS password_hash,
            DROP COLUMN IF EXISTS is_portal_active,
            DROP COLUMN IF EXISTS portal_activated_at
    """)
