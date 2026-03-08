from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class PermissionDisplayGroup(Base):
    """Groups permissions for display purposes (e.g. 'Product', 'User', 'Order')."""
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    permissions = relationship("Permission", back_populates="display_group")


class Permission(Base):
    """Attribute-based permission (e.g. 'product:create', 'product:read')."""
    id = Column(Integer, primary_key=True, index=True)
    permission = Column(String, unique=True, index=True, nullable=False)
    display_group_id = Column(Integer, ForeignKey("permissiondisplaygroup.id"), nullable=True)

    display_group = relationship("PermissionDisplayGroup", back_populates="permissions")
    access_group_permissions = relationship("AccessGroupPermission", back_populates="permission")


class AccessGroup(Base):
    """A named group of permissions (e.g. 'Admin', 'Shopper', 'Merchant')."""
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    permissions = relationship("AccessGroupPermission", back_populates="access_group")
    role_access_groups = relationship("RoleAccessGroup", back_populates="access_group")


class AccessGroupPermission(Base):
    """Junction table linking AccessGroups to Permissions."""
    id = Column(Integer, primary_key=True, index=True)
    access_group_id = Column(Integer, ForeignKey("accessgroup.id"), nullable=False)
    permission_id = Column(Integer, ForeignKey("permission.id"), nullable=False)

    __table_args__ = (
        UniqueConstraint("access_group_id", "permission_id", name="uq_accessgroup_permission"),
    )

    access_group = relationship("AccessGroup", back_populates="permissions")
    permission = relationship("Permission", back_populates="access_group_permissions")


class RoleAccessGroup(Base):
    """Junction table linking Roles to AccessGroups."""
    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("role.id"), nullable=False)
    access_group_id = Column(Integer, ForeignKey("accessgroup.id"), nullable=False)

    __table_args__ = (
        UniqueConstraint("role_id", "access_group_id", name="uq_role_accessgroup"),
    )

    role = relationship("Role", back_populates="access_groups")
    access_group = relationship("AccessGroup", back_populates="role_access_groups")
