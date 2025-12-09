## A simple ETH-based subscription manager where:
* A creator (contract deployer) sets a subscription price and billing period.
* Subscribers pay ETH to subscribe/renew for a fixed duration.
* The creator can withdraw accumulated funds or update terms.

### Flow

1. Deployer sets price and billingPeriod in the constructor.
2. Subscribers call subscribe()/renew() with exact ETH.
3. Creator withdraws funds via withdraw() or updates terms.

### State Variables
* `creator`: Address of the contract owner.
* `price`: Cost per billing period (in wei).
* `billingPeriod`: Duration of subscription (in seconds).
* `expiry`: Mapping of subscriber addresses to their expiry timestamps.
* `accumulated`: Total ETH awaiting withdrawal by the creator.

### Functions
Subscriber Actions:
* `subscribe()`: Pay price to start/extend subscription.
* `renew()`: Alias for subscribe() (emits a different event).
* `cancel()`: Terminate subscription immediately (no refunds).

  
View Helpers:
* `isActive()`: Check if a subscription is active.
* `secondsRemaining()`: Time left for a subscription.

  
Creator Actions:
* `withdraw()`: Send accumulated ETH to the creator.
* `updatePrice()`/`updateBillingPeriod()`: Modify subscription terms.

