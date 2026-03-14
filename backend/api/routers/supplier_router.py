from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from api.deps import get_db
from schemas.supplier import SupplierCreate, SupplierResponse
from services.supplier_service import get_suppliers, create_supplier

router_fornecedores = APIRouter(prefix="/fornecedores", tags=["Fornecedores"])


@router_fornecedores.get("/", response_model=List[SupplierResponse])
def listar_fornecedores(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retorna a lista de fornecedores."""
    return get_suppliers(db, skip=skip, limit=limit)


@router_fornecedores.post(
    "/", response_model=SupplierResponse, status_code=status.HTTP_201_CREATED
)
def criar_fornecedor(fornecedor: SupplierCreate, db: Session = Depends(get_db)):
    """Cadastra um novo fornecedor no inventário."""
    return create_supplier(db, supplier=fornecedor)
