from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from .database import Database
from .models import ShipOrderCreate, ShipOrderResponse, ShipOrder, ShipOrderFilter, ShipOrderList, VehiclePlacementRequest, VehiclePlacementResponse, VehiclePlacementList
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
        valid_actions = ["accept", "reject", "in_progress", "done"]
        if action.lower() not in valid_actions:
            raise HTTPException(status_code=400, detail=f"Invalid action. Must be one of: {', '.join(valid_actions)}")

        # Get order to verify it exists
        orders, _ = await Database.get_ship_orders(page_size=100, status_filter="all", transporter_id=transporter_id)
        order = next((o for o in orders if o["ship_order_id"] == ship_order_id), None)
        print("Ship-Orders:", orders)
        if not order:
            raise HTTPException(status_code=404, detail="Ship Order not found")

        # Map action to status
        new_status = action.lower()
        if action.lower() == "accept":
            new_status = "accepted"
        elif action.lower() == "reject":
            new_status = "rejected"

        # Update order status in database
        result = await Database.update_ship_order_status(ship_order_id, transporter_id, new_status)

        if result:
            return {
                "ship_order_id": ship_order_id,
                "transporter_id": transporter_id,
                "status": new_status,
                "message": "Ship Order status updated successfully"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to update ship order status")

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/v1/vehicle-placements", status_code=201, response_model=VehiclePlacementResponse)
async def place_vehicles(placement: VehiclePlacementRequest):
    try:
        db = Database.get_db()
        if not db:
            raise HTTPException(status_code=500, detail="Database connection not available")

        # Place each vehicle
        placed_vehicles = []
        for vehicle in placement.vehicles:
            vehicle_data = {
                "ship_order_id": placement.ship_id,
                **vehicle.model_dump()
            }
            success, message = await Database.place_vehicle(vehicle_data)
            
            if not success:
                if "not found" in message.lower():
                    raise HTTPException(status_code=404, detail=f"Ship order {placement.ship_id} not found")
                raise HTTPException(status_code=400, detail=message)
            
            placed_vehicles.append(VehicleResponse(**vehicle.model_dump()))

        return VehiclePlacementResponse(
            ship_id=placement.ship_id,
            vehicles=placed_vehicles
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/v1/vehicle-placements/{ship_order_id}/{vehicle_number}", response_model=VehiclePlacementResponse)
async def update_vehicle_placement(
    ship_order_id: str,
    vehicle_number: str,
    placement: VehiclePlacementRequest
):
    try:
        db = Database.get_db()
        if not db:
            raise HTTPException(status_code=500, detail="Database connection not available")

        success, message = await Database.update_vehicle_placement(ship_order_id, vehicle_number, placement.model_dump())

        if not success:
            if "not found" in message.lower():
                raise HTTPException(status_code=404, detail=message)
            raise HTTPException(status_code=400, detail=message)

        return VehiclePlacementResponse(
            **placement.model_dump(),
            status="updated",
            message=message
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/v1/vehicle-placements", response_model=VehiclePlacementList)
async def get_vehicle_placements(
    page_size: int = 10,
    transporter_id: Optional[str] = None,
    ship_order_id: Optional[str] = None
):
    try:
        db = Database.get_db()
        if not db:
            raise HTTPException(status_code=500, detail="Database connection not available")

        placements, total_count = await Database.get_vehicle_placements(
            page_size=page_size,
            transporter_id=transporter_id,
            ship_order_id=ship_order_id
        )

        return VehiclePlacementList(
            placements=[VehiclePlacementResponse(**placement) for placement in placements],
            total_count=total_count
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))