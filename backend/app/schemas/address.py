from pydantic import BaseModel
from typing import Optional, List

class AddressBase(BaseModel):
    user_id: int
    first_name: str
    last_name: str
    address_line_1: str
    address_line_2: Optional[str] = None
    city: str
    postal_code: str
    phone: Optional[str] = None
    province_state_id: int
    country_id: int
    is_active: bool = True

class AddressCreate(AddressBase):
    pass

class AddressUpdate(BaseModel):
    user_id: int | None = None
    first_name: str | None = None
    last_name: str | None = None
    address_line_1: str | None = None
    address_line_2: str | None = None
    city: str | None = None
    postal_code: str | None = None
    phone: str | None = None
    province_state_id: int | None = None
    country_id: int | None = None
    is_active: bool | None = None

class AddressResponse(AddressBase):
    id: int

    class Config:
        from_attributes = True

class AddressPaginatedResponse(BaseModel):
    items: List[AddressResponse]
    total: int
