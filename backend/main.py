from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from core.database import engine, Base
from api.deps import get_db

from api.routers import (
    router_categorias,
    router_fornecedores,
    router_produtos,
    router_transacoes,
)
from api.routers.auth_router import router_auth
from api.routers.user_router import router_usuarios

from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sistema de Gerenciamento de Inventário API")

# Setup Fundamental para o Frontend (React na porta 5173 poder conversar com o Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],  # Portas padrão do Vite
    allow_credentials=True,
    allow_methods=["*"],  # Permitir GET, POST, PUT, DELETE
    allow_headers=["*"],  # Permitir headers customizados e Authorization (JWT)
)

app.include_router(router_categorias)
app.include_router(router_fornecedores)
app.include_router(router_produtos)
app.include_router(router_transacoes)
app.include_router(router_auth)
app.include_router(router_usuarios)


@app.get("/", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    return {
        "status": "sucesso",
        "message": "A API de Inventário online! Conexão com o banco de dados SQLite estabelecida com sucesso.",
    }
