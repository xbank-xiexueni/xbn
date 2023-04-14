// @ts-nocheck
import Web3 from 'web3/dist/web3.min.js'

import {
  XBANK_CONTRACT_ABI,
  XBANK_CONTRACT_ADDRESS,
  WETH_CONTRACT_ABI,
  WETH_CONTRACT_ADDRESS,
} from '@/constants'

export type AbiType =
  | 'function'
  | 'constructor'
  | 'event'
  | 'fallback'
  | 'receive'
export type StateMutabilityType = 'pure' | 'view' | 'nonpayable' | 'payable'

export interface AbiItem {
  anonymous?: boolean
  constant?: boolean
  inputs?: AbiInput[]
  name?: string
  outputs?: AbiOutput[]
  payable?: boolean
  stateMutability?: StateMutabilityType
  type: AbiType
  gas?: number
}

export interface AbiInput {
  name: string
  type: string
  indexed?: boolean
  components?: AbiInput[]
  internalType?: string
}

export interface AbiOutput {
  name: string
  type: string
  components?: AbiOutput[]
  internalType?: string
}

const { ethereum } = window
export const createWeb3Provider = () => {
  const web3 = new Web3(ethereum)

  return web3
}
const createXBankContract = () => {
  // const provider = new ethers.providers.Web3Provider(ethereum)
  // const signer = provider.getSigner()
  // const transactionsContract = new ethers.Contract(
  //   XBANK_CONTRACT_ADDRESS,
  //   XBANK_CONTRACT_ABI,
  //   signer,
  // )
  const web3 = createWeb3Provider()
  const contract = new web3.eth.Contract(
    XBANK_CONTRACT_ABI as AbiItem[],
    XBANK_CONTRACT_ADDRESS,
  )

  return contract
}

const createWethContract = () => {
  const web3 = createWeb3Provider()
  const contract = new web3.eth.Contract(
    WETH_CONTRACT_ABI as AbiItem[],
    WETH_CONTRACT_ADDRESS,
  )

  return contract
}

// const setAssetApprovalForAll = async (contractAddress, gasPrice, gasLimit) => {
//   // console.log(`contract_address: ${contractAddress}, token_id: ${tokenId}, gas_price: ${gasLimit} ${gasPrice}`)
//   const contract = new Web3.eth.Contract(ERC1155ABI, contractAddress)
//   const contractData = contract.methods
//     .setApprovalForAll(OPENSEA_CONDUIT_ADDRESS, true)
//     .encodeABI()
//   const accountNonce = await Web3.eth.getTransactionCount(signer.address)
//   const signedTx = await Web3.eth.accounts.signTransaction(
//     {
//       nonce: web3.utils.toHex(accountNonce),
//       gasPrice: web3.utils.toHex(gasPrice),
//       gasLimit: web3.utils.toHex(gasLimit),
//       to: contractAddress,
//       value: '0x00',
//       data: contractData,
//       chainId: chainId,
//     },
//     '0x' + conf.buyer.privKey,
//   )
//   const hash = signedTx.transactionHash
//   // console.log(`hash: ${hash}`)
//   await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
//   return hash
// }

export { createXBankContract, createWethContract }
