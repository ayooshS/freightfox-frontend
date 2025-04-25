from google.oauth2 import service_account
from googleapiclient.discovery import build
from typing import Optional
import os
import json
from ast import literal_eval

class Database:
    service = None
    SPREADSHEET_ID = os.getenv('GOOGLE_SHEET_ID')
    RANGE_NAME = 'Sheet1!A:K'  # Adjust range as needed

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
        if not values:
            return [], 0

        # print("Values: ", values)    
        orders = []
        for row in values[1:]:  # Skip header row
            # Check if row has all required fields
            if len(row) < 11:
                continue

            # Skip if transporter_id doesn't match (when provided)
            if transporter_id and row[10] != transporter_id:
                continue

            # Skip if status filter doesn't match (when provided)
            if status_filter and status_filter != "all" and row[9].lower() != status_filter.lower():
                continue

            order = {
                "ship_order_id": row[0],
                "transporter_id": row[10] if len(row) >= 11 else transporter_id,
                "order_qty": int(row[1]),
                "unit_of_measurement": row[2],
                "pickup_address": row[3],
                "delivery_address": row[4],
                "booked_rate": float(row[5]),
                "product_sku": row[6],
                "product_description": row[7],
                "dispatch_plan": json.loads(row[8].replace("'", '"')),
                "status": row[9]
            }

            orders.append(order)

        total_count = len(orders)
        # Apply pagination
        start_idx = 0
        end_idx = min(page_size, total_count)

        return orders[start_idx:end_idx], total_count

    @classmethod
    async def insert_ship_order(cls, order_data):
        sheets = cls.get_db()
        values = [[
            order_data["ship_order_id"],
            order_data["order_qty"],
            order_data["unit_of_measurement"],
            order_data["pickup_address"],
            order_data["delivery_address"],
            order_data["booked_rate"],
            order_data["product_sku"],
            order_data["product_description"],
            json.dumps(order_data["dispatch_plan"]),
            order_data["status"],
            order_data["transporter_id"]
        ]]

        body = {'values': values}
        result = sheets.values().append(
            spreadsheetId=cls.SPREADSHEET_ID,
            range=cls.RANGE_NAME,
            valueInputOption='RAW',
            body=body
        ).execute()
        return result

    @classmethod
    async def update_ship_order_status(cls, ship_order_id: str, transporter_id: str, new_status: str):
        sheets = cls.get_db()
        result = sheets.values().get(
            spreadsheetId=cls.SPREADSHEET_ID,
            range=cls.RANGE_NAME
        ).execute()

        values = result.get('values', [])
        print("Values: ", values)
        if not values:
            return False

        print("Values: ", values)
        # Find the row to update
        row_idx = None
        for idx, row in enumerate(values):
            if (row[0] == ship_order_id and 
                row[10] == transporter_id):
                row_idx = idx
                break

        if row_idx is None:
            return False

        # Update the status
        range_name = f'Sheet1!J{row_idx + 1}'
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