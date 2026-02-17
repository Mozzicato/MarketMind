// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MarketMindAgent.sol";

/**
 * @title CreditScoring
 * @notice Onchain credit score calculation for MarketMind agents
 * @dev Implements FICO-like scoring (300-850) based on transaction history
 */
contract CreditScoring {
    struct CreditMetrics {
        uint256 transactionCount;      // Total number of transactions
        uint256 avgDailyRevenue;        // Average daily revenue (7-day window)
        uint256 paymentReliability;     // % of on-time supplier payments (0-100)
        uint256 inventoryTurnover;      // How frequently inventory is sold
        uint256 accountAge;             // Days since account creation
        uint256 profitMargin;           // Profit margin percentage (0-100)
    }
    
    // Scoring weights (total = 100%)
    uint256 constant WEIGHT_TRANSACTION_FREQUENCY = 30;
    uint256 constant WEIGHT_PAYMENT_RELIABILITY = 25;
    uint256 constant WEIGHT_REVENUE_CONSISTENCY = 20;
    uint256 constant WEIGHT_PROFIT_MARGIN = 15;
    uint256 constant WEIGHT_ACCOUNT_AGE = 10;
    
    // Score range
    uint256 constant MIN_SCORE = 300;
    uint256 constant MAX_SCORE = 850;
    
    // Mapping of agent address => creation timestamp
    mapping(address => uint256) public agentCreationTime;
    
    // Events
    event CreditScoreCalculated(
        address indexed agent,
        uint256 score,
        CreditMetrics metrics
    );
    
    /**
     * @notice Register a new agent's creation time
     */
    function registerAgent(address agent) external {
        if (agentCreationTime[agent] == 0) {
            agentCreationTime[agent] = block.timestamp;
        }
    }
    
    /**
     * @notice Calculate credit score for an agent
     * @param agentAddress Address of the MarketMind agent
     * @return score Credit score (300-850)
     */
    function calculateScore(address agentAddress) 
        external 
        returns (uint256 score) 
    {
        MarketMindAgent agent = MarketMindAgent(payable(agentAddress));
        
        // Gather metrics
        CreditMetrics memory metrics = _gatherMetrics(agent);
        
        // Calculate weighted score
        uint256 rawScore = 0;
        
        // 1. Transaction Frequency (30%)
        rawScore += _scoreTransactionFrequency(metrics.transactionCount) 
            * WEIGHT_TRANSACTION_FREQUENCY / 100;
        
        // 2. Payment Reliability (25%)
        rawScore += _scorePaymentReliability(metrics.paymentReliability) 
            * WEIGHT_PAYMENT_RELIABILITY / 100;
        
        // 3. Revenue Consistency (20%)
        rawScore += _scoreRevenueConsistency(metrics.avgDailyRevenue) 
            * WEIGHT_REVENUE_CONSISTENCY / 100;
        
        // 4. Profit Margin (15%)
        rawScore += _scoreProfitMargin(metrics.profitMargin) 
            * WEIGHT_PROFIT_MARGIN / 100;
        
        // 5. Account Age (10%)
        rawScore += _scoreAccountAge(metrics.accountAge) 
            * WEIGHT_ACCOUNT_AGE / 100;
        
        // Map raw score (0-100) to credit score range (300-850)
        score = MIN_SCORE + (rawScore * (MAX_SCORE - MIN_SCORE)) / 100;
        
        // Update agent's credit score
        agent.updateCreditScore(score);
        
        emit CreditScoreCalculated(agentAddress, score, metrics);
        
        return score;
    }
    
    /**
     * @notice Gather metrics from agent contract
     */
    function _gatherMetrics(MarketMindAgent agent) 
        internal 
        view 
        returns (CreditMetrics memory) 
    {
        uint256 transactionCount = agent.transactionCount();
        uint256 totalRevenue = agent.totalRevenue();
        uint256 totalCosts = agent.totalCosts();
        uint256 profitMargin = agent.getProfitMargin();
        
        // Calculate account age in days
        uint256 creationTime = agentCreationTime[address(agent)];
        if (creationTime == 0) creationTime = block.timestamp;
        uint256 accountAge = (block.timestamp - creationTime) / 1 days;
        
        // Calculate average daily revenue (simplified - assumes uniform distribution)
        uint256 avgDailyRevenue = accountAge > 0 
            ? totalRevenue / accountAge 
            : 0;
        
        // Payment reliability: For simplicity, we assume 100% if costs < revenue
        // In a full implementation, track actual payment due dates
        uint256 paymentReliability = totalCosts <= totalRevenue ? 100 : 80;
        
        // Inventory turnover: Simplified metric
        uint256 inventoryTurnover = transactionCount > 0 ? transactionCount : 0;
        
        return CreditMetrics({
            transactionCount: transactionCount,
            avgDailyRevenue: avgDailyRevenue,
            paymentReliability: paymentReliability,
            inventoryTurnover: inventoryTurnover,
            accountAge: accountAge,
            profitMargin: profitMargin
        });
    }
    
    /**
     * @notice Score transaction frequency (0-100)
     * More transactions = higher score
     */
    function _scoreTransactionFrequency(uint256 txCount) 
        internal 
        pure 
        returns (uint256) 
    {
        if (txCount == 0) return 0;
        if (txCount >= 100) return 100;
        
        // Linear scaling: 0 txns = 0, 100 txns = 100
        return txCount;
    }
    
    /**
     * @notice Score payment reliability (0-100)
     * % of on-time payments directly maps to score
     */
    function _scorePaymentReliability(uint256 reliability) 
        internal 
        pure 
        returns (uint256) 
    {
        return reliability; // Already 0-100
    }
    
    /**
     * @notice Score revenue consistency (0-100)
     * Higher average daily revenue = higher score
     */
    function _scoreRevenueConsistency(uint256 avgDailyRevenue) 
        internal 
        pure 
        returns (uint256) 
    {
        // Assume 1 cUSD ($1) average daily revenue is baseline
        // 10 cUSD/day = 100 score
        uint256 baselineRevenue = 1 ether; // 1 cUSD
        uint256 maxRevenue = 10 ether; // 10 cUSD
        
        if (avgDailyRevenue == 0) return 0;
        if (avgDailyRevenue >= maxRevenue) return 100;
        
        return (avgDailyRevenue * 100) / maxRevenue;
    }
    
    /**
     * @notice Score profit margin (0-100)
     * Higher margin = higher score
     */
    function _scoreProfitMargin(uint256 margin) 
        internal 
        pure 
        returns (uint256) 
    {
        // Margin is already 0-100 percentage
        return margin;
    }
    
    /**
     * @notice Score account age (0-100)
     * Longer history = higher score
     */
    function _scoreAccountAge(uint256 ageDays) 
        internal 
        pure 
        returns (uint256) 
    {
        if (ageDays == 0) return 0;
        if (ageDays >= 365) return 100; // 1 year = max score
        
        // Linear scaling: 0 days = 0, 365 days = 100
        return (ageDays * 100) / 365;
    }
    
    /**
     * @notice Get credit metrics for an agent (view only)
     */
    function getCreditMetrics(address agentAddress) 
        external 
        view 
        returns (CreditMetrics memory) 
    {
        MarketMindAgent agent = MarketMindAgent(payable(agentAddress));
        return _gatherMetrics(agent);
    }
    
    /**
     * @notice Preview credit score without updating agent
     */
    function previewScore(address agentAddress) 
        external 
        view 
        returns (uint256 score) 
    {
        MarketMindAgent agent = MarketMindAgent(payable(agentAddress));
        CreditMetrics memory metrics = _gatherMetrics(agent);
        
        uint256 rawScore = 0;
        rawScore += _scoreTransactionFrequency(metrics.transactionCount) * WEIGHT_TRANSACTION_FREQUENCY / 100;
        rawScore += _scorePaymentReliability(metrics.paymentReliability) * WEIGHT_PAYMENT_RELIABILITY / 100;
        rawScore += _scoreRevenueConsistency(metrics.avgDailyRevenue) * WEIGHT_REVENUE_CONSISTENCY / 100;
        rawScore += _scoreProfitMargin(metrics.profitMargin) * WEIGHT_PROFIT_MARGIN / 100;
        rawScore += _scoreAccountAge(metrics.accountAge) * WEIGHT_ACCOUNT_AGE / 100;
        
        score = MIN_SCORE + (rawScore * (MAX_SCORE - MIN_SCORE)) / 100;
        return score;
    }
}
