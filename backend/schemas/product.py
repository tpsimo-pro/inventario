from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime

from .category import CategoryResponse
from .supplier import SupplierResponse


class ProductBase(BaseModel):
    nome: str
    sku: str
    codigo_barras: Optional[str] = None
    descricao: Optional[str] = None
    preco_custo: float = Field(default=0.0, ge=0.0)
    preco_venda: float = Field(default=0.0, ge=0.0)
    quantidade_atual: int = Field(default=0, ge=0)
    estoque_minimo: int = Field(default=5, ge=0)
    ativo: bool = True
    categoria_id: int
    fornecedor_id: Optional[int] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    nome: Optional[str] = None
    sku: Optional[str] = None
    codigo_barras: Optional[str] = None
    descricao: Optional[str] = None
    preco_custo: Optional[float] = Field(default=None, ge=0.0)
    preco_venda: Optional[float] = Field(default=None, ge=0.0)
    quantidade_atual: Optional[int] = Field(default=None, ge=0)
    estoque_minimo: Optional[int] = Field(default=None, ge=0)
    ativo: Optional[bool] = None
    categoria_id: Optional[int] = None
    fornecedor_id: Optional[int] = None


class ProductResponse(ProductBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime

    categoria: CategoryResponse
    fornecedor: Optional[SupplierResponse] = None

    model_config = ConfigDict(from_attributes=True)
