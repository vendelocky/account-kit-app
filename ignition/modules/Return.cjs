const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ReturnModule", (m) => {
    const token = m.contract("ReturnToken");
    const NFT = m.contract("ReturnNFT");
    return { token, NFT };
});