import { useState, useEffect } from "react"
import { providers, Contract } from "ethers"
import detectEthProvider from "@metamask/detect-provider";

function useIsFlashbots() {
    const [isFlashbots, setIsFlashbots] = useState(false)
    const [web3Provider, setWeb3Provider] = useState()

    const updateFlashbotsContractStatus = async (flashbotsContract) => {
        const result = await flashbotsContract.isFlashRPC()
        console.log("FB contract result", result)
        setIsFlashbots(result || false)
    }

    useEffect(() => {
        async function load() {
            if (!web3Provider) {
                const provider = await detectEthProvider()
                provider.on('chainChanged', (_chainId) => {
                    console.log("SWITCHED NETWORKS.");
                    // NOTE: this doesn't work if the chain ID doesn't change
                    updateFlashbotsContractStatus()
                    // window.location.reload()
                });
                setWeb3Provider(provider)
            }
            else {
                const ethersProvider = new providers.Web3Provider(web3Provider)
                console.log("ethersProvider", ethersProvider)
                const flashbotsContract = new Contract("0xf1a54b0759b58661cEa17CfF19dd37940a9b5f1A", [{"inputs":[],"name":"isFlashRPC","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}], ethersProvider)
                updateFlashbotsContractStatus(flashbotsContract)
            }
        }
        load()
    }, [web3Provider])

    return isFlashbots
}

export {useIsFlashbots}
