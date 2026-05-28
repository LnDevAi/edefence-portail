from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_admin_user
from app.core.config import settings
from app.core.database import get_db
from app.models.article import Article, ArticleCategory
from app.schemas.article import (
    ArticleCreate,
    ArticleGenerateRequest,
    ArticleListResponse,
    ArticleResponse,
    ArticleUpdate,
)

router = APIRouter(prefix="/articles", tags=["articles"])


# ── Public endpoints ───────────────────────────────────────────────────────────


@router.get("", response_model=ArticleListResponse)
async def list_articles(
    category: Optional[ArticleCategory] = Query(None),
    published: Optional[bool] = Query(None),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
) -> ArticleListResponse:
    q = select(Article)
    if category is not None:
        q = q.where(Article.category == category)
    if published is not None:
        q = q.where(Article.is_published == published)
    q = q.order_by(Article.created_at.desc())

    total_result = await db.execute(select(func.count()).select_from(q.subquery()))
    total = total_result.scalar_one()

    result = await db.execute(q.offset(offset).limit(limit))
    items = result.scalars().all()

    return ArticleListResponse(
        items=[ArticleResponse.model_validate(a) for a in items],
        total=total,
    )


@router.get("/{article_id}", response_model=ArticleResponse)
async def get_article(
    article_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> ArticleResponse:
    result = await db.execute(select(Article).where(Article.id == article_id))
    article = result.scalar_one_or_none()
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article introuvable")
    return ArticleResponse.model_validate(article)


# ── Admin endpoints ────────────────────────────────────────────────────────────


@router.post("", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
async def create_article(
    payload: ArticleCreate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> ArticleResponse:
    article = Article(**payload.model_dump())
    db.add(article)
    await db.flush()
    await db.refresh(article)
    return ArticleResponse.model_validate(article)


@router.put("/{article_id}", response_model=ArticleResponse)
async def update_article(
    article_id: uuid.UUID,
    payload: ArticleUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> ArticleResponse:
    result = await db.execute(select(Article).where(Article.id == article_id))
    article = result.scalar_one_or_none()
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article introuvable")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(article, field, value)
    article.updated_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(article)
    return ArticleResponse.model_validate(article)


@router.delete("/{article_id}", status_code=status.HTTP_200_OK)
async def delete_article(
    article_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> dict:
    result = await db.execute(select(Article).where(Article.id == article_id))
    article = result.scalar_one_or_none()
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article introuvable")
    await db.delete(article)
    await db.flush()
    return {"detail": "Article supprimé"}


@router.post("/{article_id}/publish", response_model=ArticleResponse)
async def publish_article(
    article_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> ArticleResponse:
    result = await db.execute(select(Article).where(Article.id == article_id))
    article = result.scalar_one_or_none()
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article introuvable")

    article.is_published = True
    article.published_at = datetime.now(timezone.utc)
    article.updated_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(article)
    return ArticleResponse.model_validate(article)


@router.post("/generate-ai", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
async def generate_ai_article(
    payload: ArticleGenerateRequest,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_admin_user),
) -> ArticleResponse:
    if not settings.ANTHROPIC_API_KEY or settings.ANTHROPIC_API_KEY.startswith("sk-ant-test"):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ANTHROPIC_API_KEY non configurée",
        )

    try:
        import anthropic

        client_ai = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        message = client_ai.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2000,
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"Rédige un article de blog professionnel en français sur le sujet suivant "
                        f"en cybersécurité : {payload.topic}. "
                        f'Format JSON: {{"title": "...", "content": "...", "summary": "...", "tags": "tag1,tag2,tag3"}}'
                    ),
                }
            ],
        )
        raw_text = message.content[0].text
        # Extract JSON from possible markdown code block
        if "```json" in raw_text:
            raw_text = raw_text.split("```json")[1].split("```")[0].strip()
        elif "```" in raw_text:
            raw_text = raw_text.split("```")[1].split("```")[0].strip()

        data = json.loads(raw_text)
    except (json.JSONDecodeError, KeyError, IndexError) as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Erreur lors du parsing de la réponse IA : {exc}",
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Erreur lors de la génération IA : {exc}",
        )

    article = Article(
        title=data.get("title", payload.topic),
        content=data.get("content", ""),
        summary=data.get("summary"),
        tags=data.get("tags"),
        category=payload.category,
        is_ai_generated=True,
        is_published=False,
    )
    db.add(article)
    await db.flush()
    await db.refresh(article)
    return ArticleResponse.model_validate(article)
