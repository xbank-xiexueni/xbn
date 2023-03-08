import { useToast } from '@chakra-ui/react'
import {
  useEffect,
  useState,
  createContext,
  type ReactElement,
  useCallback,
} from 'react'

import { createWethContract, createXBankContract } from '@/utils/createContract'

export const TransactionContext = createContext({
  connectWallet: () => {},
  currentAccount: '',
  connectLoading: false,
  handleSwitchNetwork: async () => {},
  wethContract: {},
  xBankContract: {},
})

const { ethereum } = window

export const TransactionsProvider = ({
  children,
}: {
  children: ReactElement
}) => {
  const toast = useToast()
  const [currentAccount, setCurrentAccount] = useState('')

  const [connectLoading, setConnectLoading] = useState(false)

  const handleSwitchNetwork = useCallback(async () => {
    if (!ethereum) {
      return
    }
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: import.meta.env.VITE_TARGET_CHAIN_ID }],
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        toast({
          status: 'error',
          title: 'please add Ethereum Chain',
        })
        // try {
        //   await ethereum.request({
        //     method: 'wallet_addEthereumChain',
        //     params: [
        //       {
        //         chainId: '0xf00',
        //         chainName: '...',
        //         rpcUrls: ['https://...'] /* ... */,
        //       },
        //     ],
        //   })
        // } catch (addError) {
        //   // handle "add" error
        // }
      } else {
        console.log(switchError)
        toast({
          status: 'info',
          title: 'please switch Ethereum Chain first',
        })
      }
    }
  }, [toast])

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
    ethereum.on('chainChanged', () => {
      window.location.reload()
      setCurrentAccount('')
    })
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
      if (ethereum.chainId !== import.meta.env.VITE_TARGET_CHAIN_ID) {
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
      if (ethereum.chainId !== import.meta.env.VITE_TARGET_CHAIN_ID) {
        await handleSwitchNetwork()
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
  }, [toast, handleSwitchNetwork])

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

  // const [xBankContract, setXbankContract] = useState<Contract<any>>()
  // const [wethContract, setWethContract] = useState()

  useEffect(() => {
    checkIfWalletIsConnect()

    // checkIfTransactionsExists()
  }, [checkIfWalletIsConnect])

  return (
    <TransactionContext.Provider
      value={{
        // transactionCount,
        connectWallet,
        // transactions,
        currentAccount,
        connectLoading,
        // isLoading,
        // sendTransaction,
        // handleChange,
        // formData,
        handleSwitchNetwork,
        wethContract: createWethContract(),
        xBankContract: createXBankContract(),
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
