from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from api.deps import get_db
from core.security import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token
from schemas.token import Token
from schemas.user import UserResponse
from services.user_service import authenticate_user
from api.deps import get_current_user
from models.user import User

router_auth = APIRouter(prefix="/auth", tags=["Autenticação"])


@router_auth.post("/login", response_model=Token)
def login_for_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    Guichê de VIP.
    O frontend envia (email, password). Checamos no Banco.
    Se a senha bater, geramos o JSON Web Token (JWT).
    """
    user = authenticate_user(db, email=form_data.username, password=form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # Gerando o passaporte, guardando apenas o ID do usuário como 'sub'
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router_auth.get("/me", response_model=UserResponse)
def ler_usuario_logado(current_user: User = Depends(get_current_user)):
    """
    Exemplo prático de como proteger Rotas!
    Ninguém consegue acessar isso aqui sem mandar o header com o Bearer Token Gerado acima.
    O FastAPI magicamente decripta o token, e nos entrega o `current_user` completo direto do SQLite.
    """
    return current_user
