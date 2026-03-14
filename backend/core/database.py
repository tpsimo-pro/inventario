from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# A URL de conexão com o banco de dados SQLite.
# O arquivo 'inventario.db' será criado automaticamente na pasta raiz do projeto.
SQLALCHEMY_DATABASE_URL = "sqlite:///./inventario.db"

# O 'engine' é o motor do SQLAlchemy, responsável por gerenciar a comunicação e
# conexões físicas com o banco de dados.
# "check_same_thread": False é uma configuração necessária exclusivamente para SQLite
# no FastAPI, permitindo que múltiplas threads do servidor compartilhem essa conexão.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# O 'SessionLocal' é a classe que instanciará as nossas sessões de banco de dados
# para cada requisição da API.
# autocommit=False e autoflush=False são boas práticas para mantermos o controle
# explícito das transações (ou seja, nós decidiremos quando salvar os dados com session.commit()).
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# A classe 'Base' será herdada por todos os nossos futuros modelos (tabelas) do sistema.
# O SQLAlchemy utiliza isso para mapear classes Python para tabelas relacionais do banco.
Base = declarative_base()
