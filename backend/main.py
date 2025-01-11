from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from brownie import network, ChainLance
import uvicorn
app = FastAPI()


network.connect("development")

CHAINLANCE_CONTACT_ADDRESS = "0xFccF2789c98291c5eD50B476D6Ec2f2Ef319208d" # example
chainlance = ChainLance.at(CHAINLANCE_CONTACT_ADDRESS)

@app.get("/api/test/")
async def test(name : str):
    try:
        return "Hello "+name

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/createjob/")
async def createJob(buyer_address:str, seller_address: str, price: float):
    try:
        
        chainlance.createJob(seller_address,price,{"from": buyer_address})
        price_in_wei = int(price * 10**18)
        return JSONResponse(content={"buyer_address":buyer_address,  "seller_address": seller_address, "price": price_in_wei})
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
