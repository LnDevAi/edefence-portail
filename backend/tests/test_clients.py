from __future__ import annotations

import pytest
from httpx import AsyncClient


CLIENT_PAYLOAD = {
    "company_name": "Société Test SARL",
    "contact_name": "Moussa Neyma",
    "email": "contact@societe-test.bf",
    "phone": "+226 70 00 00 00",
    "sector": "Finance",
    "city": "Ouagadougou",
    "country": "Burkina Faso",
    "status": "prospect",
}


class TestClients:
    @pytest.mark.asyncio
    async def test_create_client(self, client: AsyncClient, admin_headers: dict) -> None:
        response = await client.post(
            "/api/v1/clients", json=CLIENT_PAYLOAD, headers=admin_headers
        )
        assert response.status_code == 201
        data = response.json()
        assert data["company_name"] == CLIENT_PAYLOAD["company_name"]
        assert data["email"] == CLIENT_PAYLOAD["email"]
        assert "id" in data

    @pytest.mark.asyncio
    async def test_list_clients(self, client: AsyncClient, admin_headers: dict) -> None:
        await client.post("/api/v1/clients", json=CLIENT_PAYLOAD, headers=admin_headers)
        response = await client.get("/api/v1/clients", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert len(data["items"]) >= 1

    @pytest.mark.asyncio
    async def test_get_client(self, client: AsyncClient, admin_headers: dict) -> None:
        create_resp = await client.post(
            "/api/v1/clients", json=CLIENT_PAYLOAD, headers=admin_headers
        )
        client_id = create_resp.json()["id"]

        response = await client.get(f"/api/v1/clients/{client_id}", headers=admin_headers)
        assert response.status_code == 200
        assert response.json()["id"] == client_id

    @pytest.mark.asyncio
    async def test_update_client(self, client: AsyncClient, admin_headers: dict) -> None:
        create_resp = await client.post(
            "/api/v1/clients", json=CLIENT_PAYLOAD, headers=admin_headers
        )
        client_id = create_resp.json()["id"]

        response = await client.put(
            f"/api/v1/clients/{client_id}",
            json={"status": "actif", "city": "Bobo-Dioulasso"},
            headers=admin_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "actif"
        assert data["city"] == "Bobo-Dioulasso"

    @pytest.mark.asyncio
    async def test_delete_client(self, client: AsyncClient, admin_headers: dict) -> None:
        create_resp = await client.post(
            "/api/v1/clients", json=CLIENT_PAYLOAD, headers=admin_headers
        )
        client_id = create_resp.json()["id"]

        response = await client.delete(f"/api/v1/clients/{client_id}", headers=admin_headers)
        assert response.status_code in (200, 204)

        # Verify deletion
        get_resp = await client.get(f"/api/v1/clients/{client_id}", headers=admin_headers)
        assert get_resp.status_code == 404

    @pytest.mark.asyncio
    async def test_list_clients_unauthenticated(self, client: AsyncClient) -> None:
        response = await client.get("/api/v1/clients")
        assert response.status_code == 403
