var Adoption = artifacts.require("Adoption");

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(Adoption);
};
  