
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .database import Database
from .models import ShipOrderCreate, ShipOrderResponse, ShipOrder

app = FastAPI(title="FreightFox API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await Database.connect_db()

@app.on_event("shutdown")
async def shutdown():
    await Database.close_db()

@app.get("/")
async def root():
    return {"message": "FreightFox API is running"}

@app.post("/v1/ship-orders", status_code=201, response_model=ShipOrderResponse)
async def create_ship_order(order: ShipOrderCreate):
    try:
        db = Database.get_db()
        if not db:
            raise HTTPException(status_code=500, detail="Database connection not available")
        
        ship_order = ShipOrder(**order.model_dump())
        result = await Database.insert_ship_order(ship_order.model_dump())
        
        if result:
            return ShipOrderResponse(ship_order_id=order.ship_order_id)
        else:
            raise HTTPException(status_code=500, detail="Failed to create ship order")
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
