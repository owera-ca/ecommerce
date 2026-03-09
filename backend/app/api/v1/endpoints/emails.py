from typing import Any, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.api import deps
from app.models.email import EmailTemplate, EmailTemplateTranslation, Email
from app.models.user import User
from app.schemas.email import (
    EmailTemplateCreate,
    EmailTemplateUpdate,
    EmailTemplateResponse,
    EmailTemplatePaginatedResponse,
    EmailTemplateListResponse,
    EmailResponse,
    EmailPaginatedResponse,
)

router = APIRouter()


# ══════════════════════════════════════════════════════════════════════
#  Email Templates
# ══════════════════════════════════════════════════════════════════════

@router.get("/templates/", response_model=EmailTemplatePaginatedResponse)
def read_email_templates(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
) -> Any:
    """List email templates (paginated, searchable)."""
    query = db.query(EmailTemplate)
    if search:
        query = query.filter(
            or_(
                EmailTemplate.name.ilike(f"%{search}%"),
                EmailTemplate.description.ilike(f"%{search}%"),
            )
        )
    total = query.count()
    templates = query.order_by(EmailTemplate.id.desc()).offset(skip).limit(limit).all()

    items = []
    for t in templates:
        items.append(
            EmailTemplateListResponse(
                id=t.id,
                name=t.name,
                description=t.description,
                is_active=t.is_active,
                created_at=t.created_at,
                updated_at=t.updated_at,
                translation_count=len(t.translations),
            )
        )
    return {"items": items, "total": total}


@router.get("/templates/{template_id}", response_model=EmailTemplateResponse)
def read_email_template(
    template_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """Get a single email template with translations."""
    template = db.query(EmailTemplate).filter(EmailTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Email template not found")
    return template


@router.post("/templates/", response_model=EmailTemplateResponse)
def create_email_template(
    *,
    db: Session = Depends(deps.get_db),
    template_in: EmailTemplateCreate,
) -> Any:
    """Create a new email template with translations."""
    existing = db.query(EmailTemplate).filter(EmailTemplate.name == template_in.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="A template with this name already exists.")

    template = EmailTemplate(
        name=template_in.name,
        description=template_in.description,
        is_active=template_in.is_active if template_in.is_active is not None else True,
    )
    db.add(template)
    db.flush()  # get template.id

    for t in template_in.translations:
        translation = EmailTemplateTranslation(
            template_id=template.id,
            locale=t.locale,
            subject=t.subject,
            body=t.body,
        )
        db.add(translation)

    db.commit()
    db.refresh(template)
    return template


@router.put("/templates/{template_id}", response_model=EmailTemplateResponse)
def update_email_template(
    *,
    db: Session = Depends(deps.get_db),
    template_id: int,
    template_in: EmailTemplateUpdate,
) -> Any:
    """Update an email template and upsert its translations."""
    template = db.query(EmailTemplate).filter(EmailTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Email template not found")

    update_data = template_in.model_dump(exclude_unset=True, exclude={"translations"})
    for field, value in update_data.items():
        setattr(template, field, value)

    # Handle translations if provided
    if template_in.translations is not None:
        # Collect existing translation ids
        existing_ids = {t.id for t in template.translations}
        incoming_ids = {t.id for t in template_in.translations if t.id is not None}

        # Delete translations that were removed
        for t in list(template.translations):
            if t.id not in incoming_ids:
                db.delete(t)

        # Upsert translations
        for t_in in template_in.translations:
            if t_in.id and t_in.id in existing_ids:
                # Update existing
                existing_t = db.query(EmailTemplateTranslation).filter(
                    EmailTemplateTranslation.id == t_in.id
                ).first()
                if existing_t:
                    existing_t.locale = t_in.locale
                    existing_t.subject = t_in.subject
                    existing_t.body = t_in.body
            else:
                # Create new
                new_t = EmailTemplateTranslation(
                    template_id=template.id,
                    locale=t_in.locale,
                    subject=t_in.subject,
                    body=t_in.body,
                )
                db.add(new_t)

    db.commit()
    db.refresh(template)
    return template


@router.delete("/templates/{template_id}", response_model=EmailTemplateResponse)
def delete_email_template(
    *,
    db: Session = Depends(deps.get_db),
    template_id: int,
) -> Any:
    """Delete an email template (cascades to translations)."""
    template = db.query(EmailTemplate).filter(EmailTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Email template not found")

    db.delete(template)
    db.commit()
    return template


# ══════════════════════════════════════════════════════════════════════
#  Sent Emails
# ══════════════════════════════════════════════════════════════════════

@router.get("/", response_model=EmailPaginatedResponse)
def read_emails(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[int] = None,
    template_id: Optional[int] = None,
    status: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    search: Optional[str] = None,
) -> Any:
    """List sent emails with optional filters."""
    query = db.query(Email)

    if user_id is not None:
        query = query.filter(Email.user_id == user_id)
    if template_id is not None:
        query = query.filter(Email.template_id == template_id)
    if status:
        query = query.filter(Email.status == status)
    if date_from:
        try:
            dt_from = datetime.fromisoformat(date_from)
            query = query.filter(Email.created_at >= dt_from)
        except ValueError:
            pass
    if date_to:
        try:
            dt_to = datetime.fromisoformat(date_to)
            query = query.filter(Email.created_at <= dt_to)
        except ValueError:
            pass
    if search:
        query = query.filter(
            or_(
                Email.to_email.ilike(f"%{search}%"),
                Email.subject.ilike(f"%{search}%"),
            )
        )

    total = query.count()
    emails = query.order_by(Email.id.desc()).offset(skip).limit(limit).all()

    items = []
    for e in emails:
        user_email = None
        template_name = None
        if e.user:
            user_email = e.user.email
        if e.template:
            template_name = e.template.name
        items.append(
            EmailResponse(
                id=e.id,
                user_id=e.user_id,
                template_id=e.template_id,
                to_email=e.to_email,
                subject=e.subject,
                body=e.body,
                status=e.status,
                sent_at=e.sent_at,
                created_at=e.created_at,
                user_email=user_email,
                template_name=template_name,
            )
        )
    return {"items": items, "total": total}


@router.get("/{email_id}", response_model=EmailResponse)
def read_email(
    email_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """Get a single email record."""
    email = db.query(Email).filter(Email.id == email_id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")

    user_email = email.user.email if email.user else None
    template_name = email.template.name if email.template else None

    return EmailResponse(
        id=email.id,
        user_id=email.user_id,
        template_id=email.template_id,
        to_email=email.to_email,
        subject=email.subject,
        body=email.body,
        status=email.status,
        sent_at=email.sent_at,
        created_at=email.created_at,
        user_email=user_email,
        template_name=template_name,
    )
