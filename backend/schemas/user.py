from pydantic import BaseModel, ConfigDict, EmailStr, Field


# Base (Para compartilhar propriedades)
class UserBase(BaseModel):
    # EmailStr valida nativamente se o '@' e o domínio estão corretos
    email: EmailStr
    nome: str


# Entrada de Dados: Criação de Conta
class UserCreate(UserBase):
    # Front-end nos envia a senha em texto puro (Ex: "123456")
    # Nosso UserService irá transformá-la no Hash antes do banco.
    password: str = Field(
        ..., min_length=6, description="A senha forte escolhida pelo usuário"
    )


# Response (A "Saída" de Dados API -> Frontend)
class UserResponse(UserBase):
    id: int
    is_active: bool
    is_superuser: bool

    # ATENÇÃO REDOBRADA
    # O Pydantic por padrão herda o ModelBase e recusa os hashes.
    # Excluímos qualquer chance da "password" voltar pro cliente!

    model_config = ConfigDict(from_attributes=True)
