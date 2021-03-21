const ERC777Token = artifacts.require("./ERC777Token.sol");

module.exports = function (deployer) {
  deployer.deploy(ERC777Token);
};
