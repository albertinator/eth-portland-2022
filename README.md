# trust.fund

## Description

During ETH Portland 2022, I implemented an irrevocable living trust account that has an age trigger for releasing wealth to a user's heir.

Trust funds are an important part of estate planning and the transfer of wealth to heirs. In fact, in just the United States, there is about $2 trillion locked up in these old school contracts.

Trust funds today are implemented manually with a few unattractive ~~features~~ bugs:
* The involvement of 3rd party trustee, typically a financial instution that will charge 1-2% annually for holding the funds
* Up to $1K in legal fees to draft the conditions of a trust contract, depending on complexity of conditions of wealth transfer
* Possibly $10K to $100K in additional legal fees if there are disputes from ambiguous contract terms
* Up to $1K in tax accountant fees to advise, plan, or file on tax repercussions, depending on factors like state law or type of trust

How is the next $trillion that go into trust funds going to be handled? Through smart contracts and decentralized finance.

## Setup
Install Truffle
```bash
$ npm install -g truffle
```

Install [Ganache](https://trufflesuite.com/ganache), to emulate ETH node with 10 accounts

This repo was initiated by running:
```bash
$ truffle unbox pet-shop
```
and then following [https://trufflesuite.com/tutorial](https://trufflesuite.com/tutorial)

## Backend
```bash
$ truffle compile
$ truffle migrate
```

## Frontend
Set up [Metamask extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en)

Connect Metamask to Ganache:
* [https://asifwaquar.com/connect-metamask-to-localhost](https://asifwaquar.com/connect-metamask-to-localhost)

Run the frontend:
```bash
$ yarn dev
```
