const SimpleBank = artifacts.require("SimpleBank");

const ether = 10**18; // javascript doesnt have ether, hence declare value of ether in wei
const rewardForFirstThreeAcc = 1*ether;
const initialDeposit = 6*ether;

web3.eth.getAccounts().then((accounts) => {
  console.log(accounts);
});

contract("SimpleBank initialisation", (accounts) => {
  const a = accounts[1];
  const b = accounts[2];
  const c = accounts[3];
  const d = accounts[4];

  it("should reward first 3 customers with 10 ether", async () => {
    const bank = await SimpleBank.deployed();

    await bank.enroll({from: a});
    const aBalance = await bank.balance({from: a});
    assert.equal(aBalance, rewardForFirstThreeAcc, "a: Initial balance is incorrect");
    
    await bank.enroll({from: b});
    const bBalance = await bank.balance({from: b});
    assert.equal(bBalance, rewardForFirstThreeAcc, "b: Initial balance is incorrect");
    
    await bank.enroll({from: c});
    const cBalance = await bank.balance({from: c});
    assert.equal(cBalance, rewardForFirstThreeAcc, "c: Initial balance is incorrect");
    
    await bank.enroll({from: d});
    const dBalance = await bank.balance({from: d});
    assert.equal(dBalance, 0, "d: Initial balance is incorrect");

    const depositsBalance = await bank.depositsBalance();
    assert.equal(depositsBalance, initialDeposit, "Initial balance is incorrect");
  });

  it("should deposit the correct amount", async () => {
    const bank = await SimpleBank.deployed();
    const deposit = 2*ether;

    let receipt = await bank.deposit({from: a, value: web3.utils.toBN(deposit)});
    const balance = await bank.balance({from: a});
    assert.equal(balance, rewardForFirstThreeAcc + deposit, "Failed to deposit into account");

    let depositsBalance = await bank.depositsBalance();
    assert.equal(depositsBalance, initialDeposit + deposit, "Bank deposits balance should be increased");

    const expectedEventResult = {accountAddress: a, amount: deposit};
    // console.log("Receipt: ", receipt.logs);
    assert.equal(receipt.logs[0].args.accountAddress, expectedEventResult.accountAddress, "LogDepositMade event accountAddress property not emitted");
    assert.equal(receipt.logs[0].args.amount, expectedEventResult.amount, "LogDepositMade event amount property not emitted");
  });
});

contract("SimpleBank - withdrawal test", async (accounts) => {
  const a = accounts[1];

  it("should withdraw correct amount", async () => {
    const bank = await SimpleBank.deployed();
    const deposit = 5*ether;

    await bank.deposit({from: a, value: web3.utils.toBN(deposit)});
    await bank.withdraw(web3.utils.toBN(deposit), {from: a});

    const balance = await bank.balance({from: a});
    assert.equal(balance, deposit - deposit, "Withdraw amount incorrect");
  });
});


