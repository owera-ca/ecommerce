from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Country(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    iso_code = Column(String(2), unique=True, nullable=False, index=True)  # ISO 3166-1 alpha-2
    is_active = Column(Boolean, default=True, nullable=False)

    provinces = relationship("ProvinceState", back_populates="country")


class ProvinceState(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    code = Column(String(10), nullable=False, index=True)  # e.g. "CA", "NY", "ON"
    country_id = Column(Integer, ForeignKey("country.id"), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    country = relationship("Country", back_populates="provinces")
