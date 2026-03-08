from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, UniqueConstraint, Text
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Category(Base):
    """Product category as a nested set."""

    id = Column(Integer, primary_key=True, index=True)

    # Nested set fields
    root_id = Column(Integer, ForeignKey("category.id"), nullable=True, index=True)
    lft = Column(Integer, nullable=False, index=True)
    rgt = Column(Integer, nullable=False, index=True)
    
    # Internal unique code
    code = Column(String(100), unique=True, index=True, nullable=False)
    
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    parent = relationship(
        "Category",
        remote_side=[id],
        backref="children",
    )
    translations = relationship(
        "CategoryTranslation", back_populates="category", cascade="all, delete-orphan"
    )
    # products = relationship("Product", back_populates="category")


class CategoryTranslation(Base):
    """Locale-specific overrides for translatable Category fields."""

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("category.id"), nullable=False, index=True)
    
    # BCP-47 locale tag, e.g. 'en', 'fr'
    locale = Column(String(10), nullable=False, index=True)

    # Translatable fields
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    __table_args__ = (
        UniqueConstraint("category_id", "locale", name="uq_category_translation_category_locale"),
    )

    # Relationships
    category = relationship("Category", back_populates="translations")
