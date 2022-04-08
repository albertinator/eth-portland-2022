pragma solidity ^0.5.0;

// every user will have an instance of this contract deployed to their wallet address in the custody of the service
contract Trust {
  address public creator;
  address payable public heir;
  string public usState;
  uint public transferDate;
  bool public funded;

  modifier onlyCreator() {
    require(msg.sender == creator, "Only creator can call this method");
    _;
  }

  function initContract(
    address payable _heir,
    string memory _usState,
    uint _transferDate
  ) public {
    require (creator == address(0), "Already initialized");
    creator = msg.sender;
    heir = _heir;
    usState = _usState;
    transferDate = _transferDate;
    funded = false;
  }

  // creator can fund once
  function fund() onlyCreator external payable {
    require(!funded, "Already funded");
    funded = true;
  }

  // although this is meant for a trustee to invoke
  // anyone can attempt transfer since the condition of transfer is pretty clear
  function attemptTransfer() public {
    require(block.timestamp > transferDate, "Not yet!");
    heir.transfer(address(this).balance);
  }
}
