from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from core.database import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    razao_social = Column(String, nullable=False)
    cnpj_cpf = Column(String, unique=True, index=True, nullable=True)
    email = Column(String, nullable=True)
    telefone = Column(String, nullable=True)

    produtos = relationship("Product", back_populates="fornecedor")
