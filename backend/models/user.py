from sqlalchemy import Column, Integer, String, Boolean
from core.database import Base


class User(Base):
    """
    Representa as pessoas que operam o sistema.
    As senhas nunca são salvas neste modelo, apenas o hash resultante (hashed_password).
    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    # E-mail é o identificador único para Logar
    email = Column(String, unique=True, index=True, nullable=False)

    # Nome para exibição nas telas "Bem-Vindo, Thiago"
    nome = Column(String, nullable=False)

    # NUNCA guarde a senha em texto puro!
    hashed_password = Column(String, nullable=False)

    # Controle de Rh (O funcionário foi demitido? Desative-o aqui em vez de apagar)
    is_active = Column(Boolean, default=True)

    # O funcionário é Administrador do Sistema?
    is_superuser = Column(Boolean, default=False)
