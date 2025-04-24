
# FreightFox API Documentation

## Base URL
```
http://0.0.0.0:5000
```

## Endpoints

### 1. Health Check
Check if the API is running.

```bash
# Request
curl -X GET http://0.0.0.0:5000/

# Response
{
    "message": "FreightFox API is running"
}
```

### 2. Create Ship Order
Create a new shipping order.

```bash
# Request
curl -X POST http://0.0.0.0:5000/v1/ship-orders \
  -H "Content-Type: application/json" \
  -d '{
    "ship_order_id": "SO123",
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
  }'

# Response
{
    "ship_order_id": "SO123",
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
# Request
curl -X GET "http://0.0.0.0:5000/v1/ship-orders?page_size=10&status_filter=new"

# Response
{
    "orders": [
        {
            "ship_order_id": "SO123",
            "status": "pending",
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

## Data Models

### Ship Order Create
```typescript
{
    ship_order_id: string
    order_qty: number
    unit_of_measurement: string
    pickup_address: string
    delivery_address: string
    booked_rate: number
    product_sku: string
    product_description: string
    dispatch_plan: Array<{
        reporting_date: string
        vehicle_capacity: number
    }>
}
```

### Ship Order Response
```typescript
{
    ship_order_id: string
    status: string
    order_qty: number
    unit_of_measurement: string
    pickup_address: string
    delivery_address: string
    booked_rate: number
    product_sku: string
    product_description: string
    dispatch_plan: Array<{
        reporting_date: string
        vehicle_capacity: number
    }>
}
```

### Ship Order Filter
```typescript
{
    page_size: number  // default: 10
    status_filter: string | null  // "new" or "all"
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
- 500: Internal Server Error
