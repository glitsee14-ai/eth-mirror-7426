const axios = require('axios');
const ethers = require('ethers');

const CLONE = process.env.CLONE;
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY;
const NAME = process.env.NAME;
const SYMBOL = process.env.SYMBOL;
const ICON = process.env.ICON; // IPFS or HTTPS

async function submit() {
  const params = new URLSearchParams({
    apikey: ETHERSCAN_KEY,
    module: "token",
    action: "updatetokeninfo",
    contractaddress: CLONE,
    name: NAME,
    symbol: SYMBOL,
    decimals: "18",
    website: "https://pump-fun.com",
    telegram: "https://t.me/pumpportal",
    twitter: "https://twitter.com/pumpfun",
    icon: ICON
  });
  await axios.post("https://api.etherscan.io/api", params);
  console.log("Etherscan token info submitted");
}
submit().catch(console.error);
