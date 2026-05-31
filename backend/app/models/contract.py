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
    from app.models.invoice import Invoice


class ServiceType(str, enum.Enum):
    BOITIER = "boitier"
    SOC = "soc"
    SAUVEGARDE = "sauvegarde"
    AUDIT360 = "audit360"
    CYBERACADEMY = "cyberacademy"


class BillingPeriod(str, enum.Enum):
    MENSUEL = "mensuel"
    ANNUEL = "annuel"
    UNIQUE = "unique"


class ContractStatus(str, enum.Enum):
    ACTIF = "actif"
    EXPIRE = "expire"
    SUSPENDU = "suspendu"
    RESILIE = "resilie"


class Contract(Base):
    __tablename__ = "contracts"
    __table_args__ = {"schema": "portail"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("portail.clients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    service_type: Mapped[ServiceType] = mapped_column(
        Enum(ServiceType, schema="portail", values_callable=lambda obj: [e.value for e in obj]), nullable=False
    )
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    amount_fcfa: Mapped[int] = mapped_column(Integer, nullable=False)
    billing_period: Mapped[BillingPeriod] = mapped_column(
        Enum(BillingPeriod, schema="portail", values_callable=lambda obj: [e.value for e in obj]),
        default=BillingPeriod.MENSUEL,
        nullable=False,
    )
    status: Mapped[ContractStatus] = mapped_column(
        Enum(ContractStatus, schema="portail", values_callable=lambda obj: [e.value for e in obj]),
        default=ContractStatus.ACTIF,
        nullable=False,
        index=True,
    )
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    client: Mapped["Client"] = relationship("Client", back_populates="contracts", lazy="noload")
    invoices: Mapped[list["Invoice"]] = relationship(
        "Invoice", back_populates="contract", lazy="noload"
    )

    def __repr__(self) -> str:
        return f"<Contract id={self.id} service={self.service_type} status={self.status}>"
