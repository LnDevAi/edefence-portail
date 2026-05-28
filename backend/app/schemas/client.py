import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.client import ClientStatus


class ClientCreate(BaseModel):
    company_name: str
    contact_name: str
    email: EmailStr
    phone: Optional[str] = None
    sector: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: str = "Burkina Faso"
    status: ClientStatus = ClientStatus.PROSPECT
    notes: Optional[str] = None


class ClientUpdate(BaseModel):
    company_name: Optional[str] = None
    contact_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    sector: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    status: Optional[ClientStatus] = None
    notes: Optional[str] = None


class ClientResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_name: str
    contact_name: str
    email: str
    phone: Optional[str]
    sector: Optional[str]
    address: Optional[str]
    city: Optional[str]
    country: str
    status: ClientStatus
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime


class ClientListResponse(BaseModel):
    items: list[ClientResponse]
    total: int
