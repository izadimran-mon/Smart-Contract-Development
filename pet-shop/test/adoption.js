const Adoption = artifacts.require("Adoption");

contract("Adoption", function() {
  describe('First group of tests', () => {
    let instance;
    var accounts;

    before(async () => {
      instance = await Adoption.deployed();
    });

    it('User should adopt a pet', async () => {
      accounts = await web3.eth.getAccounts();
      await instance.adopt.sendTransaction(8, {from: accounts[0]});
      let adopter = await instance.adopters.call(8);
      assert.equal(adopter, accounts[0], "Incorrect owner add");
    });

    it('Should get adopter address by pet id in array', async () => {
      accounts = await web3.eth.getAccounts();
      let adopters = await instance.getAdopters.call();
      assert.equal(adopters[8], accounts[0], "Owner of pet id should be recorded in the array");
    });

    it('Should throw if invalid pet id is given', async () => {
      accounts = await web3.eth.getAccounts();
      try {
        await instance.adopt.sendTransaction(17, {from: accounts[0]});
        assert.fail(true, false, "This function did not throw");
      }
      catch(error) {
        assert.include(String(error), "revert", `Expected "revert" but instead got ${error}`);
      }
    });
  });
});
