from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models.merchant import Merchant
from app.schemas.merchant import MerchantCreate, MerchantUpdate, MerchantResponse

router = APIRouter()

@router.get("/", response_model=List[MerchantResponse])
def read_merchants(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: User = Depends(deps.get_current_user) # In production we'd want admin auth
) -> Any:
    """
    Retrieve merchants.
    """
    merchants = db.query(Merchant).offset(skip).limit(limit).all()
    return merchants

@router.post("/", response_model=MerchantResponse)
def create_merchant(
    *,
    db: Session = Depends(deps.get_db),
    merchant_in: MerchantCreate,
    # current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Create new merchant.
    """
    merchant = db.query(Merchant).filter(Merchant.user_id == merchant_in.user_id).first()
    if merchant:
        raise HTTPException(
            status_code=400,
            detail="The user with this user id already has a merchant profile in the system.",
        )
    merchant = Merchant(**merchant_in.model_dump())
    db.add(merchant)
    db.commit()
    db.refresh(merchant)
    return merchant

@router.put("/{merchant_id}", response_model=MerchantResponse)
def update_merchant(
    *,
    db: Session = Depends(deps.get_db),
    merchant_id: int,
    merchant_in: MerchantUpdate,
    # current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Update a merchant.
    """
    merchant = db.query(Merchant).filter(Merchant.id == merchant_id).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")
    
    update_data = merchant_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(merchant, field, value)
        
    db.add(merchant)
    db.commit()
    db.refresh(merchant)
    return merchant

@router.delete("/{merchant_id}", response_model=MerchantResponse)
def delete_merchant(
    *,
    db: Session = Depends(deps.get_db),
    merchant_id: int,
    # current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Delete a merchant.
    """
    merchant = db.query(Merchant).filter(Merchant.id == merchant_id).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")
    
    db.delete(merchant)
    db.commit()
    return merchant
