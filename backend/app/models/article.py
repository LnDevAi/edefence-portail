import enum
import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Boolean, DateTime, Enum, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class ArticleCategory(str, enum.Enum):
    ACTUALITE = "actualite"
    ALERTE = "alerte"
    TUTORIAL = "tutorial"
    ARTICLE_MAISON = "article_maison"


class Article(Base):
    __tablename__ = "articles"
    __table_args__ = {"schema": "portail"}

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    source_url: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True)
    category: Mapped[ArticleCategory] = mapped_column(
        Enum(ArticleCategory, schema="portail", values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=ArticleCategory.ACTUALITE,
    )
    tags: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)  # comma-separated
    is_ai_generated: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<Article id={self.id} title={self.title[:30]} category={self.category}>"
