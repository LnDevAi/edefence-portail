import enum
import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, Enum, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.contract import Contract
    from app.models.invoice import Invoice


class ClientStatus(str, enum.Enum):
    PROSPECT = "prospect"
    ACTIF = "actif"
    INACTIF = "inactif"


class Client(Base):
    __tablename__ = "clients"
    __table_args__ = {"schema": "portail"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    contact_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    sector: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    country: Mapped[str] = mapped_column(String(100), default="Burkina Faso", nullable=False)
    status: Mapped[ClientStatus] = mapped_column(
        Enum(ClientStatus, schema="portail", values_callable=lambda obj: [e.value for e in obj]),
        default=ClientStatus.PROSPECT,
        nullable=False,
        index=True,
    )
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    contracts: Mapped[list["Contract"]] = relationship(
        "Contract", back_populates="client", lazy="noload"
    )
    invoices: Mapped[list["Invoice"]] = relationship(
        "Invoice", back_populates="client", lazy="noload"
    )

    def __repr__(self) -> str:
        return f"<Client id={self.id} company={self.company_name}>"
