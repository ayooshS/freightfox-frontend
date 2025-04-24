
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.api.main import app
from app.api.database import Database

client = TestClient(app)

@pytest.fixture
def mock_google_sheets():
    with patch('app.api.database.build') as mock_build:
        mock_service = MagicMock()
        mock_sheets = MagicMock()
        mock_values = MagicMock()
        
        # Mock the chain of calls for sheets API
        mock_build.return_value.spreadsheets.return_value = mock_sheets
        mock_sheets.values.return_value = mock_values
        mock_values.append.return_value.execute.return_value = {'updates': {'updatedRows': 1}}
        
        yield mock_sheets

def test_create_ship_order(mock_google_sheets):
    # Mock data
    test_order = {
        "ship_order_id": "TEST001",
        "order_qty": 100,
        "unit_of_measurement": "MT",
        "pickup_address": "Test Pickup, City",
        "delivery_address": "Test Delivery, City",
        "booked_rate": 1000.0,
        "product_sku": "SKU123",
        "product_description": "Test Product",
        "dispatch_plan": [
            {
                "reporting_date": "2024-02-20",
                "vehicle_capacity": 20
            }
        ]
    }

    # Mock the Google Sheets connection
    Database.service = mock_google_sheets
    
    # Make request to create ship order
    response = client.post("/v1/ship-orders", json=test_order)
    
    # Assert response
    assert response.status_code == 201
    assert response.json()["ship_order_id"] == "TEST001"
    assert response.json()["status"] == "created"
    
    # Verify Google Sheets was called
    mock_google_sheets.values.return_value.append.assert_called_once()
