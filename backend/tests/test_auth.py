from __future__ import annotations

import pytest
from httpx import AsyncClient


class TestAuth:
    @pytest.mark.asyncio
    async def test_login_valid(self, client: AsyncClient) -> None:
        response = await client.post(
            "/api/v1/auth/login",
            json={"email": "admin@edefence.tech", "password": "admin"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    @pytest.mark.asyncio
    async def test_login_wrong_password(self, client: AsyncClient) -> None:
        response = await client.post(
            "/api/v1/auth/login",
            json={"email": "admin@edefence.tech", "password": "wrongpassword"},
        )
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_login_unknown_email(self, client: AsyncClient) -> None:
        response = await client.post(
            "/api/v1/auth/login",
            json={"email": "unknown@example.com", "password": "admin"},
        )
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_protected_without_token(self, client: AsyncClient) -> None:
        response = await client.get("/api/v1/clients")
        assert response.status_code == 403
