import enum
import uuid
from datetime import date, datetime, timezone
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.client import Client
    from app.models.contract import Contract


class InvoiceStatus(str, enum.Enum):
    EN_ATTENTE = "en_attente"
    PAYE = "paye"
    EN_RETARD = "en_retard"
    ANNULE = "annule"


class Invoice(Base):
    __tablename__ = "invoices"
    __table_args__ = {"schema": "portail"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("portail.clients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    contract_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("portail.contracts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    invoice_number: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    amount_fcfa: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[InvoiceStatus] = mapped_column(
        Enum(InvoiceStatus, schema="portail", values_callable=lambda obj: [e.value for e in obj]),
        default=InvoiceStatus.EN_ATTENTE,
        nullable=False,
        index=True,
    )
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    paid_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    payment_method: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    payment_ref: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    client: Mapped["Client"] = relationship("Client", back_populates="invoices", lazy="noload")
    contract: Mapped[Optional["Contract"]] = relationship(
        "Contract", back_populates="invoices", lazy="noload"
    )

    def __repr__(self) -> str:
        return f"<Invoice id={self.id} num={self.invoice_number} status={self.status}>"
