# 311581012-bdaf-lab7
On block number 17228670, [Compound USDC contract](https://etherscan.io/address/0xc3d688B66703497DAA19211EEdff47f25384cdc3#readProxyContract) roughly has 458k in Liquidity.

Write a test script that simulates two actors that do the following actions:

- Alice provides liquidity (1000 USDC) into the Compound USDC contract
- Bob borrows out all the liquidity from Compound USDC contract.
    - Bob supplies a huge amount of WETH to the Compound USDC contract
    - Bob withdraws all of USDC in the Compound USDC contract
- Alice tries to withdraw, what happens here?
    - Alice gets a error " ERC20: transfer amount exceeds balance "
- 
# Implement
## Install
With [npm](https://npmjs.org/) installed, run

    npm install 
    
## Create a .env file and set your personal key
  set your MAINNET_RPC_URL

    MAINNET_RPC_URL = ""
    

## Run
    npx hardhat run --network hardhat scripts/test.js  

## Result
![image]([picture or gif url](https://github.com/EPJ-coding/311581012-bdaf-lab7/blob/main/pictures/pic.jpg))
