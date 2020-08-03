//SPDX-License-Identifier: MIT
pragma solidity >= 0.5.0 < 0.7.0;

contract SimpleBank {
  address public owner;
  mapping (address => uint) private balances;
  uint numberOfClients;

  event LogDepositMade(address indexed accountAddress, uint amount);

  constructor() public payable { //need to be able to pay the contract with the initial 30 ether
    require(msg.value >= 3 ether, "Insufficient initial funding required");
    numberOfClients = 0;
    owner = msg.sender;
  }

  function enroll() public returns(uint) {
    if (numberOfClients < 3) {
      balances[msg.sender] = 1 ether;
      numberOfClients++;
    }
    return balances[msg.sender];
  }

  function deposit() public payable returns(uint) {
    require(msg.value > 0, "Deposit must be greater than 0");
    balances[msg.sender] += msg.value;
    emit LogDepositMade(msg.sender, msg.value);
    return balances[msg.sender];
  }

  function withdraw(uint withdrawAmount) public returns(uint) {
    require(withdrawAmount <= balances[msg.sender], "Insufficient balance to withdraw!");
    balances[msg.sender] -= withdrawAmount;
    msg.sender.transfer(withdrawAmount);
    return balances[msg.sender];
  }

  function balance() public view returns (uint) {
    return balances[msg.sender];
  }

  function depositsBalance() public view returns (uint) {
    return address(this).balance;
  }
}
