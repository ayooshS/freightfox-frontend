
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DispatchPlanEntry(BaseModel):
    reporting_date: str
    vehicle_capacity: int

class ShipOrderCreate(BaseModel):
    ship_order_id: str
    order_qty: int
    unit_of_measurement: str
    pickup_address: str
    delivery_address: str
    booked_rate: float
    product_sku: str
    product_description: str
    dispatch_plan: List[DispatchPlanEntry]

class ShipOrderResponse(BaseModel):
    ship_order_id: str
    status: str = "created"

class ShipOrder(ShipOrderCreate):
    status: str = "pending"
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
