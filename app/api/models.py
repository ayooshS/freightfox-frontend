
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DispatchPlanEntry(BaseModel):
    reporting_date: str
    vehicle_capacity: int

class ShipOrderCreate(BaseModel):
    ship_order_id: str
    fulfilment_order_id: str
    buyer_name: str
    transporter_id: str
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
    fulfilment_order_id: str
    buyer_name: str
    total_placed_capacity: Optional[int] = None
    transporter_id: str
    status: str = "created"
    created_at: Optional[str] = None
    order_qty: int
    unit_of_measurement: str
    pickup_address: str
    delivery_address: str
    booked_rate: float
    product_sku: str
    product_description: str
    dispatch_plan: List[DispatchPlanEntry]

class ShipOrder(ShipOrderCreate):
    status: str = "new"  # Default status is now "new"
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

class ShipOrderFilter(BaseModel):
    page_size: int = 10
    status_filter: Optional[str] = None  # "new" or "all"

class ShipOrderList(BaseModel):
    orders: List[ShipOrderResponse]
    total_count: int

class VehicleDetails(BaseModel):
    transporter_id: str
    vehicle_number: str
    capacity: int
    driver_mobile_number: str
    driver_name: str
    placement_date: datetime
    eway_bill_number: str
    invoice_number: str
    lorry_receipt_number: str

class VehiclePlacementRequest(BaseModel):
    ship_id: str
    total_placed_capacity: int
    vehicles: List[VehicleDetails]

class VehicleResponse(VehicleDetails):
    status: str = "placed"

class VehiclePlacementResponse(BaseModel):
    ship_id: str
    total_placed_capacity: int
    vehicles: List[VehicleResponse]
    message: str = "Vehicle placements recorded successfully"

class VehiclePlacementGet(BaseModel):
    ship_order_id: str
    transporter_id: str
    vehicle_number: str
    capacity: int
    driver_mobile_number: str
    driver_name: str
    placement_date: str
    status: str
    message: str
    eway_bill_number: Optional[str] = None
    invoice_number: Optional[str] = None
    lorry_receipt_number: Optional[str] = None

class VehiclePlacementList(BaseModel):
    ship_id: str
    total_placed_capacity: int
    vehicles: List[VehicleResponse]
    message: str = "Vehicle placements retrieved successfully"
