
from google.oauth2 import service_account
from googleapiclient.discovery import build
from typing import Optional
import os
import json
from ast import literal_eval

class Database:
    service = None
    SPREADSHEET_ID = os.getenv('GOOGLE_SHEET_ID')
    RANGE_NAME = 'Sheet1!A:J'  # Adjust range as needed
    
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
    async def get_ship_orders(cls, page_size: int, status_filter: Optional[str] = None):
        sheets = cls.get_db()
        result = sheets.values().get(
            spreadsheetId=cls.SPREADSHEET_ID,
            range=cls.RANGE_NAME
        ).execute()
        
        values = result.get('values', [])
        if not values:
            return [], 0
            
        orders = []
        for row in values[1:]:  # Skip header row
            if len(row) >= 10:
                order = {
                    "ship_order_id": row[0],
                    "order_qty": int(row[1]),
                    "unit_of_measurement": row[2],
                    "pickup_address": row[3],
                    "delivery_address": row[4],
                    "booked_rate": float(row[5]),
                    "product_sku": row[6],
                    "product_description": row[7],
                    "dispatch_plan": json.loads(row[8]),  # Convert string representation back to list
                    "status": row[9]
                }
                
                if status_filter == "new" and order["status"] != "pending":
                    continue
                    
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
            str(order_data["dispatch_plan"]),
            order_data["status"]
        ]]
        
        body = {'values': values}
        result = sheets.values().append(
            spreadsheetId=cls.SPREADSHEET_ID,
            range=cls.RANGE_NAME,
            valueInputOption='RAW',
            body=body
        ).execute()
        return result
