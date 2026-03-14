from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from api.deps import get_db
from schemas.user import UserCreate, UserResponse
from services.user_service import create_user

router_usuarios = APIRouter(prefix="/usuarios", tags=["Gestão de Usuários e RH"])


@router_usuarios.post(
    "/", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
def criar_novo_usuario(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Cadastra um novo funcionário do almoxarifado no banco,
    transformando a senha em bcrypt irreversível.
    """
    user = create_user(db, user=user_in)
    return user
