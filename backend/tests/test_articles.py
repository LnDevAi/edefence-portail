from __future__ import annotations

import pytest
from httpx import AsyncClient


ARTICLE_PAYLOAD = {
    "title": "Introduction à la cybersécurité en Afrique de l'Ouest",
    "content": "La cybersécurité est un enjeu majeur pour les entreprises africaines...",
    "summary": "Un aperçu des défis cybersécurité en Afrique de l'Ouest.",
    "category": "actualite",
    "tags": "cybersécurité,Afrique,UEMOA",
    "is_ai_generated": False,
    "is_published": False,
}


class TestArticles:
    @pytest.mark.asyncio
    async def test_create_article(self, client: AsyncClient, admin_headers: dict) -> None:
        response = await client.post(
            "/api/v1/articles", json=ARTICLE_PAYLOAD, headers=admin_headers
        )
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == ARTICLE_PAYLOAD["title"]
        assert data["is_published"] is False

    @pytest.mark.asyncio
    async def test_list_articles_public(self, client: AsyncClient, admin_headers: dict) -> None:
        # Create an article first
        await client.post("/api/v1/articles", json=ARTICLE_PAYLOAD, headers=admin_headers)
        response = await client.get("/api/v1/articles")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert isinstance(data["items"], list)

    @pytest.mark.asyncio
    async def test_list_articles_published_filter(
        self, client: AsyncClient, admin_headers: dict
    ) -> None:
        # Create an unpublished article
        await client.post("/api/v1/articles", json=ARTICLE_PAYLOAD, headers=admin_headers)

        # Create a published article
        published_payload = {**ARTICLE_PAYLOAD, "title": "Article Publié", "is_published": True}
        await client.post("/api/v1/articles", json=published_payload, headers=admin_headers)

        # Filter published only
        response = await client.get("/api/v1/articles?published=true")
        assert response.status_code == 200
        data = response.json()
        for item in data["items"]:
            assert item["is_published"] is True

    @pytest.mark.asyncio
    async def test_get_article_by_id(self, client: AsyncClient, admin_headers: dict) -> None:
        create_resp = await client.post(
            "/api/v1/articles", json=ARTICLE_PAYLOAD, headers=admin_headers
        )
        article_id = create_resp.json()["id"]

        response = await client.get(f"/api/v1/articles/{article_id}")
        assert response.status_code == 200
        assert response.json()["id"] == article_id

    @pytest.mark.asyncio
    async def test_update_article(self, client: AsyncClient, admin_headers: dict) -> None:
        create_resp = await client.post(
            "/api/v1/articles", json=ARTICLE_PAYLOAD, headers=admin_headers
        )
        article_id = create_resp.json()["id"]

        response = await client.put(
            f"/api/v1/articles/{article_id}",
            json={"title": "Titre mis à jour"},
            headers=admin_headers,
        )
        assert response.status_code == 200
        assert response.json()["title"] == "Titre mis à jour"

    @pytest.mark.asyncio
    async def test_publish_article(self, client: AsyncClient, admin_headers: dict) -> None:
        create_resp = await client.post(
            "/api/v1/articles", json=ARTICLE_PAYLOAD, headers=admin_headers
        )
        article_id = create_resp.json()["id"]

        response = await client.post(
            f"/api/v1/articles/{article_id}/publish", headers=admin_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["is_published"] is True
        assert data["published_at"] is not None

    @pytest.mark.asyncio
    async def test_delete_article(self, client: AsyncClient, admin_headers: dict) -> None:
        create_resp = await client.post(
            "/api/v1/articles", json=ARTICLE_PAYLOAD, headers=admin_headers
        )
        article_id = create_resp.json()["id"]

        response = await client.delete(
            f"/api/v1/articles/{article_id}", headers=admin_headers
        )
        assert response.status_code in (200, 204)

        # Verify article is gone
        get_resp = await client.get(f"/api/v1/articles/{article_id}")
        assert get_resp.status_code == 404
