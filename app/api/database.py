
from google.oauth2 import service_account
from googleapiclient.discovery import build
import os
import json

class Database:
    service = None
    SPREADSHEET_ID = os.getenv('GOOGLE_SHEET_ID')
    RANGE_NAME = 'Sheet1!A:J'  # Adjust range as needed
    
    @classmethod
    def connect_db(cls):
        # Use service account credentials
        credentials = service_account.Credentials.from_service_account_info(
            json.loads(os.getenv('GOOGLE_CREDENTIALS')),
            scopes=['https://www.googleapis.com/auth/spreadsheets']
        )
        cls.service = build('sheets', 'v4', credentials=credentials)
    
    @classmethod
    def get_db(cls):
        if not cls.service:
            cls.connect_db()
        return cls.service.spreadsheets()
    
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
