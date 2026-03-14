from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from api.deps import get_current_user, get_db
from models.user import User
from schemas.transaction import TransactionCreate, TransactionResponse
from services.transaction_service import (
    registrar_transacao,
    listar_transacoes,
    listar_transacoes_por_produto,
)

router_transacoes = APIRouter(prefix="/transacoes", tags=["Transações de Estoque"])


@router_transacoes.get("/", response_model=List[TransactionResponse])
def obter_todas_transacoes(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """Retorna o histórico global de todas as movimentações de estoque da empresa."""
    return listar_transacoes(db, skip=skip, limit=limit)


@router_transacoes.get(
    "/produto/{produto_id}", response_model=List[TransactionResponse]
)
def obter_transacoes_do_produto(
    produto_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """Retorna o extrato de movimentações focado em um único produto."""
    return listar_transacoes_por_produto(
        db, produto_id=produto_id, skip=skip, limit=limit
    )


@router_transacoes.post(
    "/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED
)
def criar_nova_transacao(
    transacao: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # FECHANDO A CATRACA!
):
    """
    Registra uma Entrada ou Saída de estoque.
    A quantidade do produto vinculado será atualizada de maneira automática de forma atômica.
    """
    return registrar_transacao(db, transacao=transacao, usuario_id=current_user.id)
