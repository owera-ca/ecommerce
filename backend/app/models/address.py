from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Address(Base):
    id = Column(Integer, primary_key=True, index=True)

    # Who owns this address
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False, index=True)

    # Address fields
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    company = Column(String(150), nullable=True)
    address_line_1 = Column(String(255), nullable=False)
    address_line_2 = Column(String(255), nullable=True)
    city = Column(String(100), nullable=False)
    postal_code = Column(String(20), nullable=False)
    phone = Column(String(30), nullable=True)

    # Geography references
    province_state_id = Column(Integer, ForeignKey("province_state.id"), nullable=False)
    country_id = Column(Integer, ForeignKey("country.id"), nullable=False)

    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    user = relationship("User", back_populates="addresses", foreign_keys=[user_id])
    province_state = relationship("ProvinceState")
    country = relationship("Country")
