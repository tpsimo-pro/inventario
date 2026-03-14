from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.product import Product
from models.category import Category
from models.supplier import Supplier
from schemas.product import ProductCreate, ProductUpdate


def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Product).offset(skip).limit(limit).all()


def get_produtos_alerta_estoque(db: Session, skip: int = 0, limit: int = 100):
    """
    Lista todos os produtos cujo estoque atual é menor ou igual ao
    estoque mínimo configurado, ignorando produtos inativos (Soft Deleted).
    """
    return (
        db.query(Product)
        .filter(Product.ativo == True)
        .filter(Product.quantidade_atual <= Product.estoque_minimo)
        .order_by(
            Product.quantidade_atual.asc()
        )  # Ordena do mais crítico (Zero) pra cima
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_product_by_id(db: Session, product_id: int):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado."
        )
    return product


def get_product_by_sku(db: Session, sku: str):
    return db.query(Product).filter(Product.sku == sku).first()


def create_product(db: Session, product: ProductCreate):
    category = db.query(Category).filter(Category.id == product.categoria_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria fornecida não existe.",
        )

    if product.fornecedor_id:
        supplier = (
            db.query(Supplier).filter(Supplier.id == product.fornecedor_id).first()
        )
        if not supplier:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fornecedor fornecido não existe.",
            )

    if get_product_by_sku(db, sku=product.sku):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Já existe um produto com este SKU.",
        )

    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def update_product(db: Session, product_id: int, product_update: ProductUpdate):
    db_product = get_product_by_id(db, product_id)
    update_data = product_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, product_id: int):
    db_product = get_product_by_id(db, product_id)
    db_product.ativo = False
    db.commit()
    db.refresh(db_product)
    return db_product
