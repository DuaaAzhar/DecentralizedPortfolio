import './Wallet.css';
import Web3 from 'web3';
import ABI from './ABI.json';
import { useState } from 'react';


const Wallet =({saveState})=>{
      const isAndroid= /android/i.test(navigator.userAgent);
      const [connected, setConnected] = useState(false);
      const init = async() =>{
            try {
                  const web3 = new Web3(window.ethereum);
                  await window.ethereum.request({method: 'eth_requestAccounts'});
                  const contract = new web3.eth.Contract(
                        ABI,
                        "0x861A6F30a4c3f1d602CC9Ad0762F1C7dd90d25Cb"
                  );
                  saveState({web3:web3,contract:contract});
                  setConnected(true);
            } catch (error) {
                  alert("Please install Metamask!");
            }
      }
      return<>
      <div className="header">
      {isAndroid  && <button className="connectBTN">
         <a href="https://metamask.app.link/dapp/duaaazhar.netlify.app/">Click For Mobile</a>
        </button>  } 
       <button onClick={init}
       className= "connectBTN"
       disabled = {connected}
       > {!connected? "Connect Metamask": "Connected"}</button>
      </div>
      </>
}
export default Wallet;