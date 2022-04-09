import { useEffect, useState } from 'react';
import Web3 from 'web3';
import trustBuild from './Trust';
const TRUST_ADDRESS = '0x860A7555653810d0F86b942563cFC4374e4E7a77';
const TRUST_ABI = trustBuild.abi;

function App() {
  const [account, setAccount] = useState();
  const [trustContract, setTrustContract] = useState();
  const [balance, setBalance] = useState(0);
  const [creator, setCreator] = useState();

  useEffect(() => {
    async function load() {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const accounts = await web3.eth.requestAccounts();

      setAccount(accounts[0]);

      // Instantiate smart contract using ABI and address.
      const c = new web3.eth.Contract(TRUST_ABI, TRUST_ADDRESS);
      setTrustContract(c);

      const usState = await c.methods.something().call();
      setCreator(usState);

      // Instantiate balance of the trust
      web3.eth.getBalance(TRUST_ADDRESS, (err, wei) => {
        setBalance = web3.utils.fromWei(wei, 'ether')
      })
    }

    load();
  }, []);

  return (
    <div>
      This is the account: {account}
      <br />
      This is the balance: {balance}
      <br />
      This is the creator: {creator}
    </div>
  );
}

export default App;
