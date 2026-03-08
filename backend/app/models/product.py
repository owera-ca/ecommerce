from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, UniqueConstraint, Text, Numeric
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Product(Base):
    """Base product configuration (simple or variable parent)."""

    id = Column(Integer, primary_key=True, index=True)

    # Ownership and categorization
    merchant_id = Column(Integer, ForeignKey("merchant.id"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("category.id"), nullable=True, index=True)

    # Type of product
    is_variable = Column(Boolean, default=False, nullable=False, index=True)

    # Base pricing and inventory (used if simple product, or default for variable)
    sku = Column(String(100), unique=True, index=True, nullable=True)
    base_price = Column(Numeric(10, 2), nullable=True)
    stock_quantity = Column(Integer, default=0, nullable=False)

    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    merchant = relationship("Merchant", backref="products")
    category = relationship("Category", backref="products")
    
    translations = relationship(
        "ProductTranslation", back_populates="product", cascade="all, delete-orphan"
    )
    variations = relationship(
        "ProductVariation", back_populates="product", cascade="all, delete-orphan"
    )


class ProductTranslation(Base):
    """Locale-specific overrides for translatable Product fields."""

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False, index=True)
    
    # BCP-47 locale tag, e.g. 'en', 'fr'
    locale = Column(String(10), nullable=False, index=True)

    # Translatable fields
    name = Column(String(255), nullable=False)
    short_description = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)

    __table_args__ = (
        UniqueConstraint("product_id", "locale", name="uq_product_translation_product_locale"),
    )

    # Relationships
    product = relationship("Product", back_populates="translations")


class ProductAttribute(Base):
    """An attribute that can vary (e.g. Color, Size)."""

    id = Column(Integer, primary_key=True, index=True)
    merchant_id = Column(Integer, ForeignKey("merchant.id"), nullable=False, index=True)
    
    # Internal name
    name = Column(String(100), nullable=False, index=True)

    # Relationships
    translations = relationship(
        "ProductAttributeTranslation", back_populates="attribute", cascade="all, delete-orphan"
    )
    values = relationship(
        "ProductAttributeValue", back_populates="attribute", cascade="all, delete-orphan"
    )


class ProductAttributeTranslation(Base):
    """Locale-specific overrides for ProductAttribute display."""

    id = Column(Integer, primary_key=True, index=True)
    attribute_id = Column(Integer, ForeignKey("product_attribute.id"), nullable=False, index=True)
    locale = Column(String(10), nullable=False, index=True)

    display_name = Column(String(255), nullable=False)

    __table_args__ = (
        UniqueConstraint("attribute_id", "locale", name="uq_product_attribute_translation_attr_locale"),
    )

    # Relationships
    attribute = relationship("ProductAttribute", back_populates="translations")


class ProductAttributeValue(Base):
    """A specific value for an attribute (e.g. Red, XL)."""

    id = Column(Integer, primary_key=True, index=True)
    attribute_id = Column(Integer, ForeignKey("product_attribute.id"), nullable=False, index=True)
    
    # Internal value string
    value = Column(String(100), nullable=False, index=True)

    # Relationships
    attribute = relationship("ProductAttribute", back_populates="values")
    translations = relationship(
        "ProductAttributeValueTranslation", back_populates="attribute_value", cascade="all, delete-orphan"
    )


class ProductAttributeValueTranslation(Base):
    """Locale-specific overrides for ProductAttributeValue display."""

    id = Column(Integer, primary_key=True, index=True)
    attribute_value_id = Column(Integer, ForeignKey("product_attribute_value.id"), nullable=False, index=True)
    locale = Column(String(10), nullable=False, index=True)

    display_value = Column(String(255), nullable=False)

    __table_args__ = (
        UniqueConstraint("attribute_value_id", "locale", name="uq_prod_attr_val_trans_val_locale"),
    )

    # Relationships
    attribute_value = relationship("ProductAttributeValue", back_populates="translations")


class ProductVariation(Base):
    """A sellable variation of a parent product (e.g. Red XL Shirt)."""

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False, index=True)
    
    sku = Column(String(100), unique=True, index=True, nullable=False)
    price_override = Column(Numeric(10, 2), nullable=True)
    stock_quantity = Column(Integer, default=0, nullable=False)

    # Relationships
    product = relationship("Product", back_populates="variations")
    options = relationship(
        "ProductVariationOption", back_populates="variation", cascade="all, delete-orphan"
    )


class ProductVariationOption(Base):
    """Links a ProductVariation to a specific ProductAttributeValue."""

    id = Column(Integer, primary_key=True, index=True)
    variation_id = Column(Integer, ForeignKey("product_variation.id"), nullable=False, index=True)
    attribute_value_id = Column(Integer, ForeignKey("product_attribute_value.id"), nullable=False, index=True)

    __table_args__ = (
        UniqueConstraint("variation_id", "attribute_value_id", name="uq_product_variation_option"),
    )

    # Relationships
    variation = relationship("ProductVariation", back_populates="options")
    attribute_value = relationship("ProductAttributeValue")
