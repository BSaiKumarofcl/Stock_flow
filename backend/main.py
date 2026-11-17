from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base, SessionLocal
from models import Product
from schemas import ProductCreate, ProductUpdate
app = FastAPI(title="StockFlow API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)


# Database connection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Add a product
@app.post("/products")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):

    new_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        quantity=product.quantity
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return {
        "message": "Product added successfully",
        "product": {
            "id": new_product.id,
            "name": new_product.name,
            "price": new_product.price,
            "quantity": new_product.quantity
        }
    }


# Get all products
@app.get("/products")
def get_products(db: Session = Depends(get_db)):

    products = db.query(Product).all()

    return products


# Home
@app.get("/")
def home():
    return {"message": "Welcome to StockFlow API"}

# Update a product
@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db)
):
    existing_product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if existing_product is None:
        return {"message": "Product not found"}

    existing_product.name = product.name
    existing_product.description = product.description
    existing_product.price = product.price
    existing_product.quantity = product.quantity

    db.commit()
    db.refresh(existing_product)

    return {
        "message": "Product updated successfully",
        "product": existing_product
    }

# Delete a product
@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    existing_product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if existing_product is None:
        return {"message": "Product not found"}

    db.delete(existing_product)
    db.commit()

    return {"message": "Product deleted successfully"}