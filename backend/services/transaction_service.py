from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.transaction import Transaction, TransactionType
from models.product import Product
from schemas.transaction import TransactionCreate


def listar_transacoes(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(Transaction)
        .order_by(Transaction.criado_em.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def listar_transacoes_por_produto(
    db: Session, produto_id: int, skip: int = 0, limit: int = 100
):
    # Opcional: validar se o produto existe antes de buscar
    return (
        db.query(Transaction)
        .filter(Transaction.produto_id == produto_id)
        .order_by(Transaction.criado_em.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def registrar_transacao(db: Session, transacao: TransactionCreate, usuario_id: int):
    # 1. Verifica se o produto de fato existe
    produto = db.query(Product).filter(Product.id == transacao.produto_id).first()
    if not produto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado."
        )

    # 2. Verifica a regra de negócio matemática
    if transacao.tipo == TransactionType.SAIDA:
        if produto.quantidade_atual < transacao.quantidade:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Estoque insuficiente. Tentativa de saída de {transacao.quantidade}, mas o saldo atual é {produto.quantidade_atual}.",
            )
        produto.quantidade_atual -= transacao.quantidade
    elif transacao.tipo == TransactionType.ENTRADA:
        produto.quantidade_atual += transacao.quantidade

    # 3. Cria a movimentação histórico COM o carimbo do usuário
    transacao_data = transacao.model_dump()
    transacao_data["usuario_id"] = usuario_id  # Injetado pelo JWT, não pelo usuário
    db_transacao = Transaction(**transacao_data)

    # 4. Adiciona ao banco as DEUS entidades (Transaction nova + Product modificado)
    db.add(db_transacao)
    db.add(produto)

    # 5. Salva (Atomicidade garantida)
    db.commit()
    db.refresh(db_transacao)

    return db_transacao
