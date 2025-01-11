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