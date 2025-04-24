
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from .database import Database
from .models import ShipOrderCreate, ShipOrderResponse, ShipOrder, ShipOrderFilter, ShipOrderList
from typing import Optional

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
            return ShipOrderResponse(**order.model_dump())
        else:
            raise HTTPException(status_code=500, detail="Failed to create ship order")
            
    except ValueError as ve:
        raise HTTPException(status_code=400, detail="Invalid JSON format. Please ensure all property names are enclosed in double quotes")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing request: {str(e)}")

@app.get("/v1/ship-orders", response_model=ShipOrderList)
async def get_ship_orders(filters: ShipOrderFilter = Depends(),transporter_id: Optional[str] = None):
    try:
        db = Database.get_db()
        if not db:
            raise HTTPException(status_code=500, detail="Database connection not available")
            
        orders, total_count = await Database.get_ship_orders(
            page_size=filters.page_size,
            status_filter=filters.status_filter,
            transporter_id=transporter_id
        )
        
        return ShipOrderList(
            orders=[ShipOrderResponse(**order) for order in orders],
            total_count=total_count
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/v1/ship-orders/{ship_order_id}/status")
async def update_ship_order_status(ship_order_id: str, transporter_id: str, action: str):
    try:
        db = Database.get_db()
        if not db:
            raise HTTPException(status_code=500, detail="Database connection not available")
            
        # Validate action
        if action.lower() not in ["accept", "reject"]:
            raise HTTPException(status_code=400, detail="Invalid action. Must be 'accept' or 'reject'")
            
        # Get order to verify it exists
        orders, _ = await Database.get_ship_orders(1, None, transporter_id)
        order = next((o for o in orders if o["ship_order_id"] == ship_order_id), None)
        
        if not order:
            raise HTTPException(status_code=404, detail="Ship Order not found")
            
        new_status = "accepted" if action.lower() == "accept" else "rejected"
        
        # Update order status in database
        result = await Database.update_ship_order_status(ship_order_id, transporter_id, new_status)
        
        if result:
            return {
                "ship_order_id": ship_order_id,
                "transporter_id": transporter_id,
                "status": new_status,
                "message": f"Ship Order {new_status} successfully"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to update ship order status")
            
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
