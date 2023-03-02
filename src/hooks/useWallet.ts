import { useDisclosure } from '@chakra-ui/react'
import { useCallback, useContext } from 'react'

import { TransactionContext } from '@/context/TransactionContext'

export const useWallet = () => {
  const { currentAccount, isSupportedChain, ...rest } =
    useContext(TransactionContext)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const interceptFn = useCallback(
    (fn?: () => void) => {
      // 判断是否连接钱包
      if (!currentAccount) {
        onOpen()
        return
      }
      if (!isSupportedChain) {
        console.warn('chainId warn')
        return
      }
      if (fn) {
        fn()
      }
    },
    [currentAccount, onOpen, isSupportedChain],
  )
  return {
    isOpen,
    onOpen,
    onClose,
    interceptFn,
    currentAccount,
    isSupportedChain,
    ...rest,
  }
}

export default useWallet
