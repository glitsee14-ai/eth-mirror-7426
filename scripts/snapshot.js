require('dotenv').config();
const { ethers } = require('ethers');
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const real = '0xHqVZaYJnEcmKQKRf4K5N8eEuBjkTgpRzVfF7AYBFpump'; // checksum it
(async () => {
  const logs = await provider.getLogs({
    fromBlock: 0,
    toBlock: 'latest',
    address: real,
    topics: [ethers.id('Transfer(address,address,uint256)')]
  });
  const holders = [...new Set(logs.map(l => '0x' + l.topics[2].slice(26)))];
  require('fs').writeFileSync('holders.json', JSON.stringify(holders));
  console.log('Snap', holders.length);
})();
