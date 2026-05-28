import uuid
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.invoice import InvoiceStatus


class InvoiceCreate(BaseModel):
    client_id: uuid.UUID
    contract_id: Optional[uuid.UUID] = None
    invoice_number: Optional[str] = None  # auto-generated if not provided (FAC-YYYYMM-XXXX)
    amount_fcfa: int
    status: InvoiceStatus = InvoiceStatus.EN_ATTENTE
    due_date: date
    notes: Optional[str] = None


class InvoiceUpdate(BaseModel):
    amount_fcfa: Optional[int] = None
    status: Optional[InvoiceStatus] = None
    due_date: Optional[date] = None
    payment_method: Optional[str] = None
    payment_ref: Optional[str] = None
    notes: Optional[str] = None


class MarkPaidRequest(BaseModel):
    payment_method: str
    payment_ref: Optional[str] = None


class InvoiceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    client_id: uuid.UUID
    contract_id: Optional[uuid.UUID]
    invoice_number: str
    amount_fcfa: int
    status: InvoiceStatus
    due_date: date
    paid_at: Optional[datetime]
    payment_method: Optional[str]
    payment_ref: Optional[str]
    notes: Optional[str]
    created_at: datetime
