from brownie import ChainLance, accounts

def main():
    admin = accounts[0]
    cl = ChainLance.deploy({"from" : admin })
    print(cl)