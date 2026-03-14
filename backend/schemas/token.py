from pydantic import BaseModel
from typing import Optional


# Para a Rota de Login conseguir responder o Token em formato OAuth2 Padrão
class Token(BaseModel):
    access_token: str
    token_type: str  # Ex: "bearer"


# Representação interna do que tem dentro do Token Descriptografado
class TokenPayload(BaseModel):
    # "Sub" é o Subject (De quem é este token?). Armazenaremos o ID dentro dele.
    sub: Optional[str] = None
