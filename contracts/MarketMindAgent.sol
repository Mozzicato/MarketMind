// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MarketMindAgent
 * @notice ERC-8004 compliant AI agent wallet for informal vendors
 * @dev Core agent wallet with autonomous business logic capabilities
 */
contract MarketMindAgent is Ownable, ReentrancyGuard {
    // Transaction types
    enum TransactionType {
        CUSTOMER_PAYMENT,
        SUPPLIER_PAYMENT,
        LOAN_DISBURSEMENT,
        LOAN_REPAYMENT,
        WITHDRAWAL
    }

    // Transaction structure
    struct Transaction {
        uint256 id;
        uint256 amount;
        address counterparty;
        TransactionType txType;
        uint256 timestamp;
        string description;
    }

    // Inventory item structure
    struct Inventory {
        string item;
        uint256 quantity;
        uint256 costBasis; // Cost per unit in wei
        uint256 lastUpdated;
    }

    // State variables
    address public vendor; // The human vendor who owns this agent
    address public agentId; // Self Protocol identity
    address public creditScoringContract;
    
    uint256 public creditScore;
    uint256 public totalRevenue;
    uint256 public totalCosts;
    uint256 public transactionCount;
    
    mapping(uint256 => Transaction) public transactions;
    mapping(string => Inventory) public inventory;
    string[] public inventoryItems;
    
    // Events
    event PaymentReceived(address indexed from, uint256 amount, uint256 transactionId);
    event SupplierPaid(address indexed supplier, uint256 amount, string item, uint256 transactionId);
    event SaleRecorded(string item, uint256 quantity, uint256 price, uint256 transactionId);
    event InventoryUpdated(string item, uint256 quantity, uint256 costBasis);
    event CreditScoreUpdated(uint256 newScore);
    event Withdrawal(address indexed to, uint256 amount);
    
    /**
     * @notice Initialize the MarketMind agent
     * @param _vendor Address of the vendor who owns this agent
     * @param _agentId Self Protocol identity address
     */
    constructor(address _vendor, address _agentId) Ownable(_vendor) {
        require(_vendor != address(0), "Invalid vendor address");
        vendor = _vendor;
        agentId = _agentId;
        creditScore = 300; // Starting credit score (like FICO)
    }
    
    /**
     * @notice Accept payment from a customer
     * @dev Receives cUSD/USDC payment and records transaction
     */
    function acceptPayment(address customer, string memory description) 
        external 
        payable 
        nonReentrant 
    {
        require(msg.value > 0, "Payment must be greater than 0");
        require(customer != address(0), "Invalid customer address");
        
        uint256 txId = transactionCount++;
        
        transactions[txId] = Transaction({
            id: txId,
            amount: msg.value,
            counterparty: customer,
            txType: TransactionType.CUSTOMER_PAYMENT,
            timestamp: block.timestamp,
            description: description
        });
        
        totalRevenue += msg.value;
        
        emit PaymentReceived(customer, msg.value, txId);
    }
    
    /**
     * @notice Pay a supplier (agent-initiated, vendor must approve)
     * @param supplier Address of the supplier
     * @param amount Amount to pay in wei
     * @param item Item being purchased
     */
    function paySupplier(
        address payable supplier,
        uint256 amount,
        string memory item,
        uint256 quantity
    ) external onlyOwner nonReentrant {
        require(supplier != address(0), "Invalid supplier address");
        require(amount > 0, "Amount must be greater than 0");
        require(address(this).balance >= amount, "Insufficient balance");
        
        uint256 txId = transactionCount++;
        
        transactions[txId] = Transaction({
            id: txId,
            amount: amount,
            counterparty: supplier,
            txType: TransactionType.SUPPLIER_PAYMENT,
            timestamp: block.timestamp,
            description: string(abi.encodePacked("Purchased ", item))
        });
        
        totalCosts += amount;
        
        // Update inventory
        _updateInventory(item, quantity, amount / quantity);
        
        // Transfer funds to supplier
        (bool success, ) = supplier.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit SupplierPaid(supplier, amount, item, txId);
    }
    
    /**
     * @notice Record a sale and update inventory
     * @param item Item sold
     * @param quantity Quantity sold
     * @param price Total sale price in wei
     */
    function recordSale(
        string memory item,
        uint256 quantity,
        uint256 price
    ) external onlyOwner {
        require(quantity > 0, "Quantity must be greater than 0");
        require(bytes(inventory[item].item).length > 0, "Item not in inventory");
        require(inventory[item].quantity >= quantity, "Insufficient inventory");
        
        uint256 txId = transactionCount++;
        
        transactions[txId] = Transaction({
            id: txId,
            amount: price,
            counterparty: address(0), // Cash sale
            txType: TransactionType.CUSTOMER_PAYMENT,
            timestamp: block.timestamp,
            description: string(abi.encodePacked("Sold ", item))
        });
        
        // Update inventory
        inventory[item].quantity -= quantity;
        inventory[item].lastUpdated = block.timestamp;
        
        totalRevenue += price;
        
        emit SaleRecorded(item, quantity, price, txId);
    }
    
    /**
     * @notice Internal function to update inventory
     */
    function _updateInventory(
        string memory item,
        uint256 quantity,
        uint256 costBasis
    ) internal {
        if (bytes(inventory[item].item).length == 0) {
            // New item
            inventoryItems.push(item);
            inventory[item] = Inventory({
                item: item,
                quantity: quantity,
                costBasis: costBasis,
                lastUpdated: block.timestamp
            });
        } else {
            // Existing item - add to quantity
            inventory[item].quantity += quantity;
            inventory[item].costBasis = costBasis; // Update cost basis
            inventory[item].lastUpdated = block.timestamp;
        }
        
        emit InventoryUpdated(item, inventory[item].quantity, costBasis);
    }
    
    /**
     * @notice Update credit score (called by CreditScoring contract)
     * @param newScore New credit score value
     */
    function updateCreditScore(uint256 newScore) external {
        require(msg.sender == creditScoringContract || msg.sender == owner(), 
            "Only credit scoring contract can update score");
        require(newScore >= 300 && newScore <= 850, "Score must be between 300-850");
        
        creditScore = newScore;
        emit CreditScoreUpdated(newScore);
    }
    
    /**
     * @notice Set the credit scoring contract address
     */
    function setCreditScoringContract(address _creditScoringContract) external onlyOwner {
        require(_creditScoringContract != address(0), "Invalid address");
        creditScoringContract = _creditScoringContract;
    }
    
    /**
     * @notice Get transaction details
     */
    function getTransaction(uint256 txId) external view returns (Transaction memory) {
        require(txId < transactionCount, "Transaction does not exist");
        return transactions[txId];
    }
    
    /**
     * @notice Get inventory for an item
     */
    function getInventory(string memory item) external view returns (Inventory memory) {
        return inventory[item];
    }
    
    /**
     * @notice Get all inventory items
     */
    function getAllInventoryItems() external view returns (string[] memory) {
        return inventoryItems;
    }
    
    /**
     * @notice Get profit margin (percentage)
     */
    function getProfitMargin() public view returns (uint256) {
        if (totalRevenue == 0) return 0;
        if (totalRevenue <= totalCosts) return 0;
        return ((totalRevenue - totalCosts) * 100) / totalRevenue;
    }
    
    /**
     * @notice Get current balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @notice Vendor can withdraw funds
     */
    function withdraw(uint256 amount) external onlyOwner nonReentrant {
        require(amount <= address(this).balance, "Insufficient balance");
        
        uint256 txId = transactionCount++;
        
        transactions[txId] = Transaction({
            id: txId,
            amount: amount,
            counterparty: vendor,
            txType: TransactionType.WITHDRAWAL,
            timestamp: block.timestamp,
            description: "Withdrawal to vendor"
        });
        
        payable(vendor).transfer(amount);
        
        emit Withdrawal(vendor, amount);
    }
    
    /**
     * @notice Fallback function to receive payments
     */
    receive() external payable {
        // Accept payments
    }
}
