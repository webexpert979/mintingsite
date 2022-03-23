import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/Market.sol/NFTMarket.json'

let rpcEndpoint = null

if (process.env.NEXT_PUBLIC_WORKSPACE_URL) {
  rpcEndpoint = process.env.NEXT_PUBLIC_WORKSPACE_URL
}

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {    
    const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint)
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
    const data = await contract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        itemId: i.itemId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
		strength: meta.data.strength,
		constitution: meta.data.constitution,
	    endurance: meta.data.endurance,
	    reflex: meta.data.reflex,
	    dexterity: meta.data.dexterity,
	    fortitude: meta.data.fortitude,
	    athletics: meta.data.athletics,
	    intelligence: meta.data.intelligence,
	    wisdom: meta.data.wisdom,
	    charisma: meta.data.charisma,
	    sleight_of_hand: meta.data.sleight_of_hand,
	    stealth: meta.data.stealth,
	    survival: meta.data.survival, 
	    willpower: meta.data.willpower,
	    deception: meta.data.deception,
	    perception: meta.data.perception,
	    persuasion: meta.data.persuasion,
	    charisma2: meta.data.charisma2,
	    intimidation: meta.data.intimidation,
	    medicine: meta.data.medicine,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nftaddress, nft.itemId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-4 pt-5">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} alt="rpg" />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-s font-semibold">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  {/*<p className="text-s mb-4 font-bold text-white border-2 p-2">ETH <span className="float-right">{nft.price} </span></p>*/}
				  <h3>Body</h3>
				  <p className="text-s mb-4 font-bold text-white border-2 p-2">strength <span className="float-right">{nft.strength} </span></p>
				  <p className="text-s mb-4 font-bold text-white border-2 p-2">constitution <span className="float-right">{nft.constitution} </span></p>
				  <p className="text-s mb-4 font-bold text-white border-2 p-2">endurance <span className="float-right">{nft.endurance} </span></p>
          <p className="text-s mb-4 font-bold text-white border-2 p-2">reflex <span className="float-right">{nft.reflex} </span></p>
				  <p className="text-s mb-4 font-bold text-white border-2 p-2">dexterity <span className="float-right">{nft.dexterity} </span></p>
				  <p className="text-s mb-4 font-bold text-white border-2 p-2">fortitude <span className="float-right">{nft.fortitude} </span></p>
				  <p className="text-s mb-4 font-bold text-white border-2 p-2">athletics <span className="float-right">{nft.athletics} </span></p>
				  <h3>Mind</h3>
				  <p className="text-s mb-4 font-bold text-white border-2 p-2">intelligence <span className="float-right">{nft.intelligence} </span></p>
				  <p className="text-s mb-4 font-bold text-white border-2 p-2">wisdom <span className="float-right">{nft.wisdom} </span></p>
				  <p className="text-s mb-4 font-bold text-white border-2 p-2">charisma <span className="float-right">{nft.charisma} </span></p>
          <p className="text-s mb-4 font-bold text-white border-2 p-2">sleight of hand <span className="float-right">{nft.sleight_of_hand} </span></p>
				  <p className="text-s mb-4 font-bold text-white border-2 p-2">stealth <span className="float-right">{nft.stealth} </span></p>
				  <p className="text-s mb-4 font-bold text-white border-2 p-2">survival <span className="float-right">{nft.survival} </span></p>
				  <p className="text-s mb-4 font-bold text-white border-2 p-2">willpower <span className="float-right">{nft.willpower} </span></p>
				  <h3>Soul</h3>
				  <p className="text-s mb-4 font-bold text-white border-2 p-2">deception<span className="float-right">{nft.deception} </span></p>
				  <p className="text-s mb-4 font-bold text-white border-2 p-2">perception <span className="float-right">{nft.perception} </span></p>
				  <p className="text-s mb-4 font-bold text-white border-2 p-2">persuasion <span className="float-right">{nft.persuasion} </span></p>
          <p className="text-s mb-4 font-bold text-white border-2 p-2">charisma <span className="float-right">{nft.charisma2} </span></p>
				  <p className="text-s mb-4 font-bold text-white border-2 p-2">intimidation <span className="float-right">{nft.intimidation} </span></p>
				  <p className="text-s mb-4 font-bold text-white border-2 p-2">medicine <span className="float-right">{nft.medicine} </span></p>
				  {/*<button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>*/}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
