import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([])
  const [sold, setSold] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
      
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchItemsCreated()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
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
	    charisma: meta.data.charisma,
	    intimidation: meta.data.intimidation,
	    medicine: meta.data.medicine,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
      }
      return item
    }))
    /* create a filtered array of items that have been sold */
    const soldItems = items.filter(i => i.sold)
    setSold(soldItems)
    setNfts(items)
    setLoadingState('loaded') 
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets created</h1>)
  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl py-2">Items Created</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
				  <h3>Body</h3>
				  <p className="text-2xl font-bold text-white">strength {nft.strength} </p>
				  <p className="text-2xl font-bold text-white">constitution {nft.constitution} </p>
				  <p className="text-2xl font-bold text-white">endurance {nft.endurance} </p>
                  <p className="text-2xl font-bold text-white">reflex {nft.reflex} </p>
				  <p className="text-2xl font-bold text-white">dexterity {nft.dexterity} </p>
				  <p className="text-2xl font-bold text-white">fortitude {nft.fortitude} </p>
				  <p className="text-2xl font-bold text-white">athletics {nft.athletics} </p>
				  <h3>Mind</h3>
				  <p className="text-2xl font-bold text-white">intelligence {nft.intelligence} </p>
				  <p className="text-2xl font-bold text-white">wisdom {nft.wisdom} </p>
				  <p className="text-2xl font-bold text-white">charisma {nft.charisma} </p>
                  <p className="text-2xl font-bold text-white">sleight_of_hand {nft.sleight_of_hand} </p>
				  <p className="text-2xl font-bold text-white">stealth {nft.stealth} </p>
				  <p className="text-2xl font-bold text-white">survival {nft.survival} </p>
				  <p className="text-2xl font-bold text-white">willpower {nft.willpower} </p>
				  <h3>Soul</h3>
				  <p className="text-2xl font-bold text-white"> deception{nft.deception} </p>
				  <p className="text-2xl font-bold text-white">perception {nft.perception} </p>
				  <p className="text-2xl font-bold text-white">persuasion {nft.persuasion} </p>
                  <p className="text-2xl font-bold text-white">charisma {nft.charisma} </p>
				  <p className="text-2xl font-bold text-white">intimidation {nft.intimidation} </p>
				  <p className="text-2xl font-bold text-white">medicine {nft.medicine} </p>
				</div>
              </div>
            ))
          }
        </div>
      </div>
        <div className="px-4">
        {
          Boolean(sold.length) && (
            <div>
              <h2 className="text-2xl py-2">Items sold</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {
                  sold.map((nft, i) => (
                    <div key={i} className="border shadow rounded-xl overflow-hidden">
                      <img src={nft.image} className="rounded" />
                      <div className="p-4 bg-black">
                        <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
						<h3>Body</h3>
						<p className="text-2xl font-bold text-white">strength {nft.strength} </p>
						<p className="text-2xl font-bold text-white">constitution {nft.constitution} </p>
						<p className="text-2xl font-bold text-white">endurance {nft.endurance} </p>
						<p className="text-2xl font-bold text-white">reflex {nft.reflex} </p>
						<p className="text-2xl font-bold text-white">dexterity {nft.dexterity} </p>
						<p className="text-2xl font-bold text-white">fortitude {nft.fortitude} </p>
						<p className="text-2xl font-bold text-white">athletics {nft.athletics} </p>
						<h3>Mind</h3>
						<p className="text-2xl font-bold text-white">intelligence {nft.intelligence} </p>
						<p className="text-2xl font-bold text-white">wisdom {nft.wisdom} </p>
						<p className="text-2xl font-bold text-white">charisma {nft.charisma} </p>
						<p className="text-2xl font-bold text-white">sleight_of_hand {nft.sleight_of_hand} </p>
						<p className="text-2xl font-bold text-white">stealth {nft.stealth} </p>
						<p className="text-2xl font-bold text-white">survival {nft.survival} </p>
						<p className="text-2xl font-bold text-white">willpower {nft.willpower} </p>
						<h3>Soul</h3>
						<p className="text-2xl font-bold text-white"> deception{nft.deception} </p>
						<p className="text-2xl font-bold text-white">perception {nft.perception} </p>
						<p className="text-2xl font-bold text-white">persuasion {nft.persuasion} </p>
						<p className="text-2xl font-bold text-white">charisma {nft.charisma} </p>
						<p className="text-2xl font-bold text-white">intimidation {nft.intimidation} </p>
						<p className="text-2xl font-bold text-white">medicine {nft.medicine} </p>
						</div>
                    </div>
                  ))
                }
              </div>
            </div>
          )
        }
        </div>
    </div>
  )
}