from __future__ import annotations

import json
import re
import socket
import ssl
import uuid
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_client_user
from app.core.database import get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.models.client import Client
from app.models.contract import Contract
from app.models.invoice import Invoice
from app.models.service_request import ServiceRequest
from app.schemas.client_portal import (
    AuditCheckResult,
    AuditRequest,
    AuditResponse,
    ClientLoginRequest,
    ClientSetPasswordRequest,
    ClientTokenResponse,
    ServiceRequestCreate,
    ServiceRequestResponse,
)

router = APIRouter(prefix="/client", tags=["client-portal"])


# ── Auth ──────────────────────────────────────────────────────────────────────

@router.post("/login", response_model=ClientTokenResponse)
async def client_login(
    payload: ClientLoginRequest,
    db: AsyncSession = Depends(get_db),
) -> ClientTokenResponse:
    result = await db.execute(select(Client).where(Client.email == payload.email))
    client = result.scalar_one_or_none()
    if not client or not client.password_hash or not client.is_portal_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identifiants invalides ou accès non activé")
    if not verify_password(payload.password, client.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identifiants invalides ou accès non activé")
    token = create_access_token({"sub": str(client.id), "role": "client", "email": client.email})
    return ClientTokenResponse(
        access_token=token,
        client_id=str(client.id),
        company_name=client.company_name,
    )


# ── Profil ────────────────────────────────────────────────────────────────────

@router.get("/me")
async def client_me(
    current: dict = Depends(get_client_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    cid = uuid.UUID(current["sub"])
    result = await db.execute(select(Client).where(Client.id == cid))
    client = result.scalar_one_or_none()
    if not client:
        raise HTTPException(status_code=404, detail="Client introuvable")
    return {
        "id": str(client.id),
        "company_name": client.company_name,
        "contact_name": client.contact_name,
        "email": client.email,
        "phone": client.phone,
        "sector": client.sector,
        "city": client.city,
        "country": client.country,
        "status": client.status.value,
    }


# ── Dashboard ─────────────────────────────────────────────────────────────────

@router.get("/dashboard")
async def client_dashboard(
    current: dict = Depends(get_client_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    cid = uuid.UUID(current["sub"])

    contracts_res = await db.execute(
        select(Contract).where(Contract.client_id == cid).order_by(Contract.created_at.desc())
    )
    contracts = contracts_res.scalars().all()

    invoices_res = await db.execute(
        select(Invoice).where(Invoice.client_id == cid).order_by(Invoice.created_at.desc())
    )
    invoices = invoices_res.scalars().all()

    requests_res = await db.execute(
        select(ServiceRequest).where(ServiceRequest.client_id == cid).order_by(ServiceRequest.created_at.desc())
    )
    requests = requests_res.scalars().all()

    total_due = sum(inv.amount_fcfa for inv in invoices if inv.status.value == "en_attente")

    return {
        "contracts": [
            {
                "id": str(c.id),
                "service_type": c.service_type.value,
                "status": c.status.value,
                "amount_fcfa": c.amount_fcfa,
                "billing_period": c.billing_period.value,
                "start_date": str(c.start_date),
                "end_date": str(c.end_date) if c.end_date else None,
            }
            for c in contracts
        ],
        "invoices": [
            {
                "id": str(inv.id),
                "invoice_number": inv.invoice_number,
                "amount_fcfa": inv.amount_fcfa,
                "status": inv.status.value,
                "due_date": str(inv.due_date),
                "paid_at": inv.paid_at.isoformat() if inv.paid_at else None,
            }
            for inv in invoices
        ],
        "service_requests": [
            {
                "id": str(r.id),
                "service_type": r.service_type.value,
                "status": r.status.value,
                "message": r.message,
                "created_at": r.created_at.isoformat(),
            }
            for r in requests
        ],
        "stats": {
            "active_contracts": sum(1 for c in contracts if c.status.value == "actif"),
            "pending_invoices": sum(1 for inv in invoices if inv.status.value == "en_attente"),
            "total_due_fcfa": total_due,
            "pending_requests": sum(1 for r in requests if r.status.value == "en_attente"),
        },
    }


# ── Demandes de service ───────────────────────────────────────────────────────

@router.post("/service-requests", response_model=ServiceRequestResponse, status_code=201)
async def create_service_request(
    payload: ServiceRequestCreate,
    current: dict = Depends(get_client_user),
    db: AsyncSession = Depends(get_db),
) -> ServiceRequestResponse:
    cid = uuid.UUID(current["sub"])
    req = ServiceRequest(client_id=cid, service_type=payload.service_type, message=payload.message)
    db.add(req)
    await db.commit()
    await db.refresh(req)
    return ServiceRequestResponse.model_validate(req)


@router.get("/service-requests", response_model=list[ServiceRequestResponse])
async def list_service_requests(
    current: dict = Depends(get_client_user),
    db: AsyncSession = Depends(get_db),
) -> list[ServiceRequestResponse]:
    cid = uuid.UUID(current["sub"])
    result = await db.execute(
        select(ServiceRequest).where(ServiceRequest.client_id == cid).order_by(ServiceRequest.created_at.desc())
    )
    return [ServiceRequestResponse.model_validate(r) for r in result.scalars().all()]


# ── Audit rapide ──────────────────────────────────────────────────────────────

@router.post("/audit", response_model=AuditResponse)
async def quick_audit(
    payload: AuditRequest,
    current: dict = Depends(get_client_user),
) -> AuditResponse:
    target = payload.target.strip().rstrip("/")
    if not target.startswith(("http://", "https://")):
        target = "https://" + target

    domain = re.sub(r"^https?://", "", target).split("/")[0].split(":")[0]
    checks: list[AuditCheckResult] = []
    total = 0

    # 1. DNS resolution
    try:
        socket.gethostbyname(domain)
        checks.append(AuditCheckResult(name="DNS", status="ok", detail="Domaine résolu avec succès", score=10))
        total += 10
    except socket.gaierror:
        checks.append(AuditCheckResult(name="DNS", status="fail", detail="Impossible de résoudre le domaine", score=0))

    # 2. HTTPS / TLS
    try:
        ctx = ssl.create_default_context()
        with socket.create_connection((domain, 443), timeout=5) as sock:
            with ctx.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                not_after = cert.get("notAfter", "")
                checks.append(AuditCheckResult(name="TLS/SSL", status="ok", detail=f"Certificat valide jusqu'au {not_after}", score=20))
                total += 20
    except ssl.SSLCertVerificationError:
        checks.append(AuditCheckResult(name="TLS/SSL", status="fail", detail="Certificat SSL invalide ou auto-signé", score=0))
    except Exception:
        checks.append(AuditCheckResult(name="TLS/SSL", status="warn", detail="Port 443 inaccessible ou pas de HTTPS", score=5))
        total += 5

    # 3. HTTP headers
    try:
        async with httpx.AsyncClient(timeout=8, follow_redirects=True, verify=False) as client:
            resp = await client.get(target)
            headers = {k.lower(): v for k, v in resp.headers.items()}

            hsts = "strict-transport-security" in headers
            xfo = "x-frame-options" in headers
            csp = "content-security-policy" in headers
            xct = "x-content-type-options" in headers
            rp = "referrer-policy" in headers

            header_score = sum([hsts * 15, xfo * 10, csp * 15, xct * 10, rp * 5])
            total += header_score
            missing = [n for n, v in [("HSTS", hsts), ("X-Frame-Options", xfo), ("CSP", csp), ("X-Content-Type-Options", xct), ("Referrer-Policy", rp)] if not v]
            detail = "Tous les en-têtes de sécurité présents" if not missing else f"Manquants : {', '.join(missing)}"
            st = "ok" if not missing else ("warn" if len(missing) <= 2 else "fail")
            checks.append(AuditCheckResult(name="En-têtes HTTP", status=st, detail=detail, score=header_score))

            # 4. HTTP→HTTPS redirect
            if str(resp.url).startswith("https://"):
                checks.append(AuditCheckResult(name="Redirection HTTPS", status="ok", detail="Redirection HTTP→HTTPS active", score=10))
                total += 10
            else:
                checks.append(AuditCheckResult(name="Redirection HTTPS", status="warn", detail="Pas de redirection HTTPS détectée", score=0))

            # 5. Server header
            server = headers.get("server", "")
            if server and any(v in server.lower() for v in ["apache/", "nginx/", "iis/"]):
                checks.append(AuditCheckResult(name="En-tête Server", status="warn", detail=f"Version exposée : {server}", score=0))
            else:
                checks.append(AuditCheckResult(name="En-tête Server", status="ok", detail="Version serveur non exposée", score=5))
                total += 5

    except Exception as exc:
        checks.append(AuditCheckResult(name="En-têtes HTTP", status="fail", detail=f"Site inaccessible : {str(exc)[:80]}", score=0))

    score = min(total, 100)
    if score >= 80:
        grade = "A"
    elif score >= 60:
        grade = "B"
    elif score >= 40:
        grade = "C"
    elif score >= 20:
        grade = "D"
    else:
        grade = "F"

    return AuditResponse(
        target=domain,
        score=score,
        grade=grade,
        checks=checks,
        created_at=datetime.now(timezone.utc).isoformat(),
    )
