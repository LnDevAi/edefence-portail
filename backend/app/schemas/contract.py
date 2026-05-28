import uuid
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.contract import BillingPeriod, ContractStatus, ServiceType


class ContractCreate(BaseModel):
    client_id: uuid.UUID
    service_type: ServiceType
    start_date: date
    end_date: Optional[date] = None
    amount_fcfa: int
    billing_period: BillingPeriod = BillingPeriod.MENSUEL
    status: ContractStatus = ContractStatus.ACTIF
    notes: Optional[str] = None


class ContractUpdate(BaseModel):
    service_type: Optional[ServiceType] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    amount_fcfa: Optional[int] = None
    billing_period: Optional[BillingPeriod] = None
    status: Optional[ContractStatus] = None
    notes: Optional[str] = None


class ContractResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    client_id: uuid.UUID
    service_type: ServiceType
    start_date: date
    end_date: Optional[date]
    amount_fcfa: int
    billing_period: BillingPeriod
    status: ContractStatus
    notes: Optional[str]
    created_at: datetime
