import BigNumber from 'bignumber.js'

import { FORMAT_NUMBER } from '@/constants'

const formatAddress = (address: string) => {
  if (!address) return ''
  if (address?.length <= 9) return address
  return `${address.substring(0, 5)}...${address
    .toString()
    .substring(address.length - 4, address.length)}`
}

const formatFloat = (x: number | string | BigNumber, y?: number) => {
  const xx = BigNumber.isBigNumber(x)
    ? x.toNumber()
    : typeof x === 'string'
    ? Number(x)
    : x
  const yy = y || FORMAT_NUMBER
  const f = Math.round(xx * 10 ** yy) / 10 ** yy
  const s = f.toString()
  return s
}

export { formatAddress, formatFloat }
