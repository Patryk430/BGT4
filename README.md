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

## Testing on Ganache local network

Deployed Contract
<img width="1920" height="970" alt="image" src="https://github.com/user-attachments/assets/d1ea30af-84ca-4f8b-8cdb-da546adfe169" />

Getting info through Truffle console
<img width="1920" height="240" alt="image" src="https://github.com/user-attachments/assets/d89760e2-29e8-48c0-b2b9-e9136ca98d8e" />

Subscribing via console
<img width="1920" height="950" alt="image" src="https://github.com/user-attachments/assets/68924e60-f9b1-4b40-b829-6ac732db8eeb" />
<img width="1920" height="105" alt="image" src="https://github.com/user-attachments/assets/18510cb3-e0af-47ad-879d-65a07b7a1f64" />
<img width="1920" height="95" alt="image" src="https://github.com/user-attachments/assets/60e56e28-d72b-476e-a1b4-cb0531b9b75d" />
<img width="1920" height="90" alt="image" src="https://github.com/user-attachments/assets/7b061da3-d07e-49f5-832a-73f81df2d478" />


Creator-only actions
<img width="1920" height="705" alt="image" src="https://github.com/user-attachments/assets/fe374940-238c-4aa0-98ce-bb9fcb277155" />
<img width="1920" height="700" alt="image" src="https://github.com/user-attachments/assets/1b1b74bb-9314-45a6-87e2-1ea8e3732f21" />
<img width="1920" height="75" alt="image" src="https://github.com/user-attachments/assets/01afeb51-d85e-4976-9cc6-46ee161c374b" />

Transactions in Ganache
<img width="1920" height="975" alt="image" src="https://github.com/user-attachments/assets/f952fe8f-f400-43b3-8cef-301e5f27237a" />

ETH transferred
<img width="1920" height="245" alt="image" src="https://github.com/user-attachments/assets/d1cea767-a1bc-42d9-bf7a-89511df58271" />

### Ganache chain in MetaMask
<img width="1920" height="885" alt="image" src="https://github.com/user-attachments/assets/bec4b338-6b55-4327-8317-210f64260845" />
After subscribing (price changed to be more notesible)
<img width="1920" height="190" alt="image" src="https://github.com/user-attachments/assets/fb952df7-b782-480b-9146-9f78e9317ce1" />

## Front-End App (Broken)
<img width="1920" height="940" alt="image" src="https://github.com/user-attachments/assets/542bff00-b3b6-4555-a479-8ff2dad866ff" />

Allows you to connect using MetaMask (shows adress) bet can't connect to the contract, even though I double checked the adresses and MetaMask is connected to the Ganache local chain (balances get updated when using Treffle console). 











