const formatAddress = (address: string) => {
  if (!address) return ''
  if (address?.length <= 9) return address
  return `${address.substring(0, 5)}...${address
    .toString()
    .substring(address.length - 4, address.length)}`
}

const formatFloat = (x: number, y: number) => {
  const f = Math.round(x * 10 ** y) / 10 ** y
  const s = f.toString()
  return s
}

export { formatAddress, formatFloat }
