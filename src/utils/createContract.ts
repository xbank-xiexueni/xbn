import { ethers } from 'ethers'

import {
  XBANK_CONTRACT_ABI,
  XBANK_CONTRACT_ADDRESS,
  WETH_CONTRACT_ABI,
  WETH_CONTRACT_ADDRESS,
} from '@/constants'

const { ethereum } = window
const createXBankContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const transactionsContract = new ethers.Contract(
    XBANK_CONTRACT_ADDRESS,
    XBANK_CONTRACT_ABI,
    signer,
  )

  return transactionsContract
}

const createWethContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(
    WETH_CONTRACT_ADDRESS,
    WETH_CONTRACT_ABI,
    signer,
  )

  return contract
}

export { createXBankContract, createWethContract }
