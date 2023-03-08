import BigNumber from 'bignumber.js'
import * as web3Utils from 'web3-utils'

const wei2Eth = (wei: BigNumber | number | string) => {
  try {
    let weiStr = wei
    if (BigNumber.isBigNumber(weiStr)) {
      weiStr = weiStr.integerValue().toNumber().toString()
    } else if (typeof weiStr === 'number') {
      weiStr = wei.toString()
    }

    return web3Utils.fromWei(weiStr, 'ether')
  } catch (error) {
    console.log('🚀 ~ file: wei2Eth.ts:7 ~ wei2Eth ~ error:', error)
    return '--'
  }
}
const eth2Wei = (eth: number | string) => {
  try {
    const ethStr = eth.toString()

    return web3Utils.toWei(ethStr, 'ether')
  } catch (error) {
    console.log('🚀 ~ file: wei2Eth.ts:7 ~ wei2Eth ~ error:', error)
    return '--'
  }
}

export { wei2Eth, eth2Wei }
