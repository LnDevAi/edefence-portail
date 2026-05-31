import enum
import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, Enum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.contract import ServiceType

if TYPE_CHECKING:
    from app.models.client import Client


class RequestStatus(str, enum.Enum):
    EN_ATTENTE = "en_attente"
    EN_COURS = "en_cours"
    ACCEPTE = "accepte"
    REFUSE = "refuse"


class ServiceRequest(Base):
    __tablename__ = "service_requests"
    __table_args__ = {"schema": "portail"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    service_type: Mapped[ServiceType] = mapped_column(
        Enum(ServiceType, schema="portail", values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
    )
    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[RequestStatus] = mapped_column(
        Enum(RequestStatus, schema="portail", name="requeststatus",
             values_callable=lambda obj: [e.value for e in obj]),
        default=RequestStatus.EN_ATTENTE,
        nullable=False,
        index=True,
    )
    admin_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
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

    client: Mapped["Client"] = relationship("Client", back_populates="service_requests")
