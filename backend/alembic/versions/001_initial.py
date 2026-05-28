"""Initial schema creation for E-DEFENCE Portail

Revision ID: 001_initial
Revises:
Create Date: 2026-05-28 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── Schema ─────────────────────────────────────────────────────────────────
    op.execute("CREATE SCHEMA IF NOT EXISTS portail")

    # ── Enums ──────────────────────────────────────────────────────────────────
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE portail.articlecategory AS ENUM (
                'actualite', 'alerte', 'tutorial', 'article_maison'
            );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
    """)

    op.execute("""
        DO $$ BEGIN
            CREATE TYPE portail.clientstatus AS ENUM (
                'prospect', 'actif', 'inactif'
            );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
    """)

    op.execute("""
        DO $$ BEGIN
            CREATE TYPE portail.servicetype AS ENUM (
                'boitier', 'soc', 'sauvegarde', 'audit360', 'cyberacademy'
            );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
    """)

    op.execute("""
        DO $$ BEGIN
            CREATE TYPE portail.billingperiod AS ENUM (
                'mensuel', 'annuel', 'unique'
            );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
    """)

    op.execute("""
        DO $$ BEGIN
            CREATE TYPE portail.contractstatus AS ENUM (
                'actif', 'expire', 'suspendu', 'resilie'
            );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
    """)

    op.execute("""
        DO $$ BEGIN
            CREATE TYPE portail.invoicestatus AS ENUM (
                'en_attente', 'paye', 'en_retard', 'annule'
            );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
    """)

    # ── Table: articles ────────────────────────────────────────────────────────
    op.create_table(
        "articles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("content", sa.Text, nullable=False),
        sa.Column("summary", sa.Text, nullable=True),
        sa.Column("source_url", sa.String(2000), nullable=True),
        sa.Column("image_url", sa.String(2000), nullable=True),
        sa.Column(
            "category",
            sa.Enum(
                "actualite", "alerte", "tutorial", "article_maison",
                name="articlecategory",
                schema="portail",
            ),
            nullable=False,
            server_default="actualite",
        ),
        sa.Column("tags", sa.String(500), nullable=True),
        sa.Column("is_ai_generated", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("is_published", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        schema="portail",
    )

    # ── Table: clients ─────────────────────────────────────────────────────────
    op.create_table(
        "clients",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("company_name", sa.String(255), nullable=False),
        sa.Column("contact_name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(50), nullable=True),
        sa.Column("sector", sa.String(100), nullable=True),
        sa.Column("address", sa.Text, nullable=True),
        sa.Column("city", sa.String(100), nullable=True),
        sa.Column("country", sa.String(100), nullable=False, server_default="Burkina Faso"),
        sa.Column(
            "status",
            sa.Enum(
                "prospect", "actif", "inactif",
                name="clientstatus",
                schema="portail",
            ),
            nullable=False,
            server_default="prospect",
        ),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        schema="portail",
    )
    op.create_index("ix_clients_email", "clients", ["email"], schema="portail")
    op.create_index("ix_clients_status", "clients", ["status"], schema="portail")

    # ── Table: contracts ───────────────────────────────────────────────────────
    op.create_table(
        "contracts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "client_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("portail.clients.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "service_type",
            sa.Enum(
                "boitier", "soc", "sauvegarde", "audit360", "cyberacademy",
                name="servicetype",
                schema="portail",
            ),
            nullable=False,
        ),
        sa.Column("start_date", sa.Date, nullable=False),
        sa.Column("end_date", sa.Date, nullable=True),
        sa.Column("amount_fcfa", sa.Integer, nullable=False),
        sa.Column(
            "billing_period",
            sa.Enum(
                "mensuel", "annuel", "unique",
                name="billingperiod",
                schema="portail",
            ),
            nullable=False,
            server_default="mensuel",
        ),
        sa.Column(
            "status",
            sa.Enum(
                "actif", "expire", "suspendu", "resilie",
                name="contractstatus",
                schema="portail",
            ),
            nullable=False,
            server_default="actif",
        ),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        schema="portail",
    )
    op.create_index("ix_contracts_client_id", "contracts", ["client_id"], schema="portail")
    op.create_index("ix_contracts_status", "contracts", ["status"], schema="portail")

    # ── Table: invoices ────────────────────────────────────────────────────────
    op.create_table(
        "invoices",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "client_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("portail.clients.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "contract_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("portail.contracts.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("invoice_number", sa.String(50), nullable=False, unique=True),
        sa.Column("amount_fcfa", sa.Integer, nullable=False),
        sa.Column(
            "status",
            sa.Enum(
                "en_attente", "paye", "en_retard", "annule",
                name="invoicestatus",
                schema="portail",
            ),
            nullable=False,
            server_default="en_attente",
        ),
        sa.Column("due_date", sa.Date, nullable=False),
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("payment_method", sa.String(100), nullable=True),
        sa.Column("payment_ref", sa.String(255), nullable=True),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        schema="portail",
    )
    op.create_index("ix_invoices_client_id", "invoices", ["client_id"], schema="portail")
    op.create_index("ix_invoices_contract_id", "invoices", ["contract_id"], schema="portail")
    op.create_index("ix_invoices_status", "invoices", ["status"], schema="portail")


def downgrade() -> None:
    op.drop_table("invoices", schema="portail")
    op.drop_table("contracts", schema="portail")
    op.drop_table("clients", schema="portail")
    op.drop_table("articles", schema="portail")

    op.execute("DROP TYPE IF EXISTS portail.invoicestatus")
    op.execute("DROP TYPE IF EXISTS portail.contractstatus")
    op.execute("DROP TYPE IF EXISTS portail.billingperiod")
    op.execute("DROP TYPE IF EXISTS portail.servicetype")
    op.execute("DROP TYPE IF EXISTS portail.clientstatus")
    op.execute("DROP TYPE IF EXISTS portail.articlecategory")

    op.execute("DROP SCHEMA IF EXISTS portail CASCADE")
