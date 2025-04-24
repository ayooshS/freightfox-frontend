
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Database

app = FastAPI(title="FreightFox API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await Database.connect_db()

@app.on_event("shutdown")
async def shutdown():
    await Database.close_db()

@app.get("/")
async def root():
    return {"message": "FreightFox API is running"}
