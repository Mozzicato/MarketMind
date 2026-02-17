// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MarketMindAgent.sol";
import "./CreditScoring.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MicroLending
 * @notice Micro-lending protocol for MarketMind agents based on credit scores
 * @dev Provides loans to vendors based on their onchain credit reputation
 */
contract MicroLending is Ownable, ReentrancyGuard {
    CreditScoring public creditScoringContract;
    
    struct LoanTerms {
        uint256 maxAmount;       // Maximum loan amount in wei
        uint256 interestRate;    // Annual interest rate (basis points, e.g., 800 = 8%)
        uint256 duration;        // Loan duration in days
    }
    
    struct Loan {
        uint256 id;
        address borrower;        // MarketMind agent address
        uint256 principal;       // Original loan amount
        uint256 interestRate;    // Annual interest rate (basis points)
        uint256 duration;        // Loan duration in days
        uint256 disbursedAt;     // Timestamp when loan was disbursed
        uint256 dueDate;         // Timestamp when loan is due
        uint256 remainingBalance; // Principal + interest - repayments
        bool isActive;
        bool isDefaulted;
    }
    
    // Loan eligibility tiers based on credit score
    uint256 constant TIER_1_MIN_SCORE = 300;  // Poor
    uint256 constant TIER_2_MIN_SCORE = 580;  // Fair
    uint256 constant TIER_3_MIN_SCORE = 670;  // Good
    uint256 constant TIER_4_MIN_SCORE = 740;  // Very Good
    uint256 constant TIER_5_MIN_SCORE = 800;  // Excellent
    
    // Loan limits per tier (in wei, assuming 18 decimals for cUSD)
    uint256 constant TIER_1_MAX_LOAN = 100 ether;   // 100 cUSD
    uint256 constant TIER_2_MAX_LOAN = 300 ether;   // 300 cUSD
    uint256 constant TIER_3_MAX_LOAN = 500 ether;   // 500 cUSD
    uint256 constant TIER_4_MAX_LOAN = 1000 ether;  // 1000 cUSD
    uint256 constant TIER_5_MAX_LOAN = 2000 ether;  // 2000 cUSD
    
    // Interest rates per tier (basis points: 100 = 1%)
    uint256 constant TIER_1_INTEREST = 1500;  // 15% APR
    uint256 constant TIER_2_INTEREST = 1200;  // 12% APR
    uint256 constant TIER_3_INTEREST = 1000;  // 10% APR
    uint256 constant TIER_4_INTEREST = 800;   // 8% APR
    uint256 constant TIER_5_INTEREST = 600;   // 6% APR
    
    // Default loan duration in days
    uint256 constant DEFAULT_LOAN_DURATION = 90; // 3 months
    
    uint256 public loanIdCounter;
    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public agentLoans; // agent => loan IDs
    mapping(address => bool) public hasActiveLoan;
    
    // Total lending pool balance
    uint256 public lendingPoolBalance;
    
    // Events
    event LoanDisbursed(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        uint256 interestRate,
        uint256 duration
    );
    event LoanRepaid(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        uint256 remainingBalance
    );
    event LoanDefaulted(uint256 indexed loanId, address indexed borrower);
    event PoolFunded(address indexed funder, uint256 amount);
    
    constructor(address _creditScoringContract) Ownable(msg.sender) {
        require(_creditScoringContract != address(0), "Invalid credit scoring contract");
        creditScoringContract = CreditScoring(_creditScoringContract);
    }
    
    /**
     * @notice Fund the lending pool
     */
    function fundPool() external payable onlyOwner {
        require(msg.value > 0, "Must send funds");
        lendingPoolBalance += msg.value;
        emit PoolFunded(msg.sender, msg.value);
    }
    
    /**
     * @notice Check loan eligibility for an agent
     * @param agentAddress Address of the MarketMind agent
     * @return eligible Whether the agent is eligible
     * @return terms Loan terms if eligible
     */
    function checkEligibility(address agentAddress) 
        external 
        view 
        returns (bool eligible, LoanTerms memory terms) 
    {
        // Check if agent already has an active loan
        if (hasActiveLoan[agentAddress]) {
            return (false, LoanTerms(0, 0, 0));
        }
        
        // Get credit score
        MarketMindAgent agent = MarketMindAgent(payable(agentAddress));
        uint256 creditScore = agent.creditScore();
        
        // Determine loan terms based on credit score
        if (creditScore >= TIER_5_MIN_SCORE) {
            terms = LoanTerms(TIER_5_MAX_LOAN, TIER_5_INTEREST, DEFAULT_LOAN_DURATION);
            eligible = true;
        } else if (creditScore >= TIER_4_MIN_SCORE) {
            terms = LoanTerms(TIER_4_MAX_LOAN, TIER_4_INTEREST, DEFAULT_LOAN_DURATION);
            eligible = true;
        } else if (creditScore >= TIER_3_MIN_SCORE) {
            terms = LoanTerms(TIER_3_MAX_LOAN, TIER_3_INTEREST, DEFAULT_LOAN_DURATION);
            eligible = true;
        } else if (creditScore >= TIER_2_MIN_SCORE) {
            terms = LoanTerms(TIER_2_MAX_LOAN, TIER_2_INTEREST, DEFAULT_LOAN_DURATION);
            eligible = true;
        } else if (creditScore >= TIER_1_MIN_SCORE) {
            terms = LoanTerms(TIER_1_MAX_LOAN, TIER_1_INTEREST, DEFAULT_LOAN_DURATION);
            eligible = true;
        } else {
            return (false, LoanTerms(0, 0, 0));
        }
        
        // Check if lending pool has sufficient funds
        if (lendingPoolBalance < terms.maxAmount) {
            eligible = false;
        }
        
        return (eligible, terms);
    }
    
    /**
     * @notice Request a loan
     * @param amount Requested loan amount
     */
    function requestLoan(uint256 amount) external nonReentrant {
        address agentAddress = msg.sender;
        
        // Check eligibility
        (bool eligible, LoanTerms memory terms) = this.checkEligibility(agentAddress);
        require(eligible, "Not eligible for loan");
        require(amount > 0 && amount <= terms.maxAmount, "Invalid loan amount");
        require(lendingPoolBalance >= amount, "Insufficient pool balance");
        
        // Create loan
        uint256 loanId = loanIdCounter++;
        uint256 dueDate = block.timestamp + (terms.duration * 1 days);
        
        // Calculate total amount due (principal + interest)
        uint256 interest = (amount * terms.interestRate * terms.duration) / (365 * 10000);
        uint256 totalDue = amount + interest;
        
        loans[loanId] = Loan({
            id: loanId,
            borrower: agentAddress,
            principal: amount,
            interestRate: terms.interestRate,
            duration: terms.duration,
            disbursedAt: block.timestamp,
            dueDate: dueDate,
            remainingBalance: totalDue,
            isActive: true,
            isDefaulted: false
        });
        
        agentLoans[agentAddress].push(loanId);
        hasActiveLoan[agentAddress] = true;
        lendingPoolBalance -= amount;
        
        // Disburse loan to agent
        (bool success, ) = agentAddress.call{value: amount}("");
        require(success, "Loan disbursement failed");
        
        emit LoanDisbursed(loanId, agentAddress, amount, terms.interestRate, terms.duration);
    }
    
    /**
     * @notice Repay loan (can be called by agent for auto-repayment)
     * @param loanId ID of the loan to repay
     */
    function repayLoan(uint256 loanId) external payable nonReentrant {
        Loan storage loan = loans[loanId];
        
        require(loan.isActive, "Loan is not active");
        require(!loan.isDefaulted, "Loan is defaulted");
        require(msg.value > 0, "Repayment amount must be greater than 0");
        
        uint256 repaymentAmount = msg.value;
        
        if (repaymentAmount >= loan.remainingBalance) {
            // Full repayment
            uint256 excess = repaymentAmount - loan.remainingBalance;
            repaymentAmount = loan.remainingBalance;
            loan.remainingBalance = 0;
            loan.isActive = false;
            hasActiveLoan[loan.borrower] = false;
            
            // Return excess if any
            if (excess > 0) {
                (bool success, ) = msg.sender.call{value: excess}("");
                require(success, "Excess refund failed");
            }
        } else {
            // Partial repayment
            loan.remainingBalance -= repaymentAmount;
        }
        
        lendingPoolBalance += repaymentAmount;
        
        emit LoanRepaid(loanId, loan.borrower, repaymentAmount, loan.remainingBalance);
    }
    
    /**
     * @notice Mark loan as defaulted (admin only)
     */
    function markAsDefaulted(uint256 loanId) external onlyOwner {
        Loan storage loan = loans[loanId];
        
        require(loan.isActive, "Loan is not active");
        require(block.timestamp > loan.dueDate, "Loan is not yet due");
        require(!loan.isDefaulted, "Loan already marked as defaulted");
        
        loan.isDefaulted = true;
        loan.isActive = false;
        hasActiveLoan[loan.borrower] = false;
        
        emit LoanDefaulted(loanId, loan.borrower);
    }
    
    /**
     * @notice Get all loan IDs for an agent
     */
    function getAgentLoans(address agentAddress) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return agentLoans[agentAddress];
    }
    
    /**
     * @notice Get loan details
     */
    function getLoan(uint256 loanId) external view returns (Loan memory) {
        return loans[loanId];
    }
    
    /**
     * @notice Withdraw excess funds from lending pool (admin only)
     */
    function withdrawPoolFunds(uint256 amount) external onlyOwner nonReentrant {
        require(amount <= lendingPoolBalance, "Insufficient pool balance");
        lendingPoolBalance -= amount;
        payable(owner()).transfer(amount);
    }
    
    /**
     * @notice Fallback to receive repayments
     */
    receive() external payable {
        lendingPoolBalance += msg.value;
    }
}
