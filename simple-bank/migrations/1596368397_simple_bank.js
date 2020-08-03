var SimpleBankArtifact = artifacts.require("./SimpleBank.sol");

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(SimpleBankArtifact, {value: 6000000000000000000});
};
