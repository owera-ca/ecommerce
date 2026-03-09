from pydantic import BaseModel
from typing import Optional, List

# --- Country Schemas ---

class CountryBase(BaseModel):
    name: str
    iso_code: str
    is_active: bool = True

class CountryCreate(CountryBase):
    pass

class CountryUpdate(BaseModel):
    name: Optional[str] = None
    iso_code: Optional[str] = None
    is_active: Optional[bool] = None

class CountryResponse(CountryBase):
    id: int

    class Config:
        from_attributes = True

class CountryPaginatedResponse(BaseModel):
    items: List[CountryResponse]
    total: int


# --- ProvinceState Schemas ---

class ProvinceStateBase(BaseModel):
    name: str
    code: str
    country_id: int
    is_active: bool = True

class ProvinceStateCreate(ProvinceStateBase):
    pass

class ProvinceStateUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    country_id: Optional[int] = None
    is_active: Optional[bool] = None

class ProvinceStateResponse(ProvinceStateBase):
    id: int

    class Config:
        from_attributes = True

class ProvinceStatePaginatedResponse(BaseModel):
    items: List[ProvinceStateResponse]
    total: int
