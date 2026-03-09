from sqlalchemy import (
    Column, Integer, String, Boolean, Text, ForeignKey, DateTime, UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base_class import Base


class EmailTemplate(Base):
    """Reusable email template with translatable subject/body."""

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)  # slug / key
    description = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    translations = relationship(
        "EmailTemplateTranslation",
        back_populates="template",
        cascade="all, delete-orphan",
    )
    emails = relationship("Email", back_populates="template")


class EmailTemplateTranslation(Base):
    """Locale-specific subject and body for an EmailTemplate."""

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("email_template.id"), nullable=False, index=True)
    locale = Column(String(10), nullable=False, index=True)  # e.g. 'en', 'fr'
    subject = Column(String(500), nullable=False)
    body = Column(Text, nullable=False)  # HTML content

    __table_args__ = (
        UniqueConstraint("template_id", "locale", name="uq_email_template_translation_template_locale"),
    )

    template = relationship("EmailTemplate", back_populates="translations")


class Email(Base):
    """Record of an email sent (or queued) to a user."""

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=True, index=True)
    template_id = Column(Integer, ForeignKey("email_template.id"), nullable=True, index=True)
    to_email = Column(String(255), nullable=False, index=True)
    subject = Column(String(500), nullable=False)
    body = Column(Text, nullable=False)
    status = Column(String(20), nullable=False, default="pending", index=True)  # pending | sent | failed
    sent_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", backref="emails")
    template = relationship("EmailTemplate", back_populates="emails")
