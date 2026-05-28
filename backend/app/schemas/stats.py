from pydantic import BaseModel


class StatsResponse(BaseModel):
    total_clients: int
    active_clients: int
    prospects: int
    total_contracts: int
    active_contracts: int
    total_revenue_fcfa: int
    pending_invoices: int
    overdue_invoices: int
    total_articles: int
    published_articles: int
