from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime, timezone


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    nome = Column(String, index=True, nullable=False)

    sku = Column(String, unique=True, nullable=False)
    codigo_barras = Column(String, unique=True, nullable=True)

    descricao = Column(String, nullable=True)

    preco_custo = Column(Float, nullable=False, default=0.0)
    preco_venda = Column(Float, nullable=False, default=0.0)

    quantidade_atual = Column(Integer, nullable=False, default=0)
    estoque_minimo = Column(Integer, nullable=False, default=5)

    ativo = Column(Boolean, default=True)

    categoria_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    fornecedor_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)

    categoria = relationship("Category", back_populates="produtos")
    fornecedor = relationship("Supplier", back_populates="produtos")
    transacoes = relationship("Transaction", back_populates="produto")

    criado_em = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    atualizado_em = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
