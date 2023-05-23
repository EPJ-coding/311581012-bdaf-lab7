
const { ethers, network } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  // Set the contracts address
  const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const compoundAddress = "0xc3d688B66703497DAA19211EEdff47f25384cdc3";
  const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  // Set the signer address
  const signerAddress = "0xFcb19e6a322b27c06842A71e8c725399f049AE3a"; 
  await helpers.impersonateAccount(signerAddress);
  const ImpersonatedSigner = await ethers.getSigner(signerAddress);

  // Set the usdc contract abi, eth contract abi and compound contract abi
  const usdcABI = [
      "function balanceOf(address account) public view returns (uint256)",
      "function approve(address spender, uint256 amount) external returns (bool)",
  ];
  const usdcContract = new ethers.Contract(usdcAddress, usdcABI, ImpersonatedSigner);

  const wethABI = [
      "function balanceOf(address account) public view returns (uint256)",
      "function approve(address spender, uint256 amount) external returns (bool)",
  ];
  const wethContract = new ethers.Contract(wethAddress, wethABI, ImpersonatedSigner);

  const compoundABI = [
      "function balanceOf(address account) public view returns (uint256)",
      "function supply(address asset, uint amount) external",
      "function withdraw(address asset, uint amount) external"
  ];
  const compoundContract = new ethers.Contract(compoundAddress, compoundABI, ImpersonatedSigner);

  // Impersonate a address with lots of USDC as Alice
  const aliceAddress = "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503";
  await helpers.impersonateAccount(aliceAddress);
  const aliceImpersonatedSigner = await ethers.getSigner(aliceAddress);

  // Impersonate a address with lots of WETH as Bob
  const bobAddress = "0x741AA7CFB2c7bF2A1E7D4dA2e3Df6a56cA4131F3";
  await helpers.impersonateAccount(bobAddress);
  const bobImpersonatedSigner = await ethers.getSigner(bobAddress);


  // [Print] the USDC balance in the Compound USDC contract
  var compoundBalance = await usdcContract.balanceOf(compoundAddress)
  console.log("Initial USDC balance in the Compound: ",  ethers.utils.formatUnits(compoundBalance, 6) );

  // Alice provides liquidity (1000 USDC) into the Compound USDC contract
  await usdcContract.connect(aliceImpersonatedSigner).approve(compoundAddress, 1000 * 10 ** 6);
  await compoundContract.connect(aliceImpersonatedSigner).supply(usdcAddress, 1000 * 10 ** 6 );
  // [Print] the USDC balance in the Compound USDC contract
  compoundBalance = await usdcContract.balanceOf(compoundAddress);
  console.log('USDC Balance after Alice provide 1000 USDC:', ethers.utils.formatUnits(compoundBalance, 6) );

  // Bob performs some setup
  // Bob supply a huge amount of WETH to the Compound USDC contract
  const bobWethBalance = await wethContract.balanceOf(bobAddress);
  await wethContract.connect(bobImpersonatedSigner).approve(compoundAddress, bobWethBalance);
  await compoundContract.connect(bobImpersonatedSigner).supply(wethAddress, bobWethBalance);

  // Bob withdraw all of USDC in the Compound USDC contract
  await compoundContract.connect(bobImpersonatedSigner).withdraw(usdcAddress, compoundBalance);
  
  // [Print] the USDC balance in the Compound USDC contract
  compoundBalance = await usdcContract.balanceOf(compoundAddress);
  console.log('USDC Balance after Bob Withdraw all the USDC:', compoundBalance.toString());  
  
  // [Print] Alice tries to withdraw 1000 USDC, and gets a ERC20: transfer amount exceeds balance error
  console.log('When Alice tries to withdraw 1000 USDC, there is an error:');
  try{ await compoundContract.connect(aliceImpersonatedSigner).withdraw(usdcAddress, 1000 * 10 ** 6 ); }
  catch(e){ console.error( e.message.substr(150, 113)) } // Catch the main error here, while the message also has a "can't not estimate gas error"
  

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

