# Sistema de Gerenciamento de Inventário

Este projeto é um sistema de gerenciamento de inventário com um backend em **FastAPI** e um frontend em **React** (Vite).

---

## 🚀 Como Executar o Projeto

Siga as instruções abaixo para configurar e rodar o backend e o frontend.

### 1. Pré-requisitos

*   **Python 3.8+**
*   **Node.js 18+**
*   **npm** ou **yarn**

---

### 2. Configuração do Backend (FastAPI)

O backend utiliza SQLite como banco de dados por padrão.

1.  Acesse a pasta do backend:
    ```bash
    cd backend
    ```

2.  Crie um ambiente virtual (opcional, mas recomendado):
    ```bash
    python -m venv venv
    ```

3.  Ative o ambiente virtual:
    *   **Windows:** `venv\Scripts\activate`
    *   **Linux/macOS:** `source venv/bin/activate`

4.  Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```

5.  Inicie o servidor:
    ```bash
    uvicorn main:app --reload
    ```
    *   A API estará disponível em: [http://localhost:8000](http://localhost:8000)
    *   Documentação Swagger: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 3. Configuração do Frontend (React + Vite)

1.  Acesse a pasta do frontend:
    ```bash
    cd frontend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
    *   O frontend estará disponível em: [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Tecnologias Utilizadas

*   **Backend:** FastAPI, SQLAlchemy, SQLite, Pydantic.
*   **Frontend:** React, Vite, TypeScript, Axios, React Router, React Icons.

## 📁 Estrutura do Projeto

*   `/backend`: Código fonte da API e lógica de negócio.
*   `/frontend`: Interface do usuário construída com React.
