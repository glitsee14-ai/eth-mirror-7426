require('dotenv').config();
const { ethers } = require('ethers');
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const REAL_TOKEN = '0x4f3Ae12B7f65ea3D8b5D1cC288C6354E8C4c5e3A';

(async () => {
  const logs = await provider.getLogs({
    address: REAL_TOKEN,
    fromBlock: 0,
    toBlock: 'latest',
    topics: [ethers.id('Transfer(address,address,uint256)
