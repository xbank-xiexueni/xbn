import { useToast } from '@chakra-ui/react'
import { ethers } from 'ethers'
import isEmpty from 'lodash-es/isEmpty'
import {
  useEffect,
  useState,
  createContext,
  type ReactElement,
  useCallback,
} from 'react'

import { contractABI, contractAddress } from '@/constants'

export const TransactionContext = createContext({
  connectWallet: () => {},
  getBalance: () => {},
  currentAccount: '',
  balance: 0,
  getBalanceFromContract: () => {},
  connectLoading: false,
})

const { ethereum } = window

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer,
  )

  return transactionsContract
}

export const TransactionsProvider = ({
  children,
}: {
  children: ReactElement
}) => {
  const toast = useToast()
  const [currentAccount, setCurrentAccount] = useState('')
  const [balance, setBalance] = useState(0)

  const [connectLoading, setConnectLoading] = useState(false)

  // const getAllTransactions = async () => {
  //   try {
  //     if (ethereum) {
  //       const transactionsContract = createEthereumContract();

  //       const availableTransactions =
  //         await transactionsContract.getAllTransactions();

  //       const structuredTransactions = availableTransactions.map(
  //         (transaction) => ({
  //           addressTo: transaction.receiver,
  //           addressFrom: transaction.sender,
  //           timestamp: new Date(
  //             transaction.timestamp.toNumber() * 1000
  //           ).toLocaleString(),
  //           message: transaction.message,
  //           keyword: transaction.keyword,
  //           amount: parseInt(transaction.amount._hex) / 10 ** 18,
  //         })
  //       );

  //       console.log(structuredTransactions);

  //       setTransactions(structuredTransactions);
  //     } else {
  //       console.log('Ethereum is not present');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    if (!ethereum) return
    ethereum.on('accountsChanged', function (accounts: string[]) {
      // 一旦切换账号这里就会执行
      if (isEmpty(accounts)) {
        // setCurrentAccount('')
        window.location.reload()
        return
      }
    })
  }, [])

  const getBalance = useCallback(async () => {
    if (!currentAccount || !ethereum) return
    const provider = new ethers.providers.Web3Provider(ethereum)

    const currentBalance = await provider.getBalance(currentAccount)
    setBalance(currentBalance.toNumber())
  }, [currentAccount])

  const checkIfWalletIsConnect = useCallback(async () => {
    try {
      if (!ethereum)
        return toast({
          title: `please install metamask`,
          status: 'error',
          isClosable: true,
          duration: null,
        })

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length) {
        setCurrentAccount(accounts[0])

        // getAllTransactions();
      } else {
        setCurrentAccount('')
        console.log('No accounts found')
      }
    } catch (error) {
      setCurrentAccount('')
      console.log(error)
    }
  }, [toast])

  const connectWallet = useCallback(async () => {
    try {
      if (!ethereum)
        return toast({
          title: `please install metamask`,
          status: 'error',
          isClosable: true,
          duration: null,
        })
      setConnectLoading(true)
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })

      setCurrentAccount(accounts[0])
      setConnectLoading(false)
    } catch (error) {
      console.log(error)
      setConnectLoading(false)

      throw new Error('No ethereum object')
    }
  }, [toast])

  // const sendTransaction = async () => {
  //   try {
  //     if (!!ethereum) {
  //       const transactionsContract = createEthereumContract()
  //       // const parsedAmount = ethers.utils.parseEther(amount)

  //       // await ethereum.request({
  //       //   method: 'eth_sendTransaction',
  //       //   params: [
  //       //     {
  //       //       from: currentAccount,
  //       //       to: addressTo,
  //       //       gas: '0x5208',
  //       //       value: parsedAmount._hex,
  //       //     },
  //       //   ],
  //       // })

  //       const transactionHash = await transactionsContract.balanceOf(
  //         '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5',
  //       )

  //       setIsLoading(true)
  //       console.log(`Loading - ${transactionHash.hash}`)
  //       await transactionHash.wait()
  //       console.log(`Success - ${transactionHash.hash}`)
  //       setIsLoading(false)
  //     } else {
  //       console.log('No ethereum object')
  //     }
  //   } catch (error) {
  //     console.log(error)

  //     throw new Error('No ethereum object')
  //   }
  // }

  const getBalanceFromContract = useCallback(async () => {
    try {
      if (!!ethereum) {
        const transactionsContract = createEthereumContract()
        // const parsedAmount = ethers.utils.parseEther(amount)

        // await ethereum.request({
        //   method: 'eth_sendTransaction',
        //   params: [
        //     {
        //       from: currentAccount,
        //       to: addressTo,
        //       gas: '0x5208',
        //       value: parsedAmount._hex,
        //     },
        //   ],
        // })

        const res = await transactionsContract.balanceOf(
          '0x388C818CA8B9251b393131C08a736A67ccB19297',
        )

        const decimals = await transactionsContract.decimals()

        console.log(`Loading - ${res}-${decimals}`)
        // await transactionHash.wait()
        // console.log(`Success - ${transactionHash.hash}`)
        // setIsLoading(false)
      } else {
        console.log('No ethereum object')
      }
    } catch (error) {
      console.log(error)

      throw new Error('No ethereum object')
    }
  }, [])

  useEffect(() => {
    checkIfWalletIsConnect()
    // checkIfTransactionsExists()
  }, [checkIfWalletIsConnect])

  return (
    <TransactionContext.Provider
      value={{
        // transactionCount,
        connectWallet,
        getBalance,
        balance,
        // transactions,
        currentAccount,
        connectLoading,
        // isLoading,
        // sendTransaction,
        // handleChange,
        // formData,
        getBalanceFromContract,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
