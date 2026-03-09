from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ── EmailTemplateTranslation ──────────────────────────────────────────

class EmailTemplateTranslationBase(BaseModel):
    locale: str
    subject: str
    body: str


class EmailTemplateTranslationCreate(EmailTemplateTranslationBase):
    pass


class EmailTemplateTranslationUpdate(BaseModel):
    id: Optional[int] = None  # None → new translation
    locale: str
    subject: str
    body: str


class EmailTemplateTranslationResponse(EmailTemplateTranslationBase):
    id: int
    template_id: int

    class Config:
        from_attributes = True


# ── EmailTemplate ─────────────────────────────────────────────────────

class EmailTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: Optional[bool] = True


class EmailTemplateCreate(EmailTemplateBase):
    translations: List[EmailTemplateTranslationCreate] = []


class EmailTemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    translations: Optional[List[EmailTemplateTranslationUpdate]] = None


class EmailTemplateResponse(EmailTemplateBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    translations: List[EmailTemplateTranslationResponse] = []

    class Config:
        from_attributes = True


class EmailTemplateListResponse(BaseModel):
    """Lightweight response for list view (no full body)."""
    id: int
    name: str
    description: Optional[str] = None
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    translation_count: int = 0

    class Config:
        from_attributes = True


class EmailTemplatePaginatedResponse(BaseModel):
    items: List[EmailTemplateListResponse]
    total: int


# ── Email (sent / queued) ─────────────────────────────────────────────

class EmailResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    template_id: Optional[int] = None
    to_email: str
    subject: str
    body: str
    status: str
    sent_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    # Nested names for display
    user_email: Optional[str] = None
    template_name: Optional[str] = None

    class Config:
        from_attributes = True


class EmailPaginatedResponse(BaseModel):
    items: List[EmailResponse]
    total: int
