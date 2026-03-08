from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user_in: UserCreate, role_id: int = 1) -> User:
    hashed_password = get_password_hash(user_in.password)
    db_obj = User(
        email=user_in.email,
        hashed_password=hashed_password,
        role_id=role_id,
        is_active=True,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
