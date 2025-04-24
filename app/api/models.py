
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DispatchEntry(BaseModel):
    vehicle: int
    size: int
    eta: str

class ShipOrder(BaseModel):
    id: str
    buyer_name: str
    po_number: str
    material: str
    product_name: str
    quantity: str
    rate: str
    pickup_address: str
    drop_address: str
    dispatch_data: List[DispatchEntry]
    status: str = "pending"
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

class VehiclePlacement(BaseModel):
    order_id: str
    vehicle_number: str
    driver_name: str
    driver_phone: str
    expected_pickup_time: datetime
