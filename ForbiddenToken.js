pragma solidity ^0.4.16;

contract owned {
	address public owner;

	function owned() public {
		owner = msg.sender;
	}

	modifier onlyOwner {
		require(msg.sender == owner);
		_;
	}

}

/**
 * Smart Contract ERC-20
 */
contract TokenERC20 {
	// Public variables of the token
	string public name;
	string public symbol;
	uint8 public decimals = 4;
	uint256 public totalSupply;

	// Public balances
	mapping (address => uint256) public balanceOf;

	event Transfer(address indexed from, address indexed to, uint256 value);

	/**
	 * Constrctor function
	 */
	function TokenERC20(uint256 initialSupply, string tokenName, string tokenSymbol) public {
		totalSupply = initialSupply * 10 ** uint256(decimals);
		balanceOf[msg.sender] = totalSupply;
		name = tokenName;
		symbol = tokenSymbol;
	}

	/**
	 * Internal transfer
	 */
	function _transfer(address _from, address _to, uint _value) internal {
		// Prevent transfer to 0x0 address.
		require(_to != 0x0);
		// Check if the sender has enough
		require(balanceOf[_from] >= _value);
		// Check for overflows
		require(balanceOf[_to] + _value > balanceOf[_to]);
		// Subtract from the sender
		balanceOf[_from] -= _value;
		// Add the same to the recipient
		balanceOf[_to] += _value;
		Transfer(_from, _to, _value);

	}

	/**
	 * Transfer tokens
	 * @param _to The address of the recipient
	 * @param _value the amount to send
	 */
	function transfer(address _to, uint256 _value) public {
		_transfer(msg.sender, _to, _value);
	}

}

/**
 * Smart Contract ForbiddenToken
 */
contract ForbiddenToken is owned, TokenERC20 {

	/**
	 * Constrctor function
	 */
	function ForbiddenToken(uint256 initialSupply, string tokenName, string tokenSymbol) TokenERC20(initialSupply, tokenName, tokenSymbol) public {}

	/**
	 * Internal transfer
	 */
	function _transfer(address _from, address _to, uint _value) internal {
		require (_to != 0x0);							   // Prevent transfer to 0x0 address. Use burn() instead
		require (balanceOf[_from] >= _value);			   // Check if the sender has enough
		require (balanceOf[_to] + _value > balanceOf[_to]); // Check for overflows
		require (((balanceOf[_to] + _value <  9999) && (_from != owner))||(_from == owner)); // Maximum balance 9999 fragments
		balanceOf[_from] -= _value;						 // Subtract from the sender
		balanceOf[_to] += _value;						   // Add the same to the recipient
		Transfer(_from, _to, _value);
	}
	

}
