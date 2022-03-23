import React, {useState} from "react";
import './App.css';
import { Contract, providers } from "ethers";
// import Web3 from "web3";
import detectEthProvider from "@metamask/detect-provider";
import contracts from "./contracts";

function App() {
  const [isFlashbots, setIsFlashbots] = useState();
  // const web3Provider = Web3.givenProvider;
  // const ethersProvider = new providers.JsonRpcProvider();
  // console.log("web3", web3Provider);
  // console.log(window.ethereum);
  const myAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // hardhat 0
  const myPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // hardhat 0
  
  
  const checkFlashbotsRpcContract = async (ethersProvider) => {
    const flashbotsContract = new Contract("0xf1a54b0759b58661cEa17CfF19dd37940a9b5f1A", [{"inputs":[],"name":"isFlashRPC","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}], ethersProvider);
    const result = await flashbotsContract.isFlashRPC();
    console.log("FB contract result", result);
    setIsFlashbots(result || false)
  }

  // !! DO NOT USE !! DEPRECATED AND CRUFTY
  const getNetVersion = async (provider, ethersProvider) => {
    // get net version: native method
    const netResOG = await provider.request({
      method: 'net_version',
    });
    console.log("netResOg", netResOG)

    // get net version: ethers method
    const netResEthers = await ethersProvider.send('net_version');
    console.log("netResEthers", netResEthers);

    return netResOG || netResEthers;
  }

  const testMulticall = async () => {
    // const txData = interestingContract.populateTransaction.readValue();
    // const multicallContract = new Contract(contracts.multicall.address, contracts.multicall.abi);
    // const res = multicallContract.populateTransaction.aggregate([
    //   txData,
    //   txData,
    // ]);
  }

  /**
   * Create new Protect RPC network in MM
   */
  const addProtectRpc = async (ethersProvider) => {
    return await ethersProvider.send('wallet_addEthereumChain', [{
      chainId: "0x1",
      chainName: "protecc",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: ["https://rpc.flashbots.net?bundle=6969"],
    }]);
  }
  
  const load = async () => {
    // const web3 = window.ethereum;
    const provider = await detectEthProvider();
    console.log("provider", provider);

    // refresh page when network changes
    provider.on('chainChanged', (_chainId) => {
      console.log("SWITCHED NETWORKS. REFRESHING PAGE.");
      window.location.reload()
    });

    // const ethersProvider = new providers.Web3Provider(web3);
    const ethersProvider = new providers.Web3Provider(provider);
    console.log("ethers provider", ethersProvider);
    await ethersProvider.ready;
    await checkFlashbotsRpcContract(ethersProvider);

    // const netRes = await getNetVersion(provider, ethersProvider);

    // if (netRes.endsWith(".fb")) {
    //   setIsFlashbots(true);
    // } else {
    //   setIsFlashbots(false);
    // }

    // add protect RPC to MM
    // !! doesn't work !!
    // const addNetRes = await addProtectRpc(ethersProvider);
    // console.log("add net res", addNetRes);
  }

  load();
  console.log("isFlashbots", isFlashbots)

  return (
    <div className="App">
      hello
      {<p>{isFlashbots ? "You're using Flashbots Protect RPC" : "You're not using Flashbots Protect RPC"}</p>}
    </div>
  );
}

export default App;
