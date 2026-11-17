from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    price: float
    quantity: int = 0
class ProductUpdate(BaseModel):
    name: str
    description: str | None = None
    price: float
    quantity: int