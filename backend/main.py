from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from brownie import network, Contract
import json
import uvicorn

app = FastAPI()

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

CHAINLANCE_CONTRACT_ADDRESS = "0x613b0D485c21E7c3972a4c75E8774EE7eC2Ce251"

# Initialize the contract using the loaded ABI
chainlance = Contract.from_abi("ChainLance", CHAINLANCE_CONTRACT_ADDRESS, CONTRACT_ABI)

@app.get("/api/test/")
async def test(name: str):
    try:
        return "Hello " + name
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/createjob/")
async def createJob(buyer_address: str, seller_address: str, price: float):
    try:
        chainlance.createJob(seller_address, price, {"from": buyer_address})
        price_in_wei = int(price * 10**18)
        return JSONResponse(content={
            "buyer_address": buyer_address,
            "seller_address": seller_address,
            "price": price_in_wei
        })
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)