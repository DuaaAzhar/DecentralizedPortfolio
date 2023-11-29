import './Wallet.css';
import Web3 from 'web3';
import ABI from './ABI.json';


const Wallet =({saveState})=>{
      const init = async() =>{
            try {
                  const web3 = new Web3(window.ethereum);
                  await window.ethereum.request({method: 'eth_requestAccounts'});
                  const contract = new web3.eth.Contract(
                        ABI,
                        "0xcD6a42782d230D7c13A74ddec5dD140e55499Df9"
                  );
                  saveState({web3:web3,contract:contract});
                  console.log(saveState);
            } catch (error) {
                  alert("Please install Metamask!");
            }
      }
      return<>
      <div className="header">
      {false  && <button className="connectBTN">
         <a href="https://metamask.app.link/dapp/sriche.netlify.app/">Click For Mobile</a>
        </button>  } 
       <button onClick={init} className="connectBTN">Connect Metamask</button>
      </div>
      </>
}
export default Wallet;