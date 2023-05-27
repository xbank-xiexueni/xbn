import BigNumber from 'bignumber.js'

import { FORMAT_NUMBER } from '@/constants'

const formatAddress = (address: string) => {
  if (!address) return ''
  if (address?.length <= 9) return address
  return `${address.substring(0, 5)}...${address
    .toString()
    .substring(address.length - 4, address.length)}`
}
const getFullNum = (num: number) => {
  //处理非数字
  if (isNaN(num)) {
    return num
  }

  //处理不需要转换的数字
  const str = '' + num
  if (!/e/i.test(str)) {
    return num
  }

  return num.toFixed(18).replace(/\.?0+$/, '')
}
const formatFloat = (x: number | string | BigNumber, y?: number) => {
  const xx = BigNumber.isBigNumber(x)
    ? x.toNumber()
    : typeof x === 'string'
    ? Number(x)
    : x
  const yy = y || FORMAT_NUMBER
  const f = Math.round(xx * 10 ** yy) / 10 ** yy
  const s = getFullNum(f).toString()
  return s
}

export { formatAddress, formatFloat }
