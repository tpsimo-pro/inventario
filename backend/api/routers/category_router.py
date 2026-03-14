from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from api.deps import get_db
from schemas.category import CategoryCreate, CategoryResponse
from services.category_service import get_categories, create_category

router_categorias = APIRouter(prefix="/categorias", tags=["Categorias"])


@router_categorias.get("/", response_model=List[CategoryResponse])
def listar_categorias(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retorna a lista de categorias do sistema."""
    return get_categories(db, skip=skip, limit=limit)


@router_categorias.post(
    "/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED
)
def criar_categoria(categoria: CategoryCreate, db: Session = Depends(get_db)):
    """Cria uma nova categoria no banco de dados."""
    return create_category(db, category=categoria)
