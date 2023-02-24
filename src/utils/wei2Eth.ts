import { ethers } from 'ethers'

import type BigNumber from 'bignumber.js'

const wei2Eth = (wei: BigNumber) => {
  try {
    return ethers.utils.formatEther(
      ethers.BigNumber.from(wei.toNumber().toString()),
    )
  } catch (error) {
    console.log('🚀 ~ file: wei2Eth.ts:7 ~ wei2Eth ~ error:', error)
    return '--'
  }
}

export default wei2Eth
