from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt
import bcrypt as _bcrypt

# 1. Configurações Globais de Segurança
# Em produção real, este SECRET_KEY deve vir de variáveis de ambiente (.env)
# Para gerar uma chave forte você pode rodar openSSL no terminal: openssl rand -hex 32
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = (
    60  # O Token expira em 1 hora para evitar roubos prolongados
)

# 2. Funções de Criptografia (Hash de Senhas)
# Usamos o bcrypt diretamente (sem passlib) para evitar bugs de compatibilidade
# entre passlib 1.7.4 e bcrypt 4.x que causavam ValueError mesmo em senhas curtas.


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha em texto plano bate com o hash salvo no banco."""
    return _bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )


def get_password_hash(password: str) -> str:
    """Transforma a senha em hash bcrypt irreversível para armazenar no banco."""
    salt = _bcrypt.gensalt()
    return _bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


# 3. Geração de JSON Web Tokens (Passaporte)
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Recebe um dicionário (geralmente com o ID ou Email do usuário),
    adiciona um fuso de tempo para expirar e 'assina' isso com nossa SECRET_KEY.
    Isso prova matematicamente que foi a nossa API quem gerou esse crachá.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})

    # jwt.encode pega tudo isso e gera aquela String grande de três partes: HEAD.PAYLOAD.SIGNATURE
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
