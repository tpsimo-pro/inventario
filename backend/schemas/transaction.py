from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime

from models.transaction import TransactionType


class TransactionBase(BaseModel):
    produto_id: int
    tipo: TransactionType = Field(..., description="Deve ser 'ENTRADA' ou 'SAIDA'")
    quantidade: int = Field(
        ..., gt=0, description="A quantidade movimentada deve ser maior que zero"
    )
    observacao: Optional[str] = None
    usuario_id: Optional[int] = (
        None  # Será preenchido futuramente pelo token de autenticação
    )


class TransactionCreate(TransactionBase):
    pass


class TransactionResponse(TransactionBase):
    id: int
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)
