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
