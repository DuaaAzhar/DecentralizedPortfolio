import './Wallet.css';
import Web3 from 'web3';
import ABI from './ABI.json';
import { useState } from 'react';


const Wallet =({saveState})=>{
      const [connected, setConnected] = useState(false);
      const init = async() =>{
            try {
                  const web3 = new Web3(window.ethereum);
                  await window.ethereum.request({method: 'eth_requestAccounts'});
                  const contract = new web3.eth.Contract(
                        ABI,
                        "0xd56D808155eAA96117b9669B7CEC53339e68BD24"
                  );
                  saveState({web3:web3,contract:contract});
                  setConnected(true);
            } catch (error) {
                  alert("Please install Metamask!");
            }
      }
      return<>
      <div className="header">
      {false  && <button className="connectBTN">
         <a href="https://metamask.app.link/dapp/sriche.netlify.app/">Click For Mobile</a>
        </button>  } 
       <button onClick={init}
       className= "connectBTN"
       disabled = {connected}
       > {!connected? "Connect Metamask": "Connected"}</button>
      </div>
      </>
}
export default Wallet;