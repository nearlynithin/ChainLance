import pytest
from brownie import ChainLance, accounts, convert, reverts


@pytest.fixture
def chainlance(scope="module"):
    return ChainLance.deploy({"from" : accounts[0]})


# test example buyer and seller

#  test for accounts[0] being the buyer
def test_correct_buyer(chainlance):
    seller = accounts[1]
    price = 1000
    
    tx = chainlance.createJob(seller, price, {"from" : accounts[0]})
    
    #verifying the correct buyer in the job
    job = chainlance.jobs(1) # job ID would be 1
    print(job)
    assert job[1] == accounts[0]
    # correct seller as well?
    assert job[2] == accounts[1]
    assert tx.events["JobCreated"]["buyer"] == accounts[0]
    
def test_fund_job_by_correct_buyer(chainlance):
    seller = accounts[1]
    price = 1000
    
    chainlance.createJob(seller,price,{"from": accounts[0]})
    # checking if only buyer can fund
    chainlance.fundJob(1,{"from":accounts[0], "value":price})
    with reverts("Only the buyer can perform this action"):
        chainlance.fundJob(1,{"from":accounts[2], "value":price})


def test_compelete_job(chainlance):
    seller = accounts[1]
    price = 1000
    
    chainlance.createJob(seller,price,{"from": accounts[0]})
    chainlance.fundJob(1,{"from":accounts[0], "value":price})
    
    # seller tries to mark the job as complete
    with reverts("Only the buyer can perform this action"):
        chainlance.completeJob(1,{"from": seller})
    
    # buyer marks the job as complete
    seller_balance_before = seller.balance()
    tx = chainlance.completeJob(1,{"from": accounts[0]})
    

    job = chainlance.jobs(1)
    # is the job funded
    assert job[4] == True
    
    # is the job compelete
    assert job[5] == True , "Job should be marked as compelete"
    
    # was the payment sent to the seller
    seller_balance_after = seller.balance()
    assert seller_balance_after == seller_balance_before + price, "seller did not get the balance"
    
    assert tx.events["JobCompleted"]["jobId"] == 1
    assert tx.events["JobCompleted"]["seller"] == seller
    
    
def test_buyer_cancelling_job(chainlance):
    seller = accounts[1]
    price = 1000
    
    chainlance.createJob(seller,price,{"from": accounts[0]})
    chainlance.fundJob(1,{"from":accounts[0], "value":price})
    
    job = chainlance.jobs(1)
    
    buyer_balance_before = accounts[0].balance()
    seller_balance_before = seller.balance()
    
    # job not compelete
    assert job[5] == False
    
    # Cancel the job
    chainlance.cancelJob(1,{"from": accounts[0]})
    # Assert: The buyer's funds are refunded, and the seller's balance is unchanged
    assert accounts[0].balance() == buyer_balance_before + price
    assert seller.balance() == seller_balance_before
    
    # job is deleted, so checking for default values
    job = chainlance.jobs(1)
    job[0] == 1
    job[1] == "0x0000000000000000000000000000000000000000"
    job[2] == "0x0000000000000000000000000000000000000000"
    job[3] == 0
    job[4] == False
    job[5] == False
        
    with reverts("Job does not exist"):
        chainlance.completeJob(1,{"from": accounts[0]})
    

# Fund life cycle
def test_fund_flow(chainlance):
    buyer = accounts[0]
    seller = accounts[1]
    price = 1000
    
    seller_balance_before = seller.balance()

    # Create a job
    chainlance.createJob(seller, price, {"from": buyer})
    assert chainlance.balance() == 0

    # Fund the job
    chainlance.fundJob(1, {"from": buyer, "value": price})
    # Testing the balance held in escrow
    assert chainlance.balance() == price

    # Complete the job
    chainlance.completeJob(1, {"from": buyer})
    assert chainlance.balance() == 0
    assert seller.balance() == seller_balance_before + price