const formatAddress = (address: string) => {
  if (!address) return ''
  if (address?.length <= 9) return address
  return `${address.substring(0, 5)}...${address
    .toString()
    .substring(address.length - 4, address.length)}`
}

export default formatAddress
