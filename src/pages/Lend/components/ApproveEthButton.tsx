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
  useDisclosure,
} from '@chakra-ui/react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FunctionComponent,
} from 'react'
import { useNavigate } from 'react-router-dom'
import Web3 from 'web3'

import { SvgComponent } from '@/components'
import { WETH_CONTRACT_ADDRESS, XBANK_CONTRACT_ADDRESS } from '@/constants'
import { useWallet } from '@/hooks'
import { createWethContract, createXBankContract } from '@/utils/createContract'
import { wei2Eth } from '@/utils/unit-conversion'

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
      allowCollateralContract: string
    }
  }
> = ({ children, data, ...rest }) => {
  const {
    poolMaximumPercentage,
    poolMaximumDays,
    poolMaximumInterestRate,
    loanTimeConcessionFlexibility,
    loanRatioPreferentialFlexibility,
    allowCollateralContract,
  } = data
  const { getBalance, currentAccount } = useWallet()
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [amount, setAmount] = useState('')
  const [flag, setFlag] = useState(true)

  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const [currentBalance, setCurrentBalance] = useState(0)

  useEffect(() => {
    const wethContract = createWethContract()
    wethContract.methods
      .balanceOf(currentAccount)
      .call()
      .then((res: string) => {
        setCurrentBalance(Number(wei2Eth(res)))
      })
  }, [getBalance, currentAccount])

  console.log(currentBalance)

  const isError = useMemo((): boolean => {
    //  amount < balance + Has been lent
    if (amount) {
      const NumberAmount = Number(amount)
      return NumberAmount > currentBalance
    } else {
      return !flag
    }
  }, [amount, currentBalance, flag])

  const [approveLoading, setApproveLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const toast = useToast()

  const onConfirm = useCallback(async () => {
    /**
     * 平均总耗时：
     * 1676961248463 - 1676961180777 =  67686 ms ≈ 1min
     */
    console.log(new Date().getTime(), '----------------start')
    // 预计算
    const UNIT256MAX_FOR_EQ =
      '115792089237316195423570985008687907853269984665640564039457.584007913129639935'
    const UNIT256MAX =
      '115792089237316195423570985008687907853269984665640564039457584007913129639935'
    try {
      const parsedWeiAmount = Web3.utils.toWei(amount, 'wei')

      const wethContract = createWethContract()
      setApproveLoading(true)
      const _allowance = await wethContract.methods
        .allowance(currentAccount, XBANK_CONTRACT_ADDRESS)
        .call()

      const allowanceEth = wei2Eth(_allowance)
      /**
       * 如果 allowanceEth < amount 再进行  approve
       */
      if (allowanceEth !== UNIT256MAX_FOR_EQ) {
        console.log('approve 阶段')

        const approveHash = await wethContract.methods
          .approve(XBANK_CONTRACT_ADDRESS, UNIT256MAX)
          .send({
            from: currentAccount,
          })
        await approveHash.wait()
      }
      setApproveLoading(false)
      setCreateLoading(true)

      // const supportERC20Denomination = approveHash?.to
      const supportERC20Denomination = WETH_CONTRACT_ADDRESS

      const xBankContract = createXBankContract()
      await xBankContract.methods
        .createPool(
          // supportERC20Denomination
          supportERC20Denomination,
          // allowCollateralContract
          allowCollateralContract,
          // '0x8ADC4f1EFD5f71E538525191C5575387aaf41391',
          // poolAmount
          parsedWeiAmount,
          // poolMaximumPercentage,
          poolMaximumPercentage,
          // uint32 poolMaximumDays,
          poolMaximumDays,
          // uint32 poolMaximumInterestRate,
          poolMaximumInterestRate,
          // uint32 loanTimeConcessionFlexibility,
          loanTimeConcessionFlexibility,
          // uint32 loanRatioPreferentialFlexibility
          loanRatioPreferentialFlexibility,
        )
        .send({
          from: currentAccount,
        })
      setCreateLoading(false)
      console.log(new Date().getTime(), '----------------end')
      onClose()
      navigate('/lending/my-pools')
    } catch (error: any) {
      console.log(error?.message, error?.code, error?.data)
      toast({
        status: 'error',
        title: error?.code,
        description: error?.message,
        duration: 5000,
      })
      setCreateLoading(false)
      setApproveLoading(false)
    }
  }, [
    amount,
    toast,
    poolMaximumPercentage,
    poolMaximumDays,
    poolMaximumInterestRate,
    loanRatioPreferentialFlexibility,
    loanTimeConcessionFlexibility,
    allowCollateralContract,
    onClose,
    navigate,
    currentAccount,
  ])

  const handleClose = useCallback(() => {
    if (approveLoading || createLoading) return
    onClose()
  }, [onClose, approveLoading, createLoading])

  return (
    <>
      <Button onClick={onOpen} {...rest}>
        {children}
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={handleClose}
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
            <Text>Approve WETH</Text>
            <SvgComponent
              svgId='icon-close'
              onClick={handleClose}
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
                  isDisabled={approveLoading || createLoading}
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
                  Insufficient funds, Maximum input: {currentBalance}
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
            loadingText={
              approveLoading ? 'approving' : createLoading ? 'creating' : ''
            }
            isLoading={approveLoading || createLoading}
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
