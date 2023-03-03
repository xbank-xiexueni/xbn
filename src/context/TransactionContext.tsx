import { useToast } from '@chakra-ui/react'
import {
  useEffect,
  useState,
  createContext,
  type ReactElement,
  useCallback,
} from 'react'
import Web3 from 'web3'

import { createWeb3Provider } from '@/utils/createContract'

export const TransactionContext = createContext({
  connectWallet: () => {},
  getBalance: async (address: string) => {
    console.log(
      '🚀 ~ file: TransactionContext.tsx:15 ~ getBalance: ~ address:',
      address,
    )
    return 0
  },
  currentAccount: '',
  connectLoading: false,
  isSupportedChain: false,
  chainId: '',
})

const { ethereum } = window

export const TransactionsProvider = ({
  children,
}: {
  children: ReactElement
}) => {
  const toast = useToast()
  const [currentAccount, setCurrentAccount] = useState('')
  const [isSupportedChain, setIsSupportedChain] = useState(false)

  const [connectLoading, setConnectLoading] = useState(false)

  // const getAllTransactions = async () => {
  //   try {
  //     if (ethereum) {
  //       const transactionsContract = createXBankContract();

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
    setIsSupportedChain(['0x1', '0x5'].includes(ethereum.chainId))

    ethereum.on('accountsChanged', function () // accounts: string[]
    {
      // 一旦切换账号这里就会执行
      window.location.reload()
      // if (isEmpty(accounts)) {
      //   // setCurrentAccount('')
      //   window.location.reload()
      //   return
      // }
    })
    ethereum.on('chainChanged', (_chainId: string) => {
      window.location.reload()
      setIsSupportedChain(['0x1', '0x5'].includes(_chainId))
    })
  }, [])

  const getBalance = useCallback(async (address: string) => {
    const provider = createWeb3Provider()

    const currentBalance = await provider.eth.getBalance(address)
    console.log(
      '🚀 ~ file: TransactionContext.tsx:89 ~ getBalance ~ currentBalance:',
      currentBalance,
    )

    return Number(Web3.utils.fromWei(currentBalance, 'ether'))
  }, [])

  const checkIfWalletIsConnect = useCallback(async () => {
    try {
      if (!ethereum) {
        toast.closeAll()
        toast({
          title: `please install metamask`,
          status: 'error',
          isClosable: true,
        })
        return
      }

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
      if (!ethereum) {
        toast.closeAll()
        toast({
          title: `please install metamask`,
          status: 'error',
          isClosable: true,
        })
        return
      }

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
  //       const transactionsContract = createXBankContract()
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
        // transactions,
        currentAccount,
        connectLoading,
        // isLoading,
        // sendTransaction,
        // handleChange,
        // formData,
        isSupportedChain,
        chainId: ethereum.chainId,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
