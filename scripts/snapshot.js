require('dotenv').config();
const { ethers } = require('ethers');
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// real PUMP-fun token on ETH mainnet (example – change if different)
const REAL_TOKEN = '0x4f3Ae12B7f65ea3D8b5D1cC288C6354E8C4c5e3A'; // <— put the checksummed address here

(async () =>
