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
  // Flex,
  // Box,
  Text,
  Image,
  type ButtonProps,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  NumberInputField,
  NumberInput,
} from '@chakra-ui/react'
import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FunctionComponent,
} from 'react'

import { TransactionContext } from '@/context/TransactionContext'
import COLORS from '@/utils/Colors'

import IconClose from '@/assets/icon/icon-close.svg'
import IconError from '@/assets/icon/icon-error.svg'
import IconEth from '@/assets/icon/icon-eth.svg'

// const DataItem: FunctionComponent<{ label: string; data: number }> = ({
//   label,
//   data,
// }) => {
//   return (
//     <Box textAlign={'center'}>
//       <Text fontWeight={'medium'} color={COLORS.secondaryTextColor}>
//         {label}
//       </Text>
//       <Flex alignItems={'center'} mt={2} justify='center'>
//         <Image src={IconEth} w={2} />
//         <Text fontSize={'lg'} fontWeight='bold'>
//           &nbsp;{data}
//         </Text>
//       </Flex>
//     </Box>
//   )
// }

const ApproveEthButton: FunctionComponent<ButtonProps> = ({
  children,
  ...rest
}) => {
  const { getBalance, balance } = useContext(TransactionContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [amount, setAmount] = useState('')
  const [flag, setFlag] = useState(true)

  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const isError = useMemo((): boolean => {
    //  amount < balance + Has been lent
    if (amount) {
      const NumberAmount = Number(amount)
      return NumberAmount > balance
    } else {
      return !flag
    }
  }, [amount, balance, flag])

  useEffect(() => {
    getBalance()
  }, [getBalance])

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
        <ModalOverlay bg='rgba(27, 34, 44, 0.4)' />
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
            {/* <Flex
              py={8}
              px={9}
              bg={COLORS.secondaryBgc}
              borderRadius={16}
              justify='space-between'
            >
              <DataItem label='Your balance' data={0} />
              <DataItem label='Has been lent' data={0} />
              <DataItem label='Can be lent' data={0} />
            </Flex> */}
            <FormControl>
              <FormLabel>Amount</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.300'
                  fontSize='1.2em'
                  top='10px'
                >
                  <Image src={IconEth} />
                </InputLeftElement>
                <NumberInput
                  w='100%'
                  value={amount}
                  onChange={(v) => {
                    setFlag(false)
                    setAmount(v)
                  }}
                  errorBorderColor={COLORS.errorColor}
                  isInvalid={isError}
                  // lineHeight='60px'
                  borderRadius={8}
                  borderColor={COLORS.secondaryTextColor}
                  placeholder='Enter the approve ETH amount...'
                >
                  <NumberInputField
                    h='60px'
                    px={8}
                    _focus={{
                      borderColor: COLORS.primaryColor,
                    }}
                    _focusVisible={{
                      boxShadow: `0 0 0 1px ${COLORS.primaryColor}`,
                    }}
                  />
                </NumberInput>

                {isError && (
                  <InputRightElement top='10px'>
                    <Image src={IconError} />
                  </InputRightElement>
                )}
              </InputGroup>

              {isError && (
                <Text mt={2} color={COLORS.errorColor}>
                  Insufficient funds，Maximum input: {balance}
                </Text>
              )}
            </FormControl>
          </ModalBody>

          {/* <ModalFooter justifyContent={'center'}> */}
          <Button
            variant='primary'
            mr={3}
            mt={2}
            mb={10}
            mx={10}
            h='52px'
            isDisabled={isError || !Number(amount)}
          >
            Approve
          </Button>
          {/* </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  )
}

export default ApproveEthButton
