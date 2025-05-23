from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from .database import Database
from .models import ShipOrderCreate, ShipOrderResponse, ShipOrder, ShipOrderFilter, ShipOrderList, VehiclePlacementRequest, VehiclePlacementResponse, VehiclePlacementList, VehiclePlacementGet, VehicleResponse, TransporterList, TransporterResponse
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

        order_data = order.model_dump()
        from datetime import datetime
        from pytz import timezone
        import json

        india_tz = timezone('Asia/Kolkata')
        current_time = datetime.now(india_tz).strftime('%d-%m-%Y %H:%M:%S')

        result = await Database.insert_ship_order(order_data)
        # print("Result: ", result)
        if result:
            # --- Build Response Object ---
            row = result[0]
            
            # Ensure all payload values are properly formatted
            notification_payload = {
                "ship_order_id": str(row[0]) if row[0] else "",
                "fulfilment_order_id": str(row[1]) if row[1] else "",
                "buyer_name": str(row[2]) if row[2] else "",
                "order_qty": int(row[3]) if row[3] else 0,
                "unit_of_measurement": str(row[4]) if row[4] else "",
                "pickup_address": str(row[5]) if row[5] else "",
                "delivery_address": str(row[6]) if row[6] else "",
                "product_sku": str(row[8]) if row[8] else "",
                "product_description": str(row[9]) if row[9] else "",
                "confirm_url": "www.bizongo.com",
                "vehicle_number": "",
                "status": "created"
            }
            
            notif_result = await Database.send_notifications(
                event="freight_fox_notifs-1",
                email_list=["sabarish.r@bizongo.com"],
                payload=notification_payload
            )
            print("Notification Result: ", notif_result)
            return ShipOrderResponse(
                ship_order_id=row[0],
                fulfilment_order_id=row[1],
                buyer_name=row[2],
                transporter_id=row[12],
                status=row[11],
                created_at=row[13],
                order_qty=row[3],
                unit_of_measurement=row[4],
                pickup_address=row[5],
                delivery_address=row[6],
                booked_rate=row[7],
                product_sku=row[8],
                product_description=row[9],
                dispatch_plan=json.loads(row[10])
            )
            
            # response_data = order.model_dump()
            # print("response data:",response_data)
            # response_data["created_at"] = current_time
            # print("response data:",response_data)
            # print("ShipOrderResult:", ShipOrderResponse(**response_data))
            # return ShipOrderResponse(**response_data)
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

@app.put("/v1/ship-orders/status")
async def update_ship_order_status(ship_order_id: str, transporter_id: str, action: str):
    print(ship_order_id)
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
        # print("Ship-Orders:", orders)
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
                "ship_id": placement.ship_id,
                "total_placed_capacity": placement.total_placed_capacity,
                **vehicle.model_dump()
            }
            success, message = await Database.place_vehicle(vehicle_data)

            if not success:
                if "not found" in message.lower():
                    raise HTTPException(status_code=404, detail=f"Ship order {placement.ship_id} not found")
                raise HTTPException(status_code=400, detail=message)

            placed_vehicles.append({
                **vehicle.model_dump(),
                "status": "placed"
            })

        # Prepare response
        response = VehiclePlacementResponse(
            ship_id=placement.ship_id,
            total_placed_capacity=placement.total_placed_capacity,
            vehicles=placed_vehicles,
            message="Vehicle placements recorded successfully"
        )

        # Send notification
        try:
            notification_payload = {
                "ship_id": placement.ship_id,
                "total_placed_capacity": placement.total_placed_capacity,
                "vehicles": [
                    {
                        "transporter_id": vehicle.transporter_id,
                        "transporter_name": vehicle.transporter_name,
                        "transporter_identifier": vehicle.transporter_identifier,
                        "vehicle_number": vehicle.vehicle_number,
                        "capacity": vehicle.capacity,
                        "driver_mobile_number": vehicle.driver_mobile_number,
                        "driver_name": vehicle.driver_name,
                        "placement_date": vehicle.placement_date.isoformat(),
                        "eway_bill_number": vehicle.eway_bill_number,
                        "invoice_number": vehicle.invoice_number,
                        "lorry_receipt_number": vehicle.lorry_receipt_number
                    }
                    for vehicle in placement.vehicles
                ]
            }
            
            await Database.send_notifications(
                event="freight_fox_notifs-2",
                email_list=["sabarish.r@bizongo.com"],
                payload=notification_payload
            )
        except Exception as e:
            print(f"Warning: Failed to send notification: {str(e)}")
            # Continue with response even if notification fails
            
        return response

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
            ship_id=placements["ship_id"],
            total_placed_capacity=placements["total_placed_capacity"],
            vehicles=[VehicleResponse(**vehicle) for vehicle in placements["vehicles"]]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/v1/transporters", response_model=TransporterList)
async def get_transporters(page_size: int = 10):
    try:
        db = Database.get_db()
        if not db:
            raise HTTPException(status_code=500, detail="Database connection not available")

        transporters, total_count = await Database.get_transporters(page_size=page_size)
        
        return TransporterList(
            transporters=[TransporterResponse(**transporter) for transporter in transporters],
            total_count=total_count
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
