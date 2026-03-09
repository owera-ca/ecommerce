from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Role(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    users = relationship("User", back_populates="role")
    access_groups = relationship("RoleAccessGroup", back_populates="role")


class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=True)
    last_name = Column(String(50), nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role_id = Column(Integer, ForeignKey("role.id"))

    # Default address references
    default_ship_address_id = Column(Integer, ForeignKey("address.id"), nullable=True)
    default_bill_address_id = Column(Integer, ForeignKey("address.id"), nullable=True)

    # Relationships
    role = relationship("Role", back_populates="users")
    addresses = relationship(
        "Address",
        back_populates="user",
        foreign_keys="Address.user_id",
    )
    default_ship_address = relationship(
        "Address",
        foreign_keys=[default_ship_address_id],
        post_update=True,
    )
    default_bill_address = relationship(
        "Address",
        foreign_keys=[default_bill_address_id],
        post_update=True,
    )
