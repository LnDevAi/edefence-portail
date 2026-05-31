from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_admin_user
from app.core.database import get_db
from app.models.article import Article
from app.models.client import Client, ClientStatus
from app.models.contract import Contract, ContractStatus
from app.models.invoice import Invoice, InvoiceStatus
from app.schemas.stats import StatsResponse

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("", response_model=StatsResponse)
async def get_stats(
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> StatsResponse:
    # Clients
    total_clients_r = await db.execute(select(func.count(Client.id)))
    total_clients = total_clients_r.scalar_one()

    active_clients_r = await db.execute(
        select(func.count(Client.id)).where(Client.status == ClientStatus.ACTIF.value)
    )
    active_clients = active_clients_r.scalar_one()

    prospects_r = await db.execute(
        select(func.count(Client.id)).where(Client.status == ClientStatus.PROSPECT.value)
    )
    prospects = prospects_r.scalar_one()

    # Contracts
    total_contracts_r = await db.execute(select(func.count(Contract.id)))
    total_contracts = total_contracts_r.scalar_one()

    active_contracts_r = await db.execute(
        select(func.count(Contract.id)).where(Contract.status == ContractStatus.ACTIF.value)
    )
    active_contracts = active_contracts_r.scalar_one()

    # Revenue: sum of paid invoices
    total_revenue_r = await db.execute(
        select(func.coalesce(func.sum(Invoice.amount_fcfa), 0)).where(
            Invoice.status == InvoiceStatus.PAYE.value
        )
    )
    total_revenue_fcfa = total_revenue_r.scalar_one()

    # Invoices
    pending_r = await db.execute(
        select(func.count(Invoice.id)).where(Invoice.status == InvoiceStatus.EN_ATTENTE.value)
    )
    pending_invoices = pending_r.scalar_one()

    overdue_r = await db.execute(
        select(func.count(Invoice.id)).where(Invoice.status == InvoiceStatus.EN_RETARD.value)
    )
    overdue_invoices = overdue_r.scalar_one()

    # Articles
    total_articles_r = await db.execute(select(func.count(Article.id)))
    total_articles = total_articles_r.scalar_one()

    published_r = await db.execute(
        select(func.count(Article.id)).where(Article.is_published == True)  # noqa: E712
    )
    published_articles = published_r.scalar_one()

    return StatsResponse(
        total_clients=total_clients,
        active_clients=active_clients,
        prospects=prospects,
        total_contracts=total_contracts,
        active_contracts=active_contracts,
        total_revenue_fcfa=int(total_revenue_fcfa),
        pending_invoices=pending_invoices,
        overdue_invoices=overdue_invoices,
        total_articles=total_articles,
        published_articles=published_articles,
    )
