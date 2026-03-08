from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Numeric, DateTime
from sqlalchemy.orm import relationship
import datetime

from app.db.base_class import Base


class Order(Base):
    """An order placed by a user or guest."""

    id = Column(Integer, primary_key=True, index=True)

    # Ownership and origin
    user_id = Column(Integer, ForeignKey("user.id"), nullable=True, index=True)
    merchant_id = Column(Integer, ForeignKey("merchant.id"), nullable=False, index=True)

    # General configuration
    status = Column(String(50), default="Pending", nullable=False, index=True)
    total_amount = Column(Numeric(10, 2), nullable=False)

    # Addresses
    shipping_address_id = Column(Integer, ForeignKey("address.id"), nullable=True)
    billing_address_id = Column(Integer, ForeignKey("address.id"), nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False
    )

    # Relationships
    user = relationship("User", backref="orders")
    merchant = relationship("Merchant", backref="orders")
    
    shipping_address = relationship(
        "Address", foreign_keys=[shipping_address_id]
    )
    billing_address = relationship(
        "Address", foreign_keys=[billing_address_id]
    )
    
    items = relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )


class OrderItem(Base):
    """A line item inside an Order."""

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("order.id"), nullable=False, index=True)
    
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False, index=True)
    # variation_id is optional depending on if it's a simple or variable product
    variation_id = Column(Integer, ForeignKey("product_variation.id"), nullable=True, index=True)

    quantity = Column(Integer, default=1, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)  # quantity * unit_price (or after discounts)

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product")
    variation = relationship("ProductVariation")
