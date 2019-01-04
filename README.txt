## CES Wind Turbine Challenge

#### Participate in the "CES Wind Turbine Challenge" - a social game based on an Ethereum Blockchain and win super cool prizes ;).

### How to play ?
Go to http://ces.blochain-studio.com/game  and fill your Twitter username to run the CES Wind Turbine and produce as much green energy as possible.

### When the game ends ?

Friday, January 11 at 18:00 (in fact, when block number 4791131 on ropsten network will be produced), we will stop the wind turbine and the first five producers will be rewarded with very interesting prizes.

### Prizes

 1. [Legder Nano S](https://www.ledger.com/products/ledger-nano-s)
 2. [Book: Mastering Ethereum: Building Smart Contracts and DApps](https://www.amazon.com/Mastering-Ethereum-Building-Smart-Contracts/dp/1491971940)
 3. Blockchain Studio Cap and Shirt 🧢 + 👕
 4. Blockchain Studio Mug 🍺
 5. Blockchain Studio Candies (Gummy bears) 🍬

We will contact the top five producers by tweeter to get their details and send them their prize.

### What do I need to play

 - Chrome or firefox.
 - [Metamask](https://metamask.io/) connected on ropsten network

### How much energy is produced by the CES Wind Turbine?

A 2 MW wind turbine produces about 4400 000 kWh per year.
We consider that during the CES, the wind turbine will produce 0.13952308472 kWh per second.

### How player energy production is calculated?

To run the CES wind turbine, you send a transaction, that will be recorded on the blockchain, to a smart contract. This transaction is attached to a block that can be identified by its block number. Every 20 seconds or so, a new block is produced on the blockchain. By counting the number of blocks when you were running the wind turbine we can determine how much energy you produced. For each block (20 seconds), the turbine produces 0.13952308472 * 20 = 2.8 kWh.

### Under the hood

If you are interested in this topic, you can see the code of smart contract and  web application on our [github repository](https://github.com/blockchain-studio/rockside-guitar-dapp-tutorial).
