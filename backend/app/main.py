from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
import app.models  # noqa: F401 — register all models with SQLAlchemy

app = FastAPI(title="E-DEFENCE Portail API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.v1 import auth, articles, clients, contracts, invoices, stats  # noqa: E402

app.include_router(auth.router, prefix="/api/v1")
app.include_router(articles.router, prefix="/api/v1")
app.include_router(clients.router, prefix="/api/v1")
app.include_router(contracts.router, prefix="/api/v1")
app.include_router(invoices.router, prefix="/api/v1")
app.include_router(stats.router, prefix="/api/v1")


@app.on_event("startup")
async def startup() -> None:
    from app.core.database import init_db

    # Only auto-create tables in dev (SQLite)
    if settings.DATABASE_URL.startswith("sqlite"):
        await init_db()


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "service": "edefence-portail-api"}
