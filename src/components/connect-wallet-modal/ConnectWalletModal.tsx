import {
  Modal,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Flex,
  Image,
  Text,
  Spinner,
  Box,
  Heading,
} from '@chakra-ui/react'
import { useContext, type FunctionComponent } from 'react'

import { TransactionContext } from '@/context/TransactionContext'
import COLORS from '@/utils/Colors'

import IconMetamask from '@/assets/icon/icon-metamask.svg'

type IndexProps = {
  visible: boolean
  handleClose: () => void
}
const Index: FunctionComponent<IndexProps> = ({ visible, handleClose }) => {
  const { connectWallet, connectLoading, currentAccount } =
    useContext(TransactionContext)

  if (!!currentAccount) {
    return null
  }

  return (
    <Modal onClose={handleClose} isOpen={visible} isCentered>
      <ModalOverlay bg='rgba(27, 34, 44, 0.4)' />
      <ModalContent>
        {!connectLoading && !currentAccount && (
          <ModalHeader>Connect Wallet</ModalHeader>
        )}
        <ModalCloseButton />
        <ModalBody>
          {!connectLoading && !currentAccount ? (
            <Flex
              justify={'space-between'}
              alignItems='center'
              py={6}
              mt={2}
              mb={4}
              cursor='pointer'
              onClick={connectWallet}
            >
              <Flex alignItems={'center'} gap={4}>
                <Image src={IconMetamask} />
                <Text fontWeight={'700'}>MetaMask</Text>
              </Flex>
              <Text>&gt;</Text>
            </Flex>
          ) : (
            <Flex
              mt={16}
              justify='center'
              gap={4}
              flexWrap='wrap'
              textAlign={'center'}
            >
              <Box position={'relative'}>
                <Spinner
                  thickness='2px'
                  speed='1s'
                  emptyColor={COLORS.secondaryBgc}
                  color={COLORS.primaryColor}
                  w='52px'
                  h={'52px'}
                />
                <Image
                  src={IconMetamask}
                  position='absolute'
                  top={2.5}
                  left={2.5}
                />
              </Box>

              <Heading size={'xl'} w='100%'>
                Confirm Wallet
              </Heading>
              <Text mb={10} mx={16}>
                Please sign into MetaMask to connect to xBank
              </Text>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default Index
