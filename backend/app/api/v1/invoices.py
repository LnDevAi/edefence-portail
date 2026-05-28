from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_admin_user
from app.core.database import get_db
from app.models.client import Client
from app.models.invoice import Invoice, InvoiceStatus
from app.schemas.invoice import (
    InvoiceCreate,
    InvoiceResponse,
    InvoiceUpdate,
    MarkPaidRequest,
)

router = APIRouter(prefix="/invoices", tags=["invoices"])


def _generate_invoice_number(now: datetime) -> str:
    """Generate invoice number: FAC-YYYYMM-XXXX (random 4-digit suffix)."""
    import random
    suffix = random.randint(1000, 9999)
    return f"FAC-{now.strftime('%Y%m')}-{suffix}"


@router.get("", response_model=list[InvoiceResponse])
async def list_invoices(
    client_id: Optional[uuid.UUID] = Query(None),
    invoice_status: Optional[InvoiceStatus] = Query(None, alias="status"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> list[InvoiceResponse]:
    q = select(Invoice)
    if client_id is not None:
        q = q.where(Invoice.client_id == client_id)
    if invoice_status is not None:
        q = q.where(Invoice.status == invoice_status)
    q = q.order_by(Invoice.created_at.desc())

    result = await db.execute(q.offset(offset).limit(limit))
    items = result.scalars().all()
    return [InvoiceResponse.model_validate(i) for i in items]


@router.get("/{invoice_id}", response_model=InvoiceResponse)
async def get_invoice(
    invoice_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> InvoiceResponse:
    result = await db.execute(select(Invoice).where(Invoice.id == invoice_id))
    invoice = result.scalar_one_or_none()
    if invoice is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Facture introuvable")
    return InvoiceResponse.model_validate(invoice)


@router.post("", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
async def create_invoice(
    payload: InvoiceCreate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> InvoiceResponse:
    # Verify client exists
    client_result = await db.execute(select(Client).where(Client.id == payload.client_id))
    if client_result.scalar_one_or_none() is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client introuvable")

    now = datetime.now(timezone.utc)
    data = payload.model_dump()

    # Auto-generate invoice number if not provided
    if not data.get("invoice_number"):
        # Ensure uniqueness by retrying on collision
        for _ in range(10):
            candidate = _generate_invoice_number(now)
            existing = await db.execute(
                select(Invoice).where(Invoice.invoice_number == candidate)
            )
            if existing.scalar_one_or_none() is None:
                data["invoice_number"] = candidate
                break
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Impossible de générer un numéro de facture unique",
            )

    invoice = Invoice(**data)
    db.add(invoice)
    await db.flush()
    await db.refresh(invoice)
    return InvoiceResponse.model_validate(invoice)


@router.put("/{invoice_id}", response_model=InvoiceResponse)
async def update_invoice(
    invoice_id: uuid.UUID,
    payload: InvoiceUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> InvoiceResponse:
    result = await db.execute(select(Invoice).where(Invoice.id == invoice_id))
    invoice = result.scalar_one_or_none()
    if invoice is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Facture introuvable")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(invoice, field, value)
    await db.flush()
    await db.refresh(invoice)
    return InvoiceResponse.model_validate(invoice)


@router.delete("/{invoice_id}", status_code=status.HTTP_200_OK)
async def delete_invoice(
    invoice_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> dict:
    result = await db.execute(select(Invoice).where(Invoice.id == invoice_id))
    invoice = result.scalar_one_or_none()
    if invoice is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Facture introuvable")
    await db.delete(invoice)
    await db.flush()
    return {"detail": "Facture supprimée"}


@router.post("/{invoice_id}/mark-paid", response_model=InvoiceResponse)
async def mark_invoice_paid(
    invoice_id: uuid.UUID,
    payload: MarkPaidRequest,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> InvoiceResponse:
    result = await db.execute(select(Invoice).where(Invoice.id == invoice_id))
    invoice = result.scalar_one_or_none()
    if invoice is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Facture introuvable")

    invoice.status = InvoiceStatus.PAYE
    invoice.paid_at = datetime.now(timezone.utc)
    invoice.payment_method = payload.payment_method
    invoice.payment_ref = payload.payment_ref
    await db.flush()
    await db.refresh(invoice)
    return InvoiceResponse.model_validate(invoice)
