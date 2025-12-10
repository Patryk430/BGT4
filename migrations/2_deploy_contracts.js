var Subscription = artifacts.require("Subscription");

module.exports = function (deployer) {
  // Parameters for the Subscription contract
  price = web3.utils.toWei("0.01", "ether"); // 0.01 ETH
    billingPeriod = 86400 * 30; // 1 * 30 day in seconds

  // Deploy the Subscription contract
  deployer.deploy(Subscription, price, billingPeriod);
};