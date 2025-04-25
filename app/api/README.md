
# FreightFox API Documentation

## Base URL
```
http://0.0.0.0:5000
```

## Endpoints

### 1. Health Check
Check if the API is running.

```bash
GET /

Response 200 OK:
{
    "message": "FreightFox API is running"
}
```

### 2. Create Ship Order
Create a new shipping order.

```bash
POST /v1/ship-orders

Request Body:
{
    "ship_order_id": "SO123",
    "transporter_id": "T123",
    "order_qty": 100,
    "unit_of_measurement": "MT",
    "pickup_address": "Mumbai Port, Maharashtra",
    "delivery_address": "Pune Warehouse, Maharashtra",
    "booked_rate": 5000.0,
    "product_sku": "STEEL-001",
    "product_description": "Steel Plates",
    "dispatch_plan": [
        {
            "reporting_date": "2024-02-25",
            "vehicle_capacity": 20
        }
    ]
}

Response 201 Created:
{
    "ship_order_id": "SO123",
    "transporter_id": "T123",
    "status": "created",
    "order_qty": 100,
    "unit_of_measurement": "MT",
    "pickup_address": "Mumbai Port, Maharashtra",
    "delivery_address": "Pune Warehouse, Maharashtra",
    "booked_rate": 5000.0,
    "product_sku": "STEEL-001",
    "product_description": "Steel Plates",
    "dispatch_plan": [
        {
            "reporting_date": "2024-02-25",
            "vehicle_capacity": 20
        }
    ]
}
```

### 3. Get Ship Orders
Retrieve a list of ship orders with optional filtering.

```bash
GET /v1/ship-orders?page_size=10&status_filter=new&transporter_id=T123

Query Parameters:
- page_size: Number of records per page (default: 10)
- status_filter: Filter by status ("new", "accepted", "rejected", "all")
- transporter_id: Filter by transporter ID (optional)

Response 200 OK:
{
    "orders": [
        {
            "ship_order_id": "SO123",
            "transporter_id": "T123",
            "status": "new",
            "order_qty": 100,
            "unit_of_measurement": "MT",
            "pickup_address": "Mumbai Port, Maharashtra",
            "delivery_address": "Pune Warehouse, Maharashtra",
            "booked_rate": 5000.0,
            "product_sku": "STEEL-001",
            "product_description": "Steel Plates",
            "dispatch_plan": [
                {
                    "reporting_date": "2024-02-25",
                    "vehicle_capacity": 20
                }
            ]
        }
    ],
    "total_count": 1
}
```

### 4. Update Ship Order Status
Accept or reject a ship order.

```bash
PUT /v1/ship-orders/{ship_order_id}/status?transporter_id={transporter_id}&action={action}

Path Parameters:
- ship_order_id: ID of the ship order

Query Parameters:
- transporter_id: ID of the transporter
- action: "accept" or "reject"

Response 200 OK:
{
    "ship_order_id": "SO123",
    "transporter_id": "T123",
    "status": "accepted",
    "message": "Ship Order accepted successfully"
}
```

### 5. Place Vehicle
Place a vehicle for a ship order.

```bash
POST /v1/vehicle-placements

Request Body:
{
    "ship_order_id": "SO123",
    "transporter_id": "T123",
    "vehicle_number": "MH12AB1234",
    "capacity": 15,
    "driver_mobile_number": "98985784475",
    "driver_name": "Sam",
    "placement_date": "2025-04-02T12:34:56Z"
}

Response 201 Created:
{
    "ship_order_id": "SO123",
    "transporter_id": "T123",
    "vehicle_number": "MH12AB1234",
    "capacity": 15,
    "driver_mobile_number": "98985784475",
    "driver_name": "Sam",
    "placement_date": "2025-04-02T12:34:56Z",
    "status": "placed",
    "message": "Vehicle placement recorded successfully"
}
```

### 6. Update Vehicle Placement
Update an existing vehicle placement for a ship order.

```bash
PUT /v1/vehicle-placements/{ship_order_id}/{vehicle_number}

Path Parameters:
- ship_order_id: ID of the ship order
- vehicle_number: Vehicle registration number

Request Body:
{
    "ship_order_id": "SO123",
    "transporter_id": "T123",
    "vehicle_number": "MH12AB1234",
    "capacity": 15,
    "driver_mobile_number": "98985784475",
    "driver_name": "Sam",
    "placement_date": "2025-04-02T12:34:56Z"
}

Response 200 OK:
{
    "ship_order_id": "SO123",
    "transporter_id": "T123",
    "vehicle_number": "MH12AB1234",
    "capacity": 15,
    "driver_mobile_number": "98985784475",
    "driver_name": "Sam",
    "placement_date": "2025-04-02T12:34:56Z",
    "status": "updated",
    "message": "Vehicle placement updated successfully"
}
```

### 7. Get Vehicle Placements
Retrieve a list of vehicle placements with optional filtering.

```bash
GET /v1/vehicle-placements?page_size=10&transporter_id=T123&ship_order_id=SO123

Query Parameters:
- page_size: Number of records per page (default: 10)
- transporter_id: Filter by transporter ID (optional)
- ship_order_id: Filter by ship order ID (optional)

Response 200 OK:
{
    "placements": [
        {
            "ship_order_id": "SO123",
            "transporter_id": "T123",
            "vehicle_number": "MH12AB1234",
            "capacity": 15,
            "driver_mobile_number": "98985784475",
            "driver_name": "Sam",
            "placement_date": "2025-04-02T12:34:56Z",
            "status": "placed",
            "message": "Vehicle placement retrieved successfully"
        }
    ],
    "total_count": 1
}
```

## Error Responses

```json
{
    "detail": "Error message description"
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error
