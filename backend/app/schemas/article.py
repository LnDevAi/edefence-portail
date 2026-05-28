import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.article import ArticleCategory


class ArticleCreate(BaseModel):
    title: str
    content: str
    summary: Optional[str] = None
    source_url: Optional[str] = None
    image_url: Optional[str] = None
    category: ArticleCategory = ArticleCategory.ACTUALITE
    tags: Optional[str] = None
    is_ai_generated: bool = False
    is_published: bool = False


class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    source_url: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[ArticleCategory] = None
    tags: Optional[str] = None
    is_published: Optional[bool] = None


class ArticleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    content: str
    summary: Optional[str]
    source_url: Optional[str]
    image_url: Optional[str]
    category: ArticleCategory
    tags: Optional[str]
    is_ai_generated: bool
    is_published: bool
    published_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime


class ArticleListResponse(BaseModel):
    items: list[ArticleResponse]
    total: int


class ArticleGenerateRequest(BaseModel):
    topic: str
    category: ArticleCategory = ArticleCategory.ACTUALITE
