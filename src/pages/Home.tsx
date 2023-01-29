import { Button, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TransactionContext } from '../context/TransactionContext';

const Home = () => {
  const { currentAccount, connectWallet } = useContext(TransactionContext);

  return (
    <>
      Home
      <Link to='/about'>to about</Link>
      {!currentAccount && <Button onClick={connectWallet}>connect</Button>}
      <Text>{currentAccount}</Text>
    </>
  );
};

export default Home;
