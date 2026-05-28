from __future__ import annotations

import pytest
from httpx import AsyncClient


CLIENT_PAYLOAD = {
    "company_name": "Entreprise Facture SARL",
    "contact_name": "Yamalr Admin",
    "email": "facture@entreprise.bf",
    "country": "Burkina Faso",
    "status": "actif",
}


class TestInvoices:
    async def _create_client(self, client: AsyncClient, admin_headers: dict) -> str:
        resp = await client.post("/api/v1/clients", json=CLIENT_PAYLOAD, headers=admin_headers)
        assert resp.status_code == 201
        return resp.json()["id"]

    async def _create_invoice(
        self, client: AsyncClient, admin_headers: dict, client_id: str
    ) -> dict:
        import datetime

        due = (datetime.date.today() + datetime.timedelta(days=30)).isoformat()
        resp = await client.post(
            "/api/v1/invoices",
            json={
                "client_id": client_id,
                "amount_fcfa": 150000,
                "due_date": due,
            },
            headers=admin_headers,
        )
        assert resp.status_code == 201
        return resp.json()

    @pytest.mark.asyncio
    async def test_create_invoice_auto_number(
        self, client: AsyncClient, admin_headers: dict
    ) -> None:
        client_id = await self._create_client(client, admin_headers)
        invoice = await self._create_invoice(client, admin_headers, client_id)

        assert invoice["invoice_number"] is not None
        assert invoice["invoice_number"].startswith("FAC-")
        assert len(invoice["invoice_number"]) > 4

    @pytest.mark.asyncio
    async def test_list_invoices(self, client: AsyncClient, admin_headers: dict) -> None:
        client_id = await self._create_client(client, admin_headers)
        await self._create_invoice(client, admin_headers, client_id)

        response = await client.get("/api/v1/invoices", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    @pytest.mark.asyncio
    async def test_mark_invoice_paid(self, client: AsyncClient, admin_headers: dict) -> None:
        client_id = await self._create_client(client, admin_headers)
        invoice = await self._create_invoice(client, admin_headers, client_id)
        invoice_id = invoice["id"]

        # Mark as paid
        response = await client.post(
            f"/api/v1/invoices/{invoice_id}/mark-paid",
            json={"payment_method": "Mobile Money", "payment_ref": "ORANGE-2026-001"},
            headers=admin_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "paye"
        assert data["paid_at"] is not None
        assert data["payment_method"] == "Mobile Money"
        assert data["payment_ref"] == "ORANGE-2026-001"
