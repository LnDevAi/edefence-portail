from __future__ import annotations

import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_admin_user
from app.core.database import get_db
from app.models.client import Client
from app.models.contract import Contract
from app.schemas.contract import ContractCreate, ContractResponse, ContractUpdate

router = APIRouter(prefix="/contracts", tags=["contracts"])


@router.get("", response_model=list[ContractResponse])
async def list_contracts(
    client_id: Optional[uuid.UUID] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> list[ContractResponse]:
    q = select(Contract)
    if client_id is not None:
        q = q.where(Contract.client_id == client_id)
    q = q.order_by(Contract.created_at.desc())

    result = await db.execute(q.offset(offset).limit(limit))
    items = result.scalars().all()
    return [ContractResponse.model_validate(c) for c in items]


@router.get("/{contract_id}", response_model=ContractResponse)
async def get_contract(
    contract_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> ContractResponse:
    result = await db.execute(select(Contract).where(Contract.id == contract_id))
    contract = result.scalar_one_or_none()
    if contract is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contrat introuvable")
    return ContractResponse.model_validate(contract)


@router.post("", response_model=ContractResponse, status_code=status.HTTP_201_CREATED)
async def create_contract(
    payload: ContractCreate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> ContractResponse:
    # Verify client exists
    client_result = await db.execute(select(Client).where(Client.id == payload.client_id))
    if client_result.scalar_one_or_none() is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client introuvable")

    contract = Contract(**payload.model_dump())
    db.add(contract)
    await db.flush()
    await db.refresh(contract)
    return ContractResponse.model_validate(contract)


@router.put("/{contract_id}", response_model=ContractResponse)
async def update_contract(
    contract_id: uuid.UUID,
    payload: ContractUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> ContractResponse:
    result = await db.execute(select(Contract).where(Contract.id == contract_id))
    contract = result.scalar_one_or_none()
    if contract is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contrat introuvable")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(contract, field, value)
    await db.flush()
    await db.refresh(contract)
    return ContractResponse.model_validate(contract)


@router.delete("/{contract_id}", status_code=status.HTTP_200_OK)
async def delete_contract(
    contract_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> dict:
    result = await db.execute(select(Contract).where(Contract.id == contract_id))
    contract = result.scalar_one_or_none()
    if contract is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contrat introuvable")
    await db.delete(contract)
    await db.flush()
    return {"detail": "Contrat supprimé"}
