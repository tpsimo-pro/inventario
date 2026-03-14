from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from core.database import SessionLocal
from core.security import SECRET_KEY, ALGORITHM
from schemas.token import TokenPayload
from services.user_service import get_user

# Setup Catraca: Declara onde fica o guichê pra pegar Token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# Esta função atua como uma dependência no FastAPI.
# Para cada rota que precisar acessar o banco de dados (ex: salvar um produto, buscar um usuário),
# o FastAPI injetará essa função automaticamente.
def get_db() -> Generator:
    # 1. Abre uma nova sessão conectada ao banco de dados SQLite.
    db = SessionLocal()
    try:
        # 2. O 'yield' pausa a execução da função e "entrega" a conexão ('db') para a rota.
        # A rota usará essa conexão para interagir com o banco de dados.
        yield db
    finally:
        # 3. Este bloco 'finally' sempre será executado depois que a requisição da rota terminar
        # (seja com sucesso ou com erro de servidor).
        # Ele garante que a conexão será fechada corretamente para evitar vazamentos de memória e
        # que conexões do banco fiquem penduradas indefinidamente.
        db.close()


def get_current_user(
    db: Session = Depends(get_db),
    # Extrai o token do header Authorization: Bearer <TOKEN> se não mandar dá ERRO 401 automático
    token: str = Depends(oauth2_scheme),
):
    """A Dependência Central que protege todas rotas privadas."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais de Autenticação Inválidas (Token Vencido ou Falsificado)",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Tenta quebrar a chave matemática
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # O Payload tem o "sub" guardado na criptografia
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception

        token_data = TokenPayload(sub=user_id)

    except JWTError:
        raise credentials_exception

    user = get_user(db, user_id=int(token_data.sub))

    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Usuário Inativo/Banido")

    return user
