const CardsMarket = artifacts.require("./CardsMarket.sol");

module.exports = function (deployer) {
  deployer.deploy(CardsMarket);
};
