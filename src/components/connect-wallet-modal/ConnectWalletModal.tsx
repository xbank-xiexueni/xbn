import {
  Modal,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Flex,
  Text,
  Spinner,
  Box,
  Heading,
} from '@chakra-ui/react'
import { useContext, type FunctionComponent } from 'react'

import { SvgComponent } from '@/components'
import { TransactionContext } from '@/context/TransactionContext'

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
      <ModalOverlay bg='black.2' />
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
                <SvgComponent svgId='icon-metamask' svgSize='32px' />
                <Text fontWeight={'700'}>MetaMask</Text>
              </Flex>
              <SvgComponent
                svgId='icon-arrow-down'
                transform={'rotate(270deg)'}
              />
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
                  emptyColor={`gray.5`}
                  color={`blue.1`}
                  w='52px'
                  h={'52px'}
                />
                <SvgComponent
                  svgId='icon-metamask'
                  position='absolute'
                  top={'9px'}
                  left={'9px'}
                  svgSize='34px'
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
