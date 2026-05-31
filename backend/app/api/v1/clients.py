from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_admin_user
from app.core.database import get_db
from app.core.security import hash_password
from app.models.client import Client, ClientStatus
from app.schemas.client import ClientCreate, ClientListResponse, ClientResponse, ClientUpdate
from app.schemas.client_portal import ClientSetPasswordRequest

router = APIRouter(prefix="/clients", tags=["clients"])


@router.get("", response_model=ClientListResponse)
async def list_clients(
    status_filter: Optional[ClientStatus] = Query(None, alias="status"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> ClientListResponse:
    q = select(Client)
    if status_filter is not None:
        q = q.where(Client.status == status_filter)
    q = q.order_by(Client.created_at.desc())

    total_result = await db.execute(select(func.count()).select_from(q.subquery()))
    total = total_result.scalar_one()

    result = await db.execute(q.offset(offset).limit(limit))
    items = result.scalars().all()

    return ClientListResponse(
        items=[ClientResponse.model_validate(c) for c in items],
        total=total,
    )


@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(
    client_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> ClientResponse:
    result = await db.execute(select(Client).where(Client.id == client_id))
    client = result.scalar_one_or_none()
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client introuvable")
    return ClientResponse.model_validate(client)


@router.post("", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
async def create_client(
    payload: ClientCreate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> ClientResponse:
    client = Client(**payload.model_dump())
    db.add(client)
    await db.flush()
    await db.refresh(client)
    return ClientResponse.model_validate(client)


@router.put("/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: uuid.UUID,
    payload: ClientUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> ClientResponse:
    result = await db.execute(select(Client).where(Client.id == client_id))
    client = result.scalar_one_or_none()
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client introuvable")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(client, field, value)
    client.updated_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(client)
    return ClientResponse.model_validate(client)


@router.post("/{client_id}/set-password", response_model=ClientResponse)
async def set_client_password(
    client_id: uuid.UUID,
    payload: ClientSetPasswordRequest,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> ClientResponse:
    result = await db.execute(select(Client).where(Client.id == client_id))
    client = result.scalar_one_or_none()
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client introuvable")
    client.password_hash = hash_password(payload.password)
    client.is_portal_active = True
    client.portal_activated_at = datetime.now(timezone.utc)
    client.updated_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(client)
    return ClientResponse.model_validate(client)


@router.delete("/{client_id}", status_code=status.HTTP_200_OK)
async def delete_client(
    client_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> dict:
    result = await db.execute(select(Client).where(Client.id == client_id))
    client = result.scalar_one_or_none()
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client introuvable")
    await db.delete(client)
    await db.flush()
    return {"detail": "Client supprimé"}
