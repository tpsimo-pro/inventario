from sqlalchemy.orm import Session
from fastapi import HTTPException
from core.security import verify_password, get_password_hash
from models.user import User
from schemas.user import UserCreate


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user: UserCreate):
    """Cria um novo funcionário e destrói matematicamente a senha em hash"""

    # 1. Checar Duplicate Email
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400, detail="E-mail já cadastrado neste almoxarifado."
        )

    # 2. Transforma senha em Hash irreversível
    hashed_password = get_password_hash(user.password)

    # 3. Cria a entidade DB despresando o campo original e apontando pro hash
    db_user = User(email=user.email, nome=user.nome, hashed_password=hashed_password)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def authenticate_user(db: Session, email: str, password: str):
    """
    Tenta logar um funcionário. Compara o e-mail no Banco.
    Se bater, verifica se a string 'password' triturada
    resulta no mesmo 'hashed_password' salvo 5 anos atrás.
    """
    user = get_user_by_email(db, email)

    if not user:
        return False

    if not verify_password(password, user.hashed_password):
        return False

    return user
