import { Button, Text } from '@chakra-ui/react'
import { useContext } from 'react'
import { Link } from 'react-router-dom'

import { TransactionContext } from '@/context/TransactionContext'

const Home = () => {
  const { currentAccount, connectWallet, getBalance, balance } =
    useContext(TransactionContext)
  console.log('🚀 ~ file: Home.tsx:8 ~ Home ~ balance', balance)

  return (
    <>
      Home
      <Link to='/about'>to about</Link>
      {!currentAccount && <Button onClick={connectWallet}>connect</Button>}
      <Text>{currentAccount}</Text>
      {currentAccount && <Button onClick={getBalance}>get Balance</Button>}
      <Text>{balance}</Text>
    </>
  )
}

export default Home
