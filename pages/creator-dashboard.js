import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/Market.sol/NFTMarket.json'


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

    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    const data = await contract.fetchItemsListed()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
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
                <img src={nft.image} className="rounded" alt="rpg" />
                <div className="p-4 bg-black">
                  {/*<p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>*/}
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
                      <img src={nft.image} className="rounded" alt="rpg" />
                      <div className="p-4 bg-black">
                        {/*<p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>*/}
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