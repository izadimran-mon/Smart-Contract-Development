//SPDX-License-Identifier: MIT
pragma solidity >= 0.5.0 < 0.7.0;

contract Adoption {
  address[16] public adopters;

  function getAdopters() public view returns(address[16] memory) {
    return adopters;
  }

  function adopt(uint petId) public returns(uint) {
    require(petId >= 0 && petId <= 15, "Pet Id is invalid");
    adopters[petId] = msg.sender;
    return petId;
  }
}
