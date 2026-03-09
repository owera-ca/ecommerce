from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.geography import Country, ProvinceState
from app.schemas.geography import (
    CountryCreate, CountryUpdate, CountryResponse, CountryPaginatedResponse,
    ProvinceStateCreate, ProvinceStateUpdate, ProvinceStateResponse, ProvinceStatePaginatedResponse
)

router = APIRouter()

# --- Countries ---

@router.get("/countries", response_model=CountryPaginatedResponse)
def read_countries(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve countries.
    """
    total = db.query(Country).count()
    countries = db.query(Country).offset(skip).limit(limit).all()
    return {"items": countries, "total": total}

@router.get("/countries/{country_id}", response_model=CountryResponse)
def read_country(
    country_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get country by ID.
    """
    country = db.query(Country).filter(Country.id == country_id).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    return country

@router.post("/countries", response_model=CountryResponse)
def create_country(
    *,
    db: Session = Depends(deps.get_db),
    country_in: CountryCreate,
) -> Any:
    """
    Create new country.
    """
    country = db.query(Country).filter(Country.iso_code == country_in.iso_code).first()
    if country:
        raise HTTPException(status_code=400, detail="Country with this ISO code already exists.")
        
    country = Country(**country_in.model_dump())
    db.add(country)
    db.commit()
    db.refresh(country)
    return country

@router.put("/countries/{country_id}", response_model=CountryResponse)
def update_country(
    *,
    db: Session = Depends(deps.get_db),
    country_id: int,
    country_in: CountryUpdate,
) -> Any:
    """
    Update a country.
    """
    country = db.query(Country).filter(Country.id == country_id).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    
    update_data = country_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(country, field, value)
        
    db.add(country)
    db.commit()
    db.refresh(country)
    return country

@router.delete("/countries/{country_id}", response_model=CountryResponse)
def delete_country(
    *,
    db: Session = Depends(deps.get_db),
    country_id: int,
) -> Any:
    """
    Delete a country.
    """
    country = db.query(Country).filter(Country.id == country_id).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    
    db.delete(country)
    db.commit()
    return country


# --- Provinces ---

@router.get("/provinces", response_model=ProvinceStatePaginatedResponse)
def read_provinces(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    country_id: int | None = None,
) -> Any:
    """
    Retrieve provinces.
    """
    query = db.query(ProvinceState)
    if country_id is not None:
        query = query.filter(ProvinceState.country_id == country_id)
        
    total = query.count()
    provinces = query.offset(skip).limit(limit).all()
    return {"items": provinces, "total": total}

@router.get("/provinces/{province_id}", response_model=ProvinceStateResponse)
def read_province(
    province_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get province by ID.
    """
    province = db.query(ProvinceState).filter(ProvinceState.id == province_id).first()
    if not province:
        raise HTTPException(status_code=404, detail="Province not found")
    return province

@router.post("/provinces", response_model=ProvinceStateResponse)
def create_province(
    *,
    db: Session = Depends(deps.get_db),
    province_in: ProvinceStateCreate,
) -> Any:
    """
    Create new province.
    """
    province = ProvinceState(**province_in.model_dump())
    db.add(province)
    db.commit()
    db.refresh(province)
    return province

@router.put("/provinces/{province_id}", response_model=ProvinceStateResponse)
def update_province(
    *,
    db: Session = Depends(deps.get_db),
    province_id: int,
    province_in: ProvinceStateUpdate,
) -> Any:
    """
    Update a province.
    """
    province = db.query(ProvinceState).filter(ProvinceState.id == province_id).first()
    if not province:
        raise HTTPException(status_code=404, detail="Province not found")
    
    update_data = province_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(province, field, value)
        
    db.add(province)
    db.commit()
    db.refresh(province)
    return province

@router.delete("/provinces/{province_id}", response_model=ProvinceStateResponse)
def delete_province(
    *,
    db: Session = Depends(deps.get_db),
    province_id: int,
) -> Any:
    """
    Delete a province.
    """
    province = db.query(ProvinceState).filter(ProvinceState.id == province_id).first()
    if not province:
        raise HTTPException(status_code=404, detail="Province not found")
    
    db.delete(province)
    db.commit()
    return province
