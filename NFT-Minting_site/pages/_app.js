import '../styles/globals.css'
import Link from 'next/link'
import WalletConnectProvider from "@walletconnect/web3-provider"
import Web3Modal from "web3modal"
import { ethers } from 'ethers'

async function connect() {
  
  let providerOptions;
		providerOptions = {
			metamask: {
			id: "injected",
			name: "MetaMask",
			type: "injected",
			check: "isMetaMask"
			},
			walletconnect: {
			package: WalletConnectProvider, // required
			options: {
				infuraId: "8c661edd6d764e1e95fd0318054d331c",
				rpc: {
					42: 'https://kovan.infura.io/v3/8c661edd6d764e1e95fd0318054d331c'
				},
				network: "kovan", // --> this will be use to determine chain id 42
			}
			}
		};
      let web3Modal = new Web3Modal({
            network: "kovan",
            cacheProvider: false,
            providerOptions
            })
		//web3Modal.clearCachedProvider()
        let connection = await web3Modal.connect()
		
        let provider = new ethers.providers.Web3Provider(connection)
		
        let netId = await provider.getNetwork()
        document.getElementById('connect_lib').innerText = 'connected';
}


function Marketplace({ Component, pageProps }) {
  return (
    <div>
      <style jsx global>{`
      body {
        font-family: 'Press Start 2P', cursive;
      }
    `}</style>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">RPG Roller DApp</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500">
              All NFTs
            </a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-pink-500">
              Create NFT
            </a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-pink-500">
              My NFTs
            </a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 text-pink-500">
              Creator Dashboard
            </a>
          </Link>
          <Link href="/mint">
            <a className="mr-6 text-pink-500">
              Mint
            </a>
          </Link>
        </div>
        <div className='float-right'>
        <button onClick={connect} id="connect_lib">Connect wallet</button>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default Marketplace