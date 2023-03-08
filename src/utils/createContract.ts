// @ts-nocheck
import Web3 from 'web3'

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

const createXBankContract: () => Contract<any> = () => {
  const web3Provider = new Web3()
  web3Provider.setProvider(ethereum)
  return new web3Provider.eth.Contract(
    XBANK_CONTRACT_ABI as AbiItem[],
    XBANK_CONTRACT_ADDRESS,
  )
  // Contract.setProvider(ethereum)

  // return new Contract(XBANK_CONTRACT_ABI as AbiItem[], XBANK_CONTRACT_ADDRESS)
}

const createWethContract: () => Contract<any> = () => {
  const web3Provider = new Web3()
  web3Provider.setProvider(ethereum)
  return new web3Provider.eth.Contract(
    WETH_CONTRACT_ABI as AbiItem[],
    WETH_CONTRACT_ADDRESS,
  )
}
const web3Provider = new Web3()
web3Provider.setProvider(ethereum)

export { createXBankContract, createWethContract, web3Provider }
