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
    assert tx.events["JobCreated"]["buyer"] == accounts[0]
    
    