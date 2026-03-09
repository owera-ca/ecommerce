from pydantic import BaseModel, EmailStr
from typing import Optional

class MerchantBase(BaseModel):
    company_name: str
    tax_id: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None
    is_active: Optional[bool] = True

class MerchantCreate(MerchantBase):
    user_id: int

class MerchantUpdate(BaseModel):
    company_name: Optional[str] = None
    tax_id: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None
    is_active: Optional[bool] = None

class MerchantResponse(MerchantBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
