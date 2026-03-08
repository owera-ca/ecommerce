from sqlalchemy import (
    Column, Integer, String, Boolean, Text, ForeignKey, UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Merchant(Base):
    """Company / merchant profile linked to a User account."""

    id = Column(Integer, primary_key=True, index=True)

    # Link to the owning user (one merchant profile per user)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False, unique=True, index=True)

    # Company details
    company_name = Column(String(255), nullable=False, index=True)
    tax_id = Column(String(50), nullable=True)
    phone = Column(String(30), nullable=True)
    email = Column(String(255), nullable=True)   # business contact e-mail
    website = Column(String(255), nullable=True)

    # Default billing / shipping addresses (reuse the Address model)
    billing_address_id = Column(Integer, ForeignKey("address.id"), nullable=True)
    shipping_address_id = Column(Integer, ForeignKey("address.id"), nullable=True)

    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    user = relationship("User", backref="merchant")
    billing_address = relationship("Address", foreign_keys=[billing_address_id])
    shipping_address = relationship("Address", foreign_keys=[shipping_address_id])
    stores = relationship("Store", back_populates="merchant", cascade="all, delete-orphan")


class Store(Base):
    """A storefront that belongs to a Merchant. A Merchant can have many Stores."""

    id = Column(Integer, primary_key=True, index=True)

    merchant_id = Column(Integer, ForeignKey("merchant.id"), nullable=False, index=True)

    # URL-safe unique identifier (e.g. used in store URLs)
    slug = Column(String(100), nullable=False, unique=True, index=True)

    # Brand identity
    brand_name = Column(String(255), nullable=False)
    brand_tagline = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    logo_url = Column(String(500), nullable=True)
    banner_url = Column(String(500), nullable=True)
    primary_color = Column(String(20), nullable=True)    # hex, e.g. #3A86FF
    secondary_color = Column(String(20), nullable=True)

    # Regional / operational settings
    currency_code = Column(String(3), nullable=False, default="USD")   # ISO 4217
    timezone = Column(String(50), nullable=False, default="UTC")

    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    merchant = relationship("Merchant", back_populates="stores")
    translations = relationship(
        "StoreTranslation", back_populates="store", cascade="all, delete-orphan"
    )


class StoreTranslation(Base):
    """Locale-specific overrides for translatable Store fields."""

    id = Column(Integer, primary_key=True, index=True)

    store_id = Column(Integer, ForeignKey("store.id"), nullable=False, index=True)

    # BCP-47 locale tag, e.g. 'en', 'fr', 'es', 'pt-BR'
    locale = Column(String(10), nullable=False, index=True)

    # Translatable fields mirrored from Store
    brand_name = Column(String(255), nullable=True)
    brand_tagline = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)

    __table_args__ = (
        UniqueConstraint("store_id", "locale", name="uq_store_translation_store_locale"),
    )

    # Relationships
    store = relationship("Store", back_populates="translations")
