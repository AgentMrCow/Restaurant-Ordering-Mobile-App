from fastapi import FastAPI, Header, Depends, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from jose import jwt, JWTError
from passlib.context import CryptContext
import uvicorn
from pydantic import BaseModel, EmailStr, validator, ValidationError
from datetime import datetime
from typing import List
import os
from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from dotenv.main import load_dotenv

# Take environment variables from .env file.
load_dotenv()

DATABASE_URI = os.getenv("DATABASE_URI")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not DATABASE_URI:
    raise ValueError("DATABASE_URI is not set in .env file")

if not JWT_SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY is not set in .env file")

# Configuration and Constants
client = MongoClient(DATABASE_URI, server_api=ServerApi('1'))
db = client.myStore

# Test MongoDB connection
try:
    client.admin.command('ping')
    print("Successfully connected to MongoDB!")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")

# FastAPI and Security Setup
app = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Pydantic Models for Request Data
class AuthData(BaseModel):
    email: EmailStr
    password: str

    # @validator('password')
    # def password_length(cls, value):
    #     if len(value) < 8:
    #         raise ValueError('Password must be at least 8 characters')
    #     return value

class RegistrationData(AuthData):
    confirmPassword: str
    dateOfBirth: datetime
    gender: str

    # @validator('confirmPassword')
    # def passwords_match(cls, v, values, **kwargs):
    #     if 'password' in values and v != values['password']:
    #         raise ValueError('Passwords do not match')
    #     return v

    # @validator('dateOfBirth')
    # def dob_must_be_in_the_past(cls, v):
    #     if v >= datetime.now():
    #         raise ValueError('Date of Birth must be in the past')
    #     return v

class EmailData(BaseModel):
    email: EmailStr

router = APIRouter()

class Item(BaseModel):
    name: str
    description: str = None
    price: float
    image_url: str = None
    quantity: int = 1

class PurchaseItem(BaseModel):
    name: str
    quantity: int

class Purchase(BaseModel):
    email: EmailStr
    items: List[PurchaseItem]
    total_price: float

# Helper function to handle MongoDB ObjectId
def object_id_handler(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError

@router.get("/items")
async def get_items():
    items = list(db.items.find({}, {'_id': 0}))
    return jsonable_encoder(items, custom_encoder={ObjectId: object_id_handler})

@router.post("/items")
async def add_item(item: Item):
    db.items.insert_one(item.dict())
    return {"message": "Item added successfully"}

@app.post("/purchase")
async def make_purchase(purchase: Purchase):
    # Example logic to process each item by quantity
    for item in purchase.items:
        # Process item.name with item.quantity
        pass
    db.purchases.insert_one(purchase.dict())
    return {"message": "Purchase recorded successfully"}

app.include_router(router)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
@app.get("/")
async def root():
    return {"message": "Auth API. Please use POST /auth & POST /verify for authentication"}

@app.post("/auth")
async def authenticate_user(auth_data: AuthData):
    user = db.userInfo.find_one({"email": auth_data.email})
    if user and pwd_context.verify(auth_data.password, user["password"]):
        token_data = {"sub": auth_data.email}
        token = jwt.encode(token_data, JWT_SECRET_KEY, algorithm="HS256")
        return {"message": "success", "token": token}
    else:
        print("Authentication failed")
        return {"message": "fail"}, 401

@app.post("/verify")
async def verify_token(token: str = Header(None, alias='jwt-token')):
    if not token:
        return JSONResponse(status_code=400, content={"message": "Token missing"})
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        return {"status": "logged in", "message": "success"}
    except JWTError:
        return JSONResponse(status_code=401, content={"status": "invalid auth", "message": "error"})


@app.post("/check-account")
async def check_account(email_data: EmailData):
    try:
        user_exists = db.userInfo.find_one({"email": email_data.email}) is not None
        return {"userExists": user_exists}
    except Exception as e:
        print(f"Error in check-account: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/register")
async def register_user(reg_data: RegistrationData):
    try:
        if reg_data.password != reg_data.confirmPassword:
            return JSONResponse(status_code=400, content={"message": "Passwords do not match"})
        if db.userInfo.find_one({"email": reg_data.email}):
            return JSONResponse(status_code=400, content={"message": "Email already registered"})
        hashed_password = pwd_context.hash(reg_data.password)
        db.userInfo.insert_one({
            "email": reg_data.email,
            "password": hashed_password,
            "dateOfBirth": reg_data.dateOfBirth,
            "gender": reg_data.gender
        })
        token_data = {"sub": reg_data.email}
        token = jwt.encode(token_data, JWT_SECRET_KEY, algorithm="HS256")
        return {"message": "User registered successfully", "token": token}
    except Exception as e:
        print(f"Error in register: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("filename:app", host="0.0.0.0", port=8000, reload=True, debug=True)
