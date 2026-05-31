from __future__ import annotations

import json
import random
import re
import socket
import ssl
import string
import uuid
from datetime import date, datetime, timedelta, timezone

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_client_user
from app.core.database import get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.models.client import Client, ClientStatus
from app.models.contract import BillingPeriod, Contract, ContractStatus, ServiceType
from app.models.invoice import Invoice, InvoiceStatus
from app.models.service_request import ServiceRequest
from app.schemas.client_portal import (
    AuditCheckResult,
    AuditRequest,
    AuditResponse,
    ClientLoginRequest,
    ClientRegisterRequest,
    ClientSetPasswordRequest,
    ClientTokenResponse,
    PayInvoiceRequest,
    ServiceRequestCreate,
    ServiceRequestResponse,
    SubscribeRequest,
)

router = APIRouter(prefix="/client", tags=["client-portal"])

# ── Service catalog ─────────────────────────────────────────────────────────

CATALOG = [
    {"id": "boitier", "name": "Boîtier EDR", "description": "Protection endpoint avancée — détection et réponse aux menaces en temps réel", "price_fcfa": 15000, "billing": "mensuel", "icon": "shield"},
    {"id": "soc", "name": "SOC Managé", "description": "Surveillance 24/7 par nos experts certifiés — alertes et réponse incidents", "price_fcfa": 200000, "billing": "mensuel", "icon": "eye"},
    {"id": "sauvegarde", "name": "Sauvegarde Cloud", "description": "Continuité métier garantie — RPO 1h, RTO 4h, chiffrement AES-256", "price_fcfa": 50000, "billing": "mensuel", "icon": "database"},
    {"id": "audit360", "name": "Audit 360°", "description": "Diagnostic sécurité complet — rapport PDF + recommandations prioritisées", "price_fcfa": 500000, "billing": "unique", "icon": "search"},
    {"id": "cyberacademy", "name": "Cyber Academy", "description": "Formation certifiante pour votre équipe — 10 modules, certif reconnue UEMOA", "price_fcfa": 100000, "billing": "mensuel", "icon": "book"},
]

CATALOG_MAP = {item["id"]: item for item in CATALOG}


# ── Catalog (public) ─────────────────────────────────────────────────────────

catalog_router = APIRouter(tags=["catalog"])

@catalog_router.get("/catalog")
async def get_catalog() -> list[dict]:
    return CATALOG


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


@router.post("/register", response_model=ClientTokenResponse, status_code=201)
async def client_register(
    payload: ClientRegisterRequest,
    db: AsyncSession = Depends(get_db),
) -> ClientTokenResponse:
    # Check duplicate email
    existing = await db.execute(select(Client).where(Client.email == payload.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Un compte avec cet email existe déjà")

    client = Client(
        company_name=payload.company_name,
        contact_name=payload.contact_name,
        email=payload.email,
        phone=payload.phone,
        sector=payload.sector,
        city=payload.city,
        country=payload.country,
        status=ClientStatus.ACTIF,
        is_portal_active=True,
        password_hash=hash_password(payload.password),
        portal_activated_at=datetime.now(timezone.utc),
    )
    db.add(client)
    await db.commit()
    await db.refresh(client)

    token = create_access_token({"sub": str(client.id), "role": "client", "email": client.email})
    return ClientTokenResponse(
        access_token=token,
        client_id=str(client.id),
        company_name=client.company_name,
    )


# ── Subscribe ─────────────────────────────────────────────────────────────────

@router.post("/subscribe", status_code=201)
async def client_subscribe(
    payload: SubscribeRequest,
    current: dict = Depends(get_client_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    cid = uuid.UUID(current["sub"])

    # Validate service type
    if payload.service_type not in CATALOG_MAP:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Service inconnu")

    svc = CATALOG_MAP[payload.service_type]

    # Check for existing active contract for this service
    existing = await db.execute(
        select(Contract).where(
            Contract.client_id == cid,
            Contract.service_type == ServiceType(payload.service_type),
            Contract.status == ContractStatus.ACTIF,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Vous avez déjà un contrat actif pour ce service")

    billing = BillingPeriod.UNIQUE if svc["billing"] == "unique" else BillingPeriod.MENSUEL
    today = date.today()

    contract = Contract(
        client_id=cid,
        service_type=ServiceType(payload.service_type),
        status=ContractStatus.ACTIF,
        start_date=today,
        amount_fcfa=svc["price_fcfa"],
        billing_period=billing,
    )
    db.add(contract)
    await db.flush()  # get contract.id

    # Generate unique invoice number
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    invoice_number = f"FAC-{today.year}-{suffix}"

    invoice = Invoice(
        client_id=cid,
        contract_id=contract.id,
        invoice_number=invoice_number,
        amount_fcfa=svc["price_fcfa"],
        status=InvoiceStatus.EN_ATTENTE,
        due_date=today + timedelta(days=30),
    )
    db.add(invoice)
    await db.commit()
    await db.refresh(invoice)

    return {
        "contract_id": str(contract.id),
        "invoice_id": str(invoice.id),
        "invoice_number": invoice.invoice_number,
        "amount_fcfa": invoice.amount_fcfa,
        "service_name": svc["name"],
    }


# ── Pay invoice ───────────────────────────────────────────────────────────────

@router.post("/invoices/{invoice_id}/pay")
async def pay_invoice(
    invoice_id: uuid.UUID,
    payload: PayInvoiceRequest,
    current: dict = Depends(get_client_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    cid = uuid.UUID(current["sub"])

    result = await db.execute(select(Invoice).where(Invoice.id == invoice_id))
    invoice = result.scalar_one_or_none()
    if not invoice:
        raise HTTPException(status_code=404, detail="Facture introuvable")
    if invoice.client_id != cid:
        raise HTTPException(status_code=403, detail="Accès refusé")
    if invoice.status != InvoiceStatus.EN_ATTENTE:
        raise HTTPException(status_code=409, detail="Cette facture n'est pas en attente de paiement")

    invoice.status = InvoiceStatus.PAYE
    invoice.paid_at = datetime.now(timezone.utc)
    invoice.payment_method = payload.payment_method
    invoice.payment_ref = payload.payment_ref or "".join(random.choices(string.ascii_uppercase + string.digits, k=12))

    await db.commit()
    await db.refresh(invoice)

    return {
        "id": str(invoice.id),
        "invoice_number": invoice.invoice_number,
        "amount_fcfa": invoice.amount_fcfa,
        "status": invoice.status.value,
        "paid_at": invoice.paid_at.isoformat(),
        "payment_method": invoice.payment_method,
        "payment_ref": invoice.payment_ref,
    }


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
