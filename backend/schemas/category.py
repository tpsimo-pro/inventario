from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


class CategoryBase(BaseModel):
    nome: str = Field(..., description="Nome da categoria")
    descricao: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
