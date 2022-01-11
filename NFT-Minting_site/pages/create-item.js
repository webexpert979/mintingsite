import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '',
  strength: '',
  constitution: '',
  endurance: '',
  reflex: '',
  dexterity: '',
  fortitude: '',
  athletics: '',
  intelligence: '',
  wisdom: '',
  charisma: '',
  sleight_of_hand: '',
  stealth: '',
  survival: '',
  willpower: '',
  deception: '',
  perception: '',
  persuasion: '',
  charisma2: '',
  intimidation: '',
  medicine: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function createMarket() {
    const { name, description, price,strength,
	  constitution,
	  endurance,
	  reflex,
	  dexterity,
	  fortitude,
	  athletics,
	  intelligence,
	  wisdom,
	  charisma,
	  sleight_of_hand,
	  stealth,
	  survival,
	  willpower,
	  deception,
	  perception,
	  persuasion,
	  charisma2,
	  intimidation,
	  medicine} = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl,strength,constitution,
	  endurance,
	  reflex,
	  dexterity,
	  fortitude,
	  athletics,
	  intelligence,
	  wisdom,
	  charisma,
	  sleight_of_hand,
	  stealth,
	  survival,
	  willpower,
	  deception,
	  perception,
	  persuasion,
	  charisma2,
	  intimidation,
	  medicine
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()
    
    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()

    const price = ethers.utils.parseUnits(formInput.price, 'ether')
  
    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    
    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
    await transaction.wait()
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
		<h3>Body</h3>
		<input
          placeholder="Asset strength"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, strength: e.target.value })}
        />
		<input
          placeholder="Asset constitution"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, constitution: e.target.value })}
        />
		<input
          placeholder="Asset endurance"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, endurance: e.target.value })}
        />
		<input
          placeholder="Asset reflex"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, reflex: e.target.value })}
        />
		<input
          placeholder="Asset dexterity"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, dexterity: e.target.value })}
        />
		<input
          placeholder="Asset fortitude"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, fortitude: e.target.value })}
        />
		<input
          placeholder="Asset athletics"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, athletics: e.target.value })}
        />
		<h3>Mind</h3>
		<input
          placeholder="Asset intelligence"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, intelligence: e.target.value })}
        />
		<input
          placeholder="Asset wisdom"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, wisdom: e.target.value })}
        />
		<input
          placeholder="Asset charisma"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, charisma: e.target.value })}
        />
		<input
          placeholder="Asset sleight_of_hand"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, sleight_of_hand: e.target.value })}
        />
		<input
          placeholder="Asset stealth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, stealth: e.target.value })}
        />
		<input
          placeholder="Asset willpower"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, willpower: e.target.value })}
        />
		<h3>Soul</h3>
		<input
          placeholder="Asset deception"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, deception: e.target.value })}
        />
		<input
          placeholder="Asset perception"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, perception: e.target.value })}
        />
		<input
          placeholder="Asset persuasion"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, persuasion: e.target.value })}
        />
		<input
          placeholder="Asset charisma"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, charisma2: e.target.value })}
        />
		<input
          placeholder="Asset intimidation"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, intimidation: e.target.value })}
        />
		<input
          placeholder="Asset medicine"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, medicine: e.target.value })}
        />
		<input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={createMarket} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create Digital Asset
        </button>
      </div>
    </div>
  )
}