import { useDisclosure } from '@chakra-ui/react'
import { useCallback, useContext } from 'react'

import { TransactionContext } from '@/context/TransactionContext'

export const useWallet = () => {
  const { currentAccount, ...rest } = useContext(TransactionContext)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const interceptFn = useCallback(
    (fn?: () => void) => {
      // 判断是否连接钱包
      if (!currentAccount) {
        onOpen()
        return
      }
      if (fn) {
        fn()
      }
    },
    [currentAccount, onOpen],
  )
  return {
    isOpen,
    onOpen,
    onClose,
    interceptFn,
    currentAccount,
    ...rest,
  }
}

export default useWallet
