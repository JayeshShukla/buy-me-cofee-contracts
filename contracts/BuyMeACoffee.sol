//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// Example deployed to Sepolia: 0x6bC0b90706dD4D0fc5e09FBD2D9ecC8b7B766323

contract BuyMeACoffee {
    // Event to emit when a Memo is created.
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        uint256 amount,
        string name,
        string message
    );

    // Memo struct.
    struct Memo {
        address from;
        uint256 timestamp;
        uint256 amount;
        string name;
        string message;
    }

    // Address of contract deployer. Marked payable so that
    // we can withdraw to this address later.
    address payable public owner; // 0x3c00EC531911aC1080E7d423de85c62c4B462113

    // List of all memos received from coffee purchases.
    Memo[] memos;

    constructor() {
        // Store the address of the deployer as a payable address.
        // When we withdraw funds, we'll withdraw here.
        owner = payable(msg.sender);
    }

    /**
     * @dev fetches all stored memos
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    /**
     * @dev buy a coffee for owner (sends an ETH tip and leaves a memo)
     * @param _name name of the coffee purchaser
     * @param _message a nice message from the purchaser
     */
    function buyCoffee(
        string memory _name,
        string memory _message
    ) public payable {
        // Must accept more than 0 ETH for a coffee.
        require(msg.value > 0, "can't buy coffee for free!");

        // Add the memo to storage!
        memos.push(
            Memo(msg.sender, block.timestamp, msg.value, _name, _message)
        );

        // Emit a NewMemo event with details about the memo.
        emit NewMemo(msg.sender, block.timestamp, msg.value, _name, _message);
    }

    /**
     * @dev send the entire balance stored in this contract to the owner
     */
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    // handing over the ownership to someone else
    function handoverOwnership(address new_owner) public {
        require(
            msg.sender == owner,
            "You are not authorized to perform the following action!"
        );
        owner = payable(new_owner);
    }
}
