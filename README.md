## The CES Wind Turbine Challenge

#### Participate in the "CES Wind Turbine Challenge" - a social game based on an Ethereum Blockchain and win super cool prizes!

### How to play?
Go to https://ces.blockchain-studio.com/game and fill your Twitter username to run the CES Wind Turbine and produce as much green energy as possible.

### When will the game end?

Friday, January 11 at 6:00PM (in fact, when block number #4791131 on Ropsten network is produced), we will stop the wind turbine and the top five producers will be rewarded with very cool prizes ;)

### Prizes:

 1. [Legder Nano S](https://www.ledger.com/products/ledger-nano-s)
 2. [Book: Mastering Ethereum: Building Smart Contracts and DApps](https://www.amazon.com/Mastering-Ethereum-Building-Smart-Contracts/dp/1491971940)
 3. Blockchain Studio Cap and Shirt 🧢 + 👕
 4. Blockchain Studio Mug 🍺
 5. Blockchain Studio Candies (Gummy bears) 🍬

We will contact the winners by Tweeter to get their details and send the prizes to them.

### What do I need to play?

 - Chrome or Firefox.
 - [Metamask](https://metamask.io/) connected on Ropsten network

### How much energy is produced by the CES Wind Turbine?

A 2 MW wind turbine produces around 4 400 000 kWh/year.
We consider that during the CES, the wind turbine produces 0.13952308472 kWh per second.

### How is the energy production of a player calculated?

To run the CES wind turbine, you send a transaction that is recorded on the Blockchain by a smart contract. This transaction is attached to a block that can be identified by its block number. Every 20 seconds, a new block is produced on the Blockchain. By counting the number of blocks when you were running the wind turbine, we can calculate how much energy you produced. For each block (20 seconds), the turbine produces 0.13952308472 * 20 = 2.8 kWh.

### Under the hood:

If you are interested to know more, you can see the code of the smart contract and the web application on our [github repository](https://github.com/blockchain-studio/rockside-guitar-dapp-tutorial).
