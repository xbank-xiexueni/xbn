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
      <ModalContent
        maxW={{
          xl: 'md',
          lg: 'md',
          md: 'md',
          sm: '326px',
          xs: '326px',
        }}
        p={'40px'}
      >
        {!connectLoading && !currentAccount && (
          <ModalHeader p={0}>Connect Wallet</ModalHeader>
        )}
        <ModalCloseButton />
        <ModalBody m={0} p={0}>
          {!connectLoading && !currentAccount ? (
            <Flex
              justify={'space-between'}
              alignItems='center'
              cursor='pointer'
              onClick={connectWallet}
              pt={'52px'}
            >
              <Flex alignItems={'center'} gap='16px'>
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
              gap='16px'
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
              <Text mx={'40px'}>
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
