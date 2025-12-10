// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title SubscriptionContract — simple ETH-based subscription manager
/// @notice Deployed by a Creator who defines price & billing period. Subscribers pay ETH to subscribe/renew.
/// @dev Only creator can change price/billing period or withdraw accumulated funds.
contract Subscription {

    ///Creator (content owner) who deployed this contract
    address public creator;

    ///price per billingPeriod (in wei)
    uint256 public price;

    ///billing period length in seconds (e.g., 30 days = 30*24*3600)
    uint256 public billingPeriod;

    ///mapping of subscriber -> subscription expiry timestamp (unix)
    mapping(address => uint256) public expiry;

    ///accumulated ETH from subscriptions awaiting withdrawal by creator
    uint256 private accumulated;

    event Subscribed(address indexed subscriber, uint256 expiry);
    event Renewed(address indexed subscriber, uint256 expiry);
    event Cancelled(address indexed subscriber, uint256 atTimestamp);
    event Withdrawn(address indexed creator, uint256 amount);
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);
    event BillingPeriodUpdated(uint256 oldPeriod, uint256 newPeriod);


    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator");
        _;
    }


    ///_price price in wei for one billingPeriod
    ///_billingPeriod length of billing period in seconds
    constructor(uint256 _price, uint256 _billingPeriod) {
        require(_price > 0, "Price must be > 0");
        require(_billingPeriod > 0, "Billing period must be > 0");
        creator = msg.sender;
        price = _price;
        billingPeriod = _billingPeriod;
   }


    /* ========== SUBSCRIPTION ACTIONS ========== */

    ///Subscribe or renew for one billingPeriod. Must send exactly `price` wei.
    function subscribe() external payable {
        require(msg.value == price, "Send exact price");
        uint256 current = block.timestamp;
        uint256 newExpiry = expiry[msg.sender];
        if (newExpiry < current) {
            // starting a new subscription
            newExpiry = current + billingPeriod;
        } else {
            // extending an active subscription
            newExpiry = newExpiry + billingPeriod;
        }
        expiry[msg.sender] = newExpiry;

        // track funds for creator withdrawal
        accumulated += msg.value;

        // emit event
        if (block.timestamp == current) { /* no-op to quiet analyzer */ }
        emit Subscribed(msg.sender, newExpiry);
    }

    ///Alias for subscribe — same behavior (semantic convenience)
function renew() external payable {
    require(msg.value == price, "Incorrect ETH amount");
    this.subscribe(); // Explicitly call via `this`
    emit Renewed(msg.sender, block.timestamp + billingPeriod);
}

    ///Cancel subscription immediately. No refunds for remaining time.
    function cancel() external {
        expiry[msg.sender] = 0;
        emit Cancelled(msg.sender, block.timestamp);
    }

    /* ========== VIEW HELPERS ========== */

    ///Returns whether a given account currently has an active subscription
    function isActive(address account) public view returns (bool) {
        return expiry[account] > block.timestamp;
    }

    ///Seconds remaining for a subscriber (0 if expired)
    function secondsRemaining(address account) external view returns (uint256) {
        if (expiry[account] <= block.timestamp) return 0;
        return expiry[account] - block.timestamp;
    }

    /* ========== CREATOR ACTIONS ========== */

    ///Withdraw accumulated subscription funds to creator
    function withdraw() external onlyCreator {
        uint256 amount = accumulated;
        require(amount > 0, "No funds");
        accumulated = 0;

        // call pattern to send ETH
        (bool ok, ) = payable(creator).call{value: amount}("");
        require(ok, "Transfer failed");

        emit Withdrawn(creator, amount);
    }

    ///Update price (in wei) — only creator
    function updatePrice(uint256 newPrice) external onlyCreator {
        require(newPrice > 0, "Price must be > 0");
        uint256 old = price;
        price = newPrice;
        emit PriceUpdated(old, newPrice);
    }

    ///Update billing period (seconds) — only creator
    function updateBillingPeriod(uint256 newPeriod) external onlyCreator {
        require(newPeriod > 0, "Billing period > 0");
        uint256 old = billingPeriod;
        billingPeriod = newPeriod;
        emit BillingPeriodUpdated(old, newPeriod);
    }

    /* ========== SAFETY: fallback / receive ========== */

    ///Disallow direct ETH transfers to avoid accidental funds (force use of subscribe())
    receive() external payable {
        revert("Direct deposits not allowed; call subscribe()");
    }

    fallback() external payable {
        revert("Direct deposits not allowed; call subscribe()");
    }

}


