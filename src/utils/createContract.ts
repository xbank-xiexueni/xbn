import { ethers } from 'ethers'

import {
  xBankContractAbi,
  xBankContractAddress,
  wethContractAbi,
  wethContractAddress,
} from '@/constants'

const { ethereum } = window
const createXBankContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const transactionsContract = new ethers.Contract(
    xBankContractAddress,
    xBankContractAbi,
    signer,
  )

  return transactionsContract
}

const createWethContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(
    wethContractAddress,
    wethContractAbi,
    signer,
  )

  return contract
}

export { createXBankContract, createWethContract }
