from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.address import Address
from app.schemas.address import AddressCreate, AddressUpdate, AddressResponse, AddressPaginatedResponse

router = APIRouter()

@router.get("/", response_model=AddressPaginatedResponse)
def read_addresses(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve addresses.
    """
    total = db.query(Address).count()
    addresses = db.query(Address).offset(skip).limit(limit).all()
    return {"items": addresses, "total": total}

@router.get("/{address_id}", response_model=AddressResponse)
def read_address(
    address_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get address by ID.
    """
    address = db.query(Address).filter(Address.id == address_id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    return address

@router.post("/", response_model=AddressResponse)
def create_address(
    *,
    db: Session = Depends(deps.get_db),
    address_in: AddressCreate,
) -> Any:
    """
    Create new address.
    """
    address = Address(**address_in.model_dump())
    db.add(address)
    db.commit()
    db.refresh(address)
    return address

@router.put("/{address_id}", response_model=AddressResponse)
def update_address(
    *,
    db: Session = Depends(deps.get_db),
    address_id: int,
    address_in: AddressUpdate,
) -> Any:
    """
    Update an address.
    """
    address = db.query(Address).filter(Address.id == address_id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    
    update_data = address_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(address, field, value)
        
    db.add(address)
    db.commit()
    db.refresh(address)
    return address

@router.delete("/{address_id}", response_model=AddressResponse)
def delete_address(
    *,
    db: Session = Depends(deps.get_db),
    address_id: int,
) -> Any:
    """
    Delete an address.
    """
    address = db.query(Address).filter(Address.id == address_id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    
    db.delete(address)
    db.commit()
    return address
