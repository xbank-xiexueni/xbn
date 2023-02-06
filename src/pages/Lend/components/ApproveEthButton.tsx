import {
  useDisclosure,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  Button,
  ModalHeader,
  FormControl,
  FormLabel,
  Flex,
  Box,
  Text,
  Image,
} from '@chakra-ui/react'
import { useRef } from 'react'

import { InputWithIcon } from '@/components'
import COLORS from '@/utils/Colors'

import IconClose from '@/assets/icon/icon-close.svg'
import IconEth from '@/assets/icon/icon-eth.svg'

import type { ButtonProps } from '@chakra-ui/react'
import type { FunctionComponent } from 'react'

const DataItem: FunctionComponent<{ label: string; data: number }> = ({
  label,
  data,
}) => {
  return (
    <Box textAlign={'center'}>
      <Text fontWeight={'medium'} color={COLORS.secondaryTextColor}>
        {label}
      </Text>
      <Flex alignItems={'center'} mt={2} justify='center'>
        <Image src={IconEth} w={2} />
        <Text fontSize={'lg'} fontWeight='bold'>
          &nbsp;{data}
        </Text>
      </Flex>
    </Box>
  )
}

const ApproveEthButton: FunctionComponent<ButtonProps> = ({
  children,
  ...rest
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = useRef(null)
  const finalRef = useRef(null)

  return (
    <>
      <Button onClick={onOpen} {...rest}>
        {children}
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent maxW='576px' px={10}>
          <ModalHeader
            pt={10}
            px={0}
            alignItems='center'
            display={'flex'}
            justifyContent='space-between'
          >
            <Text>Approve ETH</Text>
            <Image src={IconClose} onClick={onClose} cursor='pointer' />
          </ModalHeader>
          <ModalBody pb={6} px={0}>
            {/* 数值们 */}
            <Flex
              py={8}
              px={9}
              bg={COLORS.secondaryBgc}
              borderRadius={16}
              justify='space-between'
            >
              <DataItem label='Your balance' data={0} />
              <DataItem label='Has been lent' data={0} />
              <DataItem label='Can be lent' data={0} />
            </Flex>
            <FormControl>
              <FormLabel>Amount</FormLabel>
              <InputWithIcon
                placeholder='Enter the approve ETH amount...'
                icon={IconEth}
                h='60px'
                borderRadius={8}
                iconProps={{
                  top: 4,
                  left: 4,
                }}
                type='number'
                errorBorderColor={COLORS.errorColor}
                isInvalid={true}
              />
              {true && (
                <Text mt={2} color={COLORS.errorColor}>
                  Insufficient funds，Maximum input：xxx
                </Text>
              )}
            </FormControl>
          </ModalBody>

          {/* <ModalFooter justifyContent={'center'}> */}
          <Button variant='primary' mr={3} mt={2} mb={10} mx={10} h='52px'>
            Approve
          </Button>
          {/* </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  )
}

export default ApproveEthButton
