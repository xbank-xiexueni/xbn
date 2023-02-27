import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

const wei2Eth = (wei: BigNumber | number | string) => {
  try {
    let weiStr = wei
    if (BigNumber.isBigNumber(weiStr)) {
      weiStr = weiStr.integerValue().toNumber().toString()
    } else if (typeof weiStr === 'number') {
      weiStr = wei.toString()
    }

    return ethers.utils.formatEther(ethers.BigNumber.from(weiStr))
  } catch (error) {
    console.log('🚀 ~ file: wei2Eth.ts:7 ~ wei2Eth ~ error:', error)
    return '--'
  }
}

export default wei2Eth
