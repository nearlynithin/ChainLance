from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from datetime import datetime
from brownie import network, Contract
import json
import uvicorn

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    conn = sqlite3.connect('chainlance.db')
    conn.row_factory = sqlite3.Row
    return conn

# Check if we're already connected to a network
try:
    if not network.is_connected():
        network.connect("development")
except:
    network.connect("development")

# Load the ABI from the JSON file
with open('build/contracts/ChainLance.json', 'r') as file:
    contract_json = json.load(file)
    CONTRACT_ABI = contract_json['abi']

CHAINLANCE_CONTRACT_ADDRESS = "0x3194cBDC3dbcd3E11a07892e7bA5c3394048Cc87"
chainlance = Contract.from_abi("ChainLance", CHAINLANCE_CONTRACT_ADDRESS, CONTRACT_ABI)

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.executescript('''
        CREATE TABLE IF NOT EXISTS sellers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            seller_id TEXT UNIQUE NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS shops (
            shop_id INTEGER PRIMARY KEY AUTOINCREMENT,
            seller_id TEXT NOT NULL,
            shop_name TEXT NOT NULL,
            FOREIGN KEY (seller_id) REFERENCES sellers(seller_id)
        );
        
        CREATE TABLE IF NOT EXISTS orders (
            order_id INTEGER PRIMARY KEY AUTOINCREMENT,
            seller_id TEXT NOT NULL,
            buyer_id TEXT NOT NULL,
            price REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            shop_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (seller_id) REFERENCES sellers(seller_id),
            FOREIGN KEY (shop_id) REFERENCES shops(shop_id)
        );
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Blockchain endpoints
@app.post("/api/createjob")
async def create_job(seller_address: str, buyer_address: str, price: float, shop_id: int):
    try:
        # Create job on blockchain
        tx = chainlance.createJob(
            seller_address,
            int(price * 10**18),
            {"from": buyer_address}
        )
        
        # Store in SQLite
        conn = get_db()
        cursor = conn.cursor()
        
        # Ensure seller exists
        cursor.execute("INSERT OR IGNORE INTO sellers (seller_id) VALUES (?)", 
                      (seller_address,))
        
        # Create order
        cursor.execute("""
            INSERT INTO orders (seller_id, buyer_id, price, shop_id, status)
            VALUES (?, ?, ?, ?, ?)
        """, (seller_address, buyer_address, price, shop_id, 'pending'))
        
        conn.commit()
        order_id = cursor.lastrowid
        conn.close()
        
        return JSONResponse(content={
            "message": "Job created successfully",
            "transaction_hash": tx.txid,
            "order_id": order_id
        })
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/fundjob/{job_id}")
async def fund_job(job_id: int, buyer_address: str):
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Get order details
        cursor.execute("SELECT price FROM orders WHERE order_id = ?", (job_id,))
        order = cursor.fetchone()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Fund job on blockchain
        tx = chainlance.fundJob(
            job_id,
            {"from": buyer_address, "value": int(order['price'] * 10**18)}
        )
        
        # Update order status
        cursor.execute("UPDATE orders SET status = 'funded' WHERE order_id = ?", 
                      (job_id,))
        conn.commit()
        conn.close()
        
        return JSONResponse(content={
            "message": "Job funded successfully",
            "transaction_hash": tx.txid
        })
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Shop management endpoints
@app.get("/api/seller/{seller_id}/shops")
async def get_seller_shops(seller_id: str):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT shop_id, shop_name 
            FROM shops 
            WHERE seller_id = ?
        """, (seller_id,))
        shops = cursor.fetchall()
        conn.close()
        
        return {"seller_id": seller_id, 
                "shops": [dict(shop) for shop in shops]}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/seller/shop")
async def create_shop(seller_id: str, shop_name: str):
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Ensure seller exists
        cursor.execute("INSERT OR IGNORE INTO sellers (seller_id) VALUES (?)", 
                      (seller_id,))
        
        # Create shop
        cursor.execute("""
            INSERT INTO shops (seller_id, shop_name)
            VALUES (?, ?)
        """, (seller_id, shop_name))
        
        shop_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "message": "Shop created successfully",
            "shop_id": shop_id,
            "seller_id": seller_id,
            "shop_name": shop_name
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/seller/{seller_id}/orders")
async def get_seller_orders(seller_id: str):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT o.*, s.shop_name 
            FROM orders o 
            LEFT JOIN shops s ON o.shop_id = s.shop_id 
            WHERE o.seller_id = ?
        """, (seller_id,))
        orders = cursor.fetchall()
        conn.close()
        
        return {
            "seller_id": seller_id,
            "orders": [dict(order) for order in orders]
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/buyer/{buyer_id}/orders")
async def get_buyer_orders(buyer_id: str):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT o.*, s.shop_name 
            FROM orders o 
            LEFT JOIN shops s ON o.shop_id = s.shop_id 
            WHERE o.buyer_id = ?
        """, (buyer_id,))
        orders = cursor.fetchall()
        conn.close()
        
        return {
            "buyer_id": buyer_id,
            "orders": [dict(order) for order in orders]
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/order/{order_id}/complete")
async def complete_order(order_id: int, buyer_address: str):
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Check if order exists and is funded
        cursor.execute("SELECT * FROM orders WHERE order_id = ?", (order_id,))
        order = cursor.fetchone()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Complete job on blockchain
        tx = chainlance.completeJob(
            order_id,
            {"from": buyer_address}
        )
        
        # Update order status
        cursor.execute("UPDATE orders SET status = 'completed' WHERE order_id = ?", 
                      (order_id,))
        conn.commit()
        conn.close()
        
        return JSONResponse(content={
            "message": "Order completed successfully",
            "transaction_hash": tx.txid
        })
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# to see all available shops
@app.get("/api/shops")
async def get_all_shops():
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Fetch all shops with their details
        cursor.execute("""
            SELECT shop_id, shop_name, seller_id 
            FROM shops
        """)
        shops = cursor.fetchall()
        conn.close()
        
        # Convert rows to a list of dictionaries
        return {
            "shops": [dict(shop) for shop in shops]
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))



if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)