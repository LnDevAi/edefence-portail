import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.contract import ServiceType
from app.models.service_request import RequestStatus


class ClientLoginRequest(BaseModel):
    email: EmailStr
    password: str


class ClientTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    client_id: str
    company_name: str


class ClientSetPasswordRequest(BaseModel):
    password: str


class ServiceRequestCreate(BaseModel):
    service_type: ServiceType
    message: Optional[str] = None


class ServiceRequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    client_id: uuid.UUID
    service_type: ServiceType
    message: Optional[str]
    status: RequestStatus
    created_at: datetime


class AuditRequest(BaseModel):
    target: str


class AuditCheckResult(BaseModel):
    name: str
    status: str
    detail: str
    score: int


class AuditResponse(BaseModel):
    target: str
    score: int
    grade: str
    checks: list[AuditCheckResult]
    created_at: str
