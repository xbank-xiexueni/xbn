import { useToast } from '@chakra-ui/react'
import { useLocalStorageState, useRequest } from 'ahooks'
import debounce from 'lodash-es/debounce'
import isEmpty from 'lodash-es/isEmpty'
import {
  useEffect,
  useState,
  createContext,
  type ReactElement,
  useCallback,
  useMemo,
} from 'react'

import { apiGetActiveCollection } from '@/api'
import { useNftCollectionsByContractAddressesQuery } from '@/hooks'

const COLLECTION_DEMO = {
  contractAddress: '',
  nftCollection: {
    assetsCount: 0,
    bannerImageUrl: '',
    chatUrl: '',
    createdAt: '2023-02-23T08:35:14Z',
    createdDate: '2022-12-12T08:18:30Z',
    description: '',
    discordUrl: '',
    externalUrl: '',
    featuredImageUrl: '',
    fees: [],
    id: 0,
    imagePreviewUrl: '',
    imageThumbnailUrl: '',
    imageUrl: '',
    instagramUsername: '',
    largeImageUrl: '',
    mediumUsername: '',
    name: '',
    nftCollectionStat: {
      averagePrice: 0,
      count: 0,
      createdAt: '',
      floorPrice: 0,
      floorPriceRate: 0,
      id: 0,
      marketCap: 0,
      numOwners: 0,
      numReports: 0,
      oneDayAveragePrice: 0,
      oneDayChange: 0,
      oneDaySales: 0,
      oneDayVolume: 0,
      sevenDayAveragePrice: 0,
      sevenDayChange: 0,
      sevenDaySales: 0,
      sevenDayVolume: 0,
      thirtyDayAveragePrice: 0,
      thirtyDayChange: 0,
      thirtyDaySales: 0,
      thirtyDayVolume: 0,
      totalSales: 0,
      totalSupply: 0,
      totalVolume: 0,
      updatedAt: '',
      __typename: 'NFTCollectionStat',
    },
    onlyProxiedTransfers: false,
    openseaBuyerFeeBasisPoints: '0',
    openseaSellerFeeBasisPoints: '50',
    payoutAddress: '',
    safelistRequestStatus: '',
    shortDescription: '',
    slug: '',
    subscriberCount: 0,
    telegramUrl: '',
    twitterUsername: '',
    updatedAt: '',
    wikiUrl: '',
    nftCollectionMetaData: {
      subscribe: false,
      subscribeCount: 0,
      __typename: 'NFTCollectionMetaData',
    },
  },
}

export const TransactionContext = createContext({
  connectWallet: () => {},
  currentAccount: '',
  connectLoading: false,
  handleSwitchNetwork: async () => {},
  handleDisconnect: () => {},
  collectionList: [{ ...COLLECTION_DEMO, __typename: 'NFTCollection' }],
  collectionLoading: false,
})

const { ethereum } = window

export const TransactionsProvider = ({
  children,
}: {
  children: ReactElement
}) => {
  // collection 提取到外层
  const [collectionAddressArr, setCollectionAddressArr] = useState<string[]>([])
  const { loading } = useRequest(apiGetActiveCollection, {
    debounceWait: 100,
    retryCount: 5,
    onSuccess: (data) => {
      setCollectionAddressArr(data.map((i) => i.contract_addr))
    },
  })

  const { loading: collectionLoading, data: collectionData } =
    useNftCollectionsByContractAddressesQuery({
      variables: {
        assetContractAddresses: collectionAddressArr,
      },
      skip: isEmpty(collectionAddressArr),
    })
  const collectionList = useMemo(() =>
    // collectionAddressArr.map((item) => {
    //   return {
    //     contractAddress: item,
    //     nftCollection:
    //       collectionData?.nftCollectionsByContractAddresses?.find(
    //         (i) => i.contractAddress.toLowerCase() === item.toLowerCase(),
    //       )?.nftCollection,
    //   }
    // }),
    {
      return collectionData?.nftCollectionsByContractAddresses || []
    }, [collectionData])

  const toast = useToast()

  const [connectLoading, setConnectLoading] = useState(false)
  const [currentAccount, setCurrentAccount] = useLocalStorageState<string>(
    'metamask-connect-address',
    {
      defaultValue: '',
    },
  )

  const checkIfWalletIsConnect = useCallback(async () => {
    try {
      if (window.location.pathname === '/xlending/demo') return
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
    }
  }, [toast, setCurrentAccount])

  const handleSwitchNetwork = useCallback(async () => {
    if (!ethereum) {
      return
    }
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: import.meta.env.VITE_TARGET_CHAIN_ID }],
      })
      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length) {
        setCurrentAccount(accounts[0])
        // getAllTransactions();
      } else {
        setConnectLoading(true)
        const requestedAccounts = await ethereum.request({
          method: 'eth_requestAccounts',
        })

        setCurrentAccount(requestedAccounts[0])
        setConnectLoading(false)
      }
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
        toast({
          status: 'info',
          title: 'please switch Ethereum Chain first',
        })
      }
    }
  }, [toast, setCurrentAccount])

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

    ethereum.on('accountsChanged', () => {
      // 一旦切换账号这里就会执行
      debounce(() => {
        window.location.reload()
      }, 100)()
      // if (isEmpty(accounts)) {
      //   // setCurrentAccount('')
      //   window.location.reload()
      //   return
      // }
    })
    // ethereum.on('chainChanged', () => {
    //   alert('reload chainChanged')
    //   window.location.reload()
    //   setCurrentAccount('')
    // })
    // ethereum.on('disconnect', () => {
    //   debounce(() => {
    //     window.location.reload()
    //     setCurrentAccount('')
    //   }, 100)()
    // })
  }, [])

  const connectWallet = useCallback(async () => {
    try {
      if (window.location.pathname === '/xlending/demo') return

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
  }, [toast, handleSwitchNetwork, setCurrentAccount])

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
        // transactions,
        currentAccount,
        connectLoading,
        // isLoading,
        // sendTransaction,
        // handleChange,
        // formData,
        handleSwitchNetwork,
        handleDisconnect: () => setCurrentAccount(''),
        // @ts-ignore
        collectionList,
        collectionLoading: loading || collectionLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
