from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.api.deps import get_current_user
from app.core import security
from app.core.security import verify_password
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token
from app.crud import crud_user
from app.core.email import send_reset_password_email
from app.models.user import User

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)) -> Any:
    return current_user

@router.post("/register", response_model=UserResponse)
def register(*, db: Session = Depends(get_db), user_in: UserCreate) -> Any:
    user = crud_user.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = crud_user.create_user(db, user_in=user_in)
    return user

@router.post("/login", response_model=Token)
def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    user = crud_user.get_user_by_email(db, email=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/forgot-password")
def forgot_password(email: str, db: Session = Depends(get_db)) -> Any:
    user = crud_user.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system.",
        )
    # Generate a mock token for email link
    token = security.create_access_token(user.id, expires_delta=timedelta(hours=1))
    send_reset_password_email(email_to=user.email, token=token)
    return {"message": "Password recovery email sent"}

from pydantic import BaseModel
class ResetPassword(BaseModel):
    token: str
    new_password: str

@router.post("/reset-password")
def reset_password(body: ResetPassword, db: Session = Depends(get_db)) -> Any:
    # Verify token
    try:
        from jose import jwt
        payload = jwt.decode(body.token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        user_id = int(payload.get("sub"))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update password
    hashed_password = security.get_password_hash(body.new_password)
    user.hashed_password = hashed_password
    db.add(user)
    db.commit()

    return {"message": "Password updated successfully"}
