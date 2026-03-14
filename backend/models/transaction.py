from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime, timezone


import enum
from sqlalchemy import Enum as SQLAlchemyEnum


class TransactionType(str, enum.Enum):
    ENTRADA = "ENTRADA"
    SAIDA = "SAIDA"


class Transaction(Base):
    """
    Representa o log imutável de movimentações de estoque de um produto.
    Qualquer alteração na quantidade_atual do produto deve provir de uma transação.
    """

    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    # Qual produto foi movimentado
    produto_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    # ENTRADA ou SAIDA
    tipo = Column(SQLAlchemyEnum(TransactionType), nullable=False)

    # Quantia modificada (ex: 5)
    quantidade = Column(Integer, nullable=False)

    # Observações de negócio, como "Nota fiscal X" ou "Quebra de prateleira"
    observacao = Column(String, nullable=True)

    # Ligação c/ tabela Users - Preenchido via Token JWT pelo Backend
    usuario_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Data da movimentação (Auditoria)
    criado_em = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relacionamento para acesso programático `transaction.produto`
    produto = relationship("Product", back_populates="transacoes")
