pragma solidity ^0.5.0;

// every user has an instance of this
// contract deployed to their wallet
contract Trust {
  address public creator;
  address payable public heir;
  string public usState;
  uint public transferDate;
  bool public funded;

  modifier onlyCreator() {
    require(
      msg.sender == creator,
      "Only creator can call this method"
    );
    _;
  }

  constructor() public {
    creator = msg.sender;
  }

  // only the creator can set the contract terms once
  function initContract(
    address payable _heir,
    string memory _usState,
    uint _transferDate
  ) onlyCreator public {
    require (heir == address(0), "Already initialized");
    heir = _heir;
    usState = _usState;
    transferDate = _transferDate;
    funded = false;
  }

  // only the creator can fund the account
  function fund() onlyCreator external payable {
    funded = true;
  }

  // although this is meant for a trustee to invoke
  // anyone can attempt transfer because
  // the condition of transfer is very clear
  function attemptTransfer() public {
    require(
      funded && block.timestamp > transferDate,
      "Not yet!"
    );
    heir.transfer(address(this).balance);
  }
}
