from google.oauth2 import service_account
from googleapiclient.discovery import build
from typing import Optional
import os
import json
from ast import literal_eval

class Database:
    service = None
    SPREADSHEET_ID = os.getenv('GOOGLE_SHEET_ID')
    RANGE_NAME = 'Sheet1!A:O'  # Extended range to include created_at

    @classmethod
    async def connect_db(cls):
        # Use service account credentials
        credentials = service_account.Credentials.from_service_account_info(
            json.loads(os.getenv('GOOGLE_CREDENTIALS')),
            scopes=['https://www.googleapis.com/auth/spreadsheets']
        )
        cls.service = build('sheets', 'v4', credentials=credentials)
        return cls.service

    @classmethod
    def get_db(cls):
        if not cls.service:
            cls.connect_db()
        return cls.service.spreadsheets()

    @classmethod
    async def get_ship_orders(cls, page_size: int, status_filter: Optional[str] = None, transporter_id: Optional[str] = None):
        sheets = cls.get_db()
        result = sheets.values().get(
            spreadsheetId=cls.SPREADSHEET_ID,
            range=cls.RANGE_NAME
        ).execute()

        values = result.get('values', [])
        # print("Values: ",values)
        if not values:
            return [], 0

        # print("Values: ", values)    
        orders = []
        for row in values[1:]:  # Skip header row
            # Check if row has all required fields
            if len(row) < 11:
                continue

            # Skip if transporter_id doesn't match (when provided)
            if transporter_id and row[12] != transporter_id:
                continue

            # Skip if status filter doesn't match (when provided)
            if status_filter and status_filter.lower() != "all":
                current_status = row[11].lower() if len(row) > 11 else "new"
                filter_status = status_filter.lower()
                
                # Handle different filter cases
                if filter_status == "in_progress" and current_status not in ["accepted", "in_progress"]:
                    continue
                elif filter_status == "new" and current_status != "new":
                    continue
                elif filter_status == "accepted" and current_status != "accepted":
                    continue
                elif filter_status == "done" and current_status != "done":
                    continue
                elif filter_status not in ["in_progress", "new", "accepted", "done", "all"]:
                    continue

            order = {
                "ship_order_id": row[0],
                "fulfilment_order_id": row[1],
                "buyer_name": row[2],
                "total_placed_capacity": int(row[14]) if len(row) >= 14 and row[14] else None,
                "transporter_id": row[12] if len(row) >= 13 else transporter_id,
                "status": row[11],
                "created_at": row[13] if len(row) >= 14 else None,
                "order_qty": int(row[3]),
                "unit_of_measurement": row[4],
                "pickup_address": row[5],
                "delivery_address": row[6],
                "booked_rate": float(row[7]),
                "product_sku": row[8],
                "product_description": row[9],
                "dispatch_plan": json.loads(row[10].replace("'", '"'))
            }

            orders.append(order)

        total_count = len(orders)
        print("Total Count: ", total_count)
        # Apply pagination
        start_idx = 0
        end_idx = min(page_size, total_count)

        return orders[start_idx:end_idx], total_count

    @classmethod
    async def get_next_ship_order_id(cls):
        try:
            sheets = cls.get_db()
            result = sheets.values().get(
                spreadsheetId=cls.SPREADSHEET_ID,
                range='counter!A:B'
            ).execute()
            
            values = result.get('values', [])
            print("Counter values from sheet:", values)  # Debug log
            if not values:  # If sheet is empty
                # Initialize counter sheet with header and first value
                sheets.values().update(
                    spreadsheetId=cls.SPREADSHEET_ID,
                    range='counter!A1:B2',
                    valueInputOption='RAW',
                    body={'values': [
                        ['counter_name', 'value'],
                        ['ship_order_counter', 'SO/25/0']
                    ]}
                ).execute()
                current_id = "SO/25/0"
            else:
                try:
                    current_id = values[1][1]  # Get the current counter value
                except (IndexError, KeyError): current_id = "SO/25/0"  # Fallback value
        except Exception as e:
            print(f"Error inserting ship order: {str(e)}")  # Error log
            raise Exception(f"Failed to insert ship order: {str(e)}")
        except:
            print("Unknown error occurred while inserting ship order")
            raise Exception("Unknown error occurred while inserting ship order")
        # Parse and increment the counter
        prefix, year, num = current_id.split('/')
        next_id = f"{prefix}/{year}/{int(num) + 1}"
        
        # Update the counter
        sheets.values().update(
            spreadsheetId=cls.SPREADSHEET_ID,
            range='counter!B2',
            valueInputOption='RAW',
            body={'values': [[next_id]]}
        ).execute()
        
        return next_id

    @classmethod
    async def insert_ship_order(cls, order_data):
    
        from datetime import datetime
        from pytz import timezone
        
        sheets = cls.get_db()
        india_tz = timezone('Asia/Kolkata')
        current_time = datetime.now(india_tz).strftime('%d-%m-%Y %H:%M:%S')
        # print("Processing order data:", order_data)  # Debug log
        
        # Get next ship order ID
        ship_order_id = await cls.get_next_ship_order_id()
        order_data["ship_order_id"] = ship_order_id
        order_data["status"] = "new"  # Set default status
        
        values = [[
            order_data["ship_order_id"],
            order_data["fulfilment_order_id"],
            order_data["buyer_name"],
            order_data["order_qty"],
            order_data["unit_of_measurement"],
            order_data["pickup_address"],
            order_data["delivery_address"],
            order_data["booked_rate"],
            order_data["product_sku"],
            order_data["product_description"],
            json.dumps(order_data["dispatch_plan"]),
            order_data["status"],
            order_data["transporter_id"],
            current_time
        ]]

        try:
            body = {'values': values}
            # print("Inserting values:", values)  # Debug log
            result = sheets.values().append(
                spreadsheetId=cls.SPREADSHEET_ID,
                range=cls.RANGE_NAME,
                valueInputOption='RAW',
                body=body
            ).execute()
            return values
        except Exception as e:
            print(f"Error inserting ship order: {str(e)}")  # Error log
            raise Exception(f"Failed to insert ship order: {str(e)}")
        except:
            print("Unknown error occurred while inserting ship order")
            raise Exception("Unknown error occurred while inserting ship order")

    @classmethod
    async def update_ship_order_status(cls, ship_order_id: str, transporter_id: str, new_status: str, action: Optional[str] = None):
        # If action is provided, override the new_status
        print("ship_order_id:",ship_order_id)
        if action:
            if action == "in_progress":
                new_status = "in_progress"
            elif action == "done":
                new_status = "done"
        sheets = cls.get_db()
        result = sheets.values().get(
            spreadsheetId=cls.SPREADSHEET_ID,
            range=cls.RANGE_NAME
        ).execute()

        values = result.get('values', [])
        # print("Values: ", values)
        if not values:
            return False

        # print("Values: ", values)
        # Find the row to update
        row_idx = None
        for idx, row in enumerate(values):
            if (row[0] == ship_order_id and 
                row[12] == transporter_id):
                row_idx = idx
                break

        if row_idx is None:
            return False

        # Update the status
        range_name = f'Sheet1!L{row_idx + 1}'
        body = {'values': [[new_status]]}

        try:
            sheets.values().update(
                spreadsheetId=cls.SPREADSHEET_ID,
                range=range_name,
                valueInputOption='RAW',
                body=body
            ).execute()
            return True
        except Exception:
            return False

    @classmethod
    async def close_db(cls):
        if cls.service:
            cls.service.close()

    @classmethod
    async def place_vehicle(cls, placement_data: dict):
        sheets = cls.get_db()

        # First verify if ship order exists and update total_placed_capacity
        result = sheets.values().get(
            spreadsheetId=cls.SPREADSHEET_ID,
            range=cls.RANGE_NAME
        ).execute()

        # Update total_placed_capacity in Sheet1
        if "total_placed_capacity" in placement_data:
            values = result.get('values', [])
            for idx, row in enumerate(values):
                if row[0] == placement_data["ship_id"]:
                    # Update total_placed_capacity in column M (13th column)
                    range_name = f'Sheet1!O{idx + 1}'
                    body = {'values': [[placement_data["total_placed_capacity"]]]}
                    sheets.values().update(
                        spreadsheetId=cls.SPREADSHEET_ID,
                        range=range_name,
                        valueInputOption='RAW',
                        body=body
                    ).execute()
                    break

        values = result.get('values', [])
        if not values:
            return False, "Database is empty"

        # Check if ship order exists
        ship_order_exists = False
        for row in values[1:]:  # Skip header
            if row[0] == placement_data["ship_id"]:
                ship_order_exists = True
                break

        if not ship_order_exists:
            return False, "Ship order not found"

        # Add vehicle placement to a new sheet
        placement_range = 'VehiclePlacements!A:M'  # Extended range for new fields
        placement_values = [[
            placement_data["ship_id"],
            placement_data["transporter_id"],
            placement_data["vehicle_number"],
            placement_data["capacity"],
            placement_data["driver_name"],
            placement_data["driver_mobile_number"],
            placement_data["placement_date"].isoformat(),
            "placed",  # Initial status
            placement_data["eway_bill_number"],
            placement_data["invoice_number"],
            placement_data["lorry_receipt_number"],
            placement_data["transporter_name"],
            placement_data["transporter_identifier"]
        ]]

        try:
            body = {'values': placement_values}
            sheets.values().append(
                spreadsheetId=cls.SPREADSHEET_ID,
                range=placement_range,
                valueInputOption='RAW',
                body=body
            ).execute()
            return True, "Vehicle placement recorded successfully"
        except Exception as e:
            return False, str(e)

    @classmethod
    async def update_vehicle_placement(cls, ship_order_id: str, vehicle_number: str, placement_data: dict):
        sheets = cls.get_db()

        # First find the vehicle placement record
        result = sheets.values().get(
            spreadsheetId=cls.SPREADSHEET_ID,
            range='VehiclePlacements!A:K'
        ).execute()

        values = result.get('values', [])
        if not values:
            return False, "No vehicle placements found"

        # Find the row to update
        row_idx = None
        for idx, row in enumerate(values):
            if len(row) >= 3 and row[0] == ship_order_id and row[2] == vehicle_number:
                row_idx = idx
                break

        if row_idx is None:
            return False, "Vehicle placement not found"

        # Update the vehicle placement
        update_range = f'VehiclePlacements!A{row_idx + 1}:K{row_idx + 1}'
        update_values = [[
            placement_data["ship_order_id"],
            placement_data["transporter_id"],
            placement_data["vehicle_number"],
            placement_data["capacity"],
            placement_data["driver_name"],
            placement_data["driver_mobile_number"],
            placement_data["placement_date"].isoformat(),
            "updated",
            placement_data["eway_bill_number"],
            placement_data["invoice_number"],
            placement_data["lorry_receipt_number"]
        ]]

        try:
            body = {'values': update_values}
            sheets.values().update(
                spreadsheetId=cls.SPREADSHEET_ID,
                range=update_range,
                valueInputOption='RAW',
                body=body
            ).execute()
            return True, "Vehicle placement updated successfully"
        except Exception as e:
            return False, str(e)

    @classmethod
    async def get_vehicle_placements(cls, page_size: int, transporter_id: Optional[str] = None, ship_order_id: Optional[str] = None):
        sheets = cls.get_db()
        result = sheets.values().get(
            spreadsheetId=cls.SPREADSHEET_ID,
            range='VehiclePlacements!A:K'
        ).execute()

        values = result.get('values', [])
        if not values:
            return [], 0

        vehicles = []
        total_placed_capacity = 0
        current_ship_id = None

        for row in values[1:]:  # Skip header row
            if len(row) < 11:  # Make sure row has all required fields
                continue

            # Skip if filters don't match
            if transporter_id and row[1] != transporter_id:
                continue
            if ship_order_id and row[0] != ship_order_id:
                continue

            current_ship_id = row[0]
            vehicle = {
                "transporter_id": row[1],
                "vehicle_number": row[2],
                "capacity": int(row[3]),
                "driver_name": row[4],
                "driver_mobile_number": row[5],
                "placement_date": row[6],
                "status": row[7],
                "eway_bill_number": row[8] if len(row) > 8 else None,
                "invoice_number": row[9] if len(row) > 9 else None,
                "lorry_receipt_number": row[10] if len(row) > 10 else None
            }
            total_placed_capacity += int(row[3])
            vehicles.append(vehicle)

        # Apply pagination
        start_idx = 0
        end_idx = min(page_size, len(vehicles))
        vehicles = vehicles[start_idx:end_idx]

        return {
            "ship_id": current_ship_id,
            "total_placed_capacity": total_placed_capacity,
            "vehicles": vehicles
        }, len(vehicles)

    @classmethod
    async def get_transporters(cls, page_size: int = 10):
        try:
            sheets = cls.get_db()
            result = sheets.values().get(
                spreadsheetId=cls.SPREADSHEET_ID,
                range='Transporters!A:C'
            ).execute()

            values = result.get('values', [])
            if not values:
                return [], 0

            transporters = []
            for row in values[1:]:  # Skip header row
                if len(row) < 2:  # At least id and name should be present
                    continue

                transporter = {
                    "transporter_id": row[0],
                    "transporter_name": row[1],
                    "transporter_identifier": row[2] if len(row) > 2 else None
                }
                transporters.append(transporter)

            total_count = len(transporters)
            # Apply pagination
            start_idx = 0
            end_idx = min(page_size, total_count)

            return transporters[start_idx:end_idx], total_count
        except Exception as e:
            print(f"Error getting transporters: {str(e)}")
            raise Exception(f"Failed to get transporters: {str(e)}")
