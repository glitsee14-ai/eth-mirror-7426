require('dotenv').config();
const { ethers } = require('ethers');
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const abi = ['function transfer(address,uint256) external'];
const clone = new ethers.Contract(process.env.CLONE_TOKEN, abi, wallet);
const holders = require('../holders.json');
(async () => {
  for (const h of holders) {
    const tx = await clone.transfer(h, 1n * 10n ** 18n);
    console.log('Drop', h, tx.hash);
    await tx.wait();
  }
})();
