from pydantic import BaseModel, ConfigDict
from typing import Optional


class SupplierBase(BaseModel):
    razao_social: str
    cnpj_cpf: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None


class SupplierCreate(SupplierBase):
    pass


class SupplierUpdate(BaseModel):
    razao_social: Optional[str] = None
    cnpj_cpf: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None


class SupplierResponse(SupplierBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
