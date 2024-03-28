import "./Wallet.css";
import Web3 from "web3";
import ABI from "./ABI.json";
import { useState } from "react";

const Wallet = ({ saveState }) => {
  const isAndroid = /android/i.test(navigator.userAgent);
  const [connected, setConnected] = useState(false);

  // Get the current network ID from MetaMask
  async function getCurrentNetwork() {
    const networkId = await web3.eth.net.getId();
    return networkId;
  }

  const init = async () => {
    try {
      // Define a mapping of network IDs to contract addresses
      const contractAddresses = {
        11155111: "0x2d2dCd6f411c5b9e048aa8D1a0144d084010db11", // Sepolia testnet contract address
        80001: "0x00e8B97dc085F826DE00509c3B98D4c03241C55b", // Mumbai testnet contract address
      };
      const web3 = new Web3(window.ethereum);

      // Get the current network ID from MetaMask
      async function getCurrentNetwork() {
        const networkId = await web3.eth.net.getId();
        return networkId;
      }
      // Get the contract address based on the connected network
      async function getContractAddress() {
        const networkId = await getCurrentNetwork();
        const contractAddress = contractAddresses[networkId];
        if (!contractAddress) {
          throw new Error(
            "Contract address not defined for the current network ID"
          );
        }
        return contractAddress;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const  contract = new web3.eth.Contract(
          ABI,
          await getContractAddress()
        );

      saveState({ web3: web3, contract: contract });
      setConnected(true);
    } catch (error) {
      alert("Please install Metamask!");
    }
  };
  return (
    <>
      <div className="header">
        {isAndroid && (
          <button className="connectBTN">
            <a href="https://metamask.app.link/dapp/duaaazhar.netlify.app/">
              Click For Mobile
            </a>
          </button>
        )}
        <button onClick={init} className="connectBTN" disabled={connected}>
          {" "}
          {!connected ? "Connect Metamask" : "Connected"}
        </button>
      </div>
    </>
  );
};
export default Wallet;
