
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routes.product_routes import router as product_router

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

# Register product routes
app.include_router(product_router)


@app.get("/")
def home():
    return {"message": "Welcome to StockFlow API"}
