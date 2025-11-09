const { ethers } = require('ethers');
const fs   = require('fs');
(async () => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const REAL     = '0x4f3Ae12B7f65ea3D8b5D1cC288C6354E8C4c5e3A';
  const logs     = await provider.getLogs({
    address: REAL,
    fromBlock: 0,
    toBlock: 'latest',
    topics: [ethers.id('Transfer(address,address,uint256)')]
  });
  const holders  = [...new Set(logs.map(l => ethers.getAddress('0x' + l.topics[2].slice(-40))))];
  fs.writeFileSync('holders.json', JSON.stringify(holders));
  console.log('Snap', holders.length);
})();
