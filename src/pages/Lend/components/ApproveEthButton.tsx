import {
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
  type ButtonProps,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  NumberInputField,
  NumberInput,
  useToast,
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FunctionComponent,
} from 'react'

import { SvgComponent } from '@/components'
import { UNIT } from '@/constants'
import { useWallet } from '@/hooks'
import createEthereumContract from '@/utils/createEthereumContract'

// const DataItem: FunctionComponent<{ label: string; data: number }> = ({
//   label,
//   data,
// }) => {
//   return (
//     <Box textAlign={'center'}>
//       <Text fontWeight={'medium'} color={`var(--chakra-colors-gray-3)`}>
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

const ApproveEthButton: FunctionComponent<
  ButtonProps & {
    data: {
      poolMaximumPercentage: number
      poolMaximumDays: number
      poolMaximumInterestRate: number
      loanTimeConcessionFlexibility: number
      loanRatioPreferentialFlexibility: number
    }
  }
> = ({ children, ...rest }) => {
  const { isOpen, onOpen, onClose, getBalance, balance, currentAccount } =
    useWallet()
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
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const onConfirm = useCallback(async () => {
    const parsedAmount = ethers.utils.parseEther(amount.toString())
    console.log(
      '🚀 ~ file: ApproveEthButton.tsx:92 ~ onConfirm ~ parsedAmount',
      parsedAmount,
    )

    const transactionsContract = createEthereumContract()
    try {
      setIsLoading(true)
      const transactionHash = await transactionsContract.createPool(
        currentAccount,
        // supportERC20Denomination
        '0x8ADC4f1EFD5f71E538525191C5575387aaf41391',
        // allowCollateralContract
        '0x8ADC4f1EFD5f71E538525191C5575387aaf41391',
        // poolAmount
        1,
        // poolMaximumPercentage,
        450,
        // uint32 poolMaximumDays,
        1,
        // uint32 poolMaximumInterestRate,
        1,
        // uint32 loanTimeConcessionFlexibility,
        1,
        // uint32 loanRatioPreferentialFlexibility
        1,
      )
      console.log(`Loading - ${transactionHash.hash}`)
      await transactionHash.wait()
      console.log(`Success - ${transactionHash.hash}`)
      setIsLoading(false)
    } catch (error: any) {
      console.log(error?.message, error?.code, error?.data)
      toast({
        status: 'error',
        title: error?.code,
        duration: 5000,
      })
      setIsLoading(false)
    }
    // return
  }, [amount, currentAccount, toast])

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
        <ModalOverlay bg='black.2' />
        <ModalContent maxW='576px' px={10}>
          <ModalHeader
            pt={10}
            px={0}
            alignItems='center'
            display={'flex'}
            justifyContent='space-between'
          >
            <Text>Approve {UNIT}</Text>
            <SvgComponent
              svgId='icon-close'
              onClick={onClose}
              cursor='pointer'
            />
          </ModalHeader>
          <ModalBody pb={6} px={0}>
            {/* 数值们 */}
            {/* <Flex
              py={8}
              px={9}
              bg={`var(--chakra-colors-gray-5)`}
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
                  <SvgComponent svgId='icon-eth' />
                </InputLeftElement>
                <NumberInput
                  w='100%'
                  value={amount}
                  onChange={(v) => {
                    setFlag(false)
                    setAmount(v)
                  }}
                  errorBorderColor='red.1'
                  isInvalid={isError}
                  // lineHeight='60px'
                  borderRadius={8}
                  borderColor='gray.3'
                  placeholder='Enter the approve ETH amount...'
                >
                  <NumberInputField
                    h='60px'
                    px={8}
                    _focus={{
                      borderColor: 'blue.1',
                    }}
                    _focusVisible={{
                      boxShadow: `0 0 0 1px var(--chakra-colors-blue-1)`,
                    }}
                  />
                </NumberInput>

                {isError && (
                  <InputRightElement top='10px'>
                    <SvgComponent svgId='icon-error' />
                  </InputRightElement>
                )}
              </InputGroup>

              {isError && (
                <Text mt={2} color='red.1'>
                  Insufficient funds, Maximum input: {balance}
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
            onClick={onConfirm}
            isLoading={isLoading}
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
