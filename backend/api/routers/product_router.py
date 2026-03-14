from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from api.deps import get_db
from schemas.product import ProductCreate, ProductResponse, ProductUpdate
from services.product_service import (
    get_products,
    get_product_by_id,
    create_product,
    update_product,
    delete_product,
    get_produtos_alerta_estoque,
)

router_produtos = APIRouter(prefix="/produtos", tags=["Produtos"])


@router_produtos.get("/", response_model=List[ProductResponse])
def listar_produtos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retorna todos os produtos com suporte a paginação simpes (skip, limit)."""
    return get_products(db, skip=skip, limit=limit)


@router_produtos.get("/alertas/estoque-baixo", response_model=List[ProductResponse])
def listar_produtos_em_alerta(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """
    Retorna apenas os produtos ativos em que a Quantidade Atual atingiu
    ou caiu abaixo do seu Estoque Mínimo configurado.
    Ideal para Dashboard e envio de e-mails diários.
    """
    return get_produtos_alerta_estoque(db, skip=skip, limit=limit)


@router_produtos.get("/{produto_id}", response_model=ProductResponse)
def buscar_produto(produto_id: int, db: Session = Depends(get_db)):
    """Detalha um produto específico pelo seu ID."""
    return get_product_by_id(db, product_id=produto_id)


@router_produtos.post(
    "/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED
)
def cadastrar_produto(produto: ProductCreate, db: Session = Depends(get_db)):
    """Cria um novo produto. O Produto deve estar obrigatoriamente ligado a uma Categoria."""
    return create_product(db, product=produto)


@router_produtos.patch("/{produto_id}", response_model=ProductResponse)
def atualizar_produto_parcialmente(
    produto_id: int, produto: ProductUpdate, db: Session = Depends(get_db)
):
    """Atualiza parcialmente as informações de um Produto (apenas os campos enviados)."""
    return update_product(db, product_id=produto_id, product_update=produto)


@router_produtos.delete("/{produto_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_produto(produto_id: int, db: Session = Depends(get_db)):
    """Realiza o soft-delete (inativação) de um produto existente no controle."""
    delete_product(db, product_id=produto_id)
    return None
