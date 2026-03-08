from pydantic import BaseModel, EmailStr
from typing import Optional

class RoleBase(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role_id: int
    role: Optional[RoleBase] = None

    class Config:
        from_attributes = True
