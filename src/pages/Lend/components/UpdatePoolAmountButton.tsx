import {
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  Button,
  ModalHeader,
  FormControl,
  FormLabel,
  Text,
  type ButtonProps,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  NumberInputField,
  NumberInput,
  useToast,
  useDisclosure,
  Flex,
} from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
import {
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
  type FunctionComponent,
} from 'react'

import { ConnectWalletModal, SvgComponent } from '@/components'
import { useWallet } from '@/hooks'
import { createWethContract, createXBankContract } from '@/utils/createContract'
import { formatFloat } from '@/utils/format'
import { eth2Wei, wei2Eth } from '@/utils/unit-conversion'

import AmountItem from './AmountItem'

/**
 * update pool amount
 * use updatePool
 */
const UpdatePoolAmountButton: FunctionComponent<
  ButtonProps & {
    data: {
      poolID: number
      poolUsedAmount: number
      floorPrice: number
      poolAmount: number
    }
    onSuccess: () => void
  }
> = ({ children, data, onSuccess, ...rest }) => {
  const { poolUsedAmount, poolID, floorPrice, poolAmount } = data
  const toast = useToast()
  const { currentAccount, interceptFn, isOpen, onClose } = useWallet()
  const {
    isOpen: isOpenUpdate,
    onOpen: onOpenUpdate,
    onClose: onCloseUpdate,
  } = useDisclosure()

  const [updateLoading, setUpdateLoading] = useState(false)

  const [amount, setAmount] = useState('')

  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const [errorMsg, setErrorMsg] = useState('')
  const fetchLatestWethBalance = useCallback(async () => {
    const wethContract = createWethContract()
    return await wethContract.methods.balanceOf(currentAccount).call()
  }, [currentAccount])

  const { loading: refreshLoading, data: wethData } = useRequest(
    fetchLatestWethBalance,
    {
      retryCount: 5,
      ready: !!currentAccount,
    },
  )

  /**
   * Your balance = LP设定的数值
   * Has been lent = 这个pool当前进行中的贷款，尚未归还的本金金额
   * Can ben lent=Your balance - Has been lent （如果相减结果为负数，则显示0）
   */
  const AmountDataItems = useMemo(
    () => [
      {
        data: amount || '--',
        label: 'Your balance',
        loading: false,
      },
      {
        data: poolUsedAmount ? wei2Eth(poolUsedAmount) : 0,
        label: 'Has been lent',
        loading: false,
      },
      {
        data: poolUsedAmount
          ? Number(amount) - Number(wei2Eth(poolUsedAmount))
          : amount || '--',
        label: 'Can be lent',
        loading: false,
      },
    ],
    [amount, poolUsedAmount],
  )

  const isError = useMemo(() => {
    if (!amount) return false
    /**
     * 校验逻辑：Has been lent + Available in wallet 需要大于等于 Your balance
     * 如果两者相加小于 Your balance，则点击Approve/Comfirm按钮用toast报错：Insufficient funds，Maximum input：xxx
     * xxx = Has been lent + Available in wallet
     *     = poolUsedAmount + latest weth
     */
    const NumberAmount = Number(amount)
    const maxAmount = wei2Eth(Number(poolUsedAmount) + Number(wethData))
    if (NumberAmount > maxAmount) {
      setErrorMsg(` Insufficient funds: ${formatFloat(maxAmount)} WETH`)
      return true
    }
    if (NumberAmount < floorPrice * 0.1) {
      setErrorMsg(
        `Insufficient funds, Minimum input: ${formatFloat(floorPrice * 0.1)}`,
      )
      return true
    }
    return false
  }, [amount, floorPrice, poolUsedAmount, wethData])

  const onConfirm = useCallback(() => {
    interceptFn(async () => {
      /**
       * 平均总耗时：
       * 1676961248463 - 1676961180777 =  67686 ms ≈ 1min
       */
      if (amount === wei2Eth(poolAmount)) {
        toast({
          status: 'info',
          title: `The TVL is already ${wei2Eth(poolAmount)}`,
        })
        return
      }
      try {
        const parsedWeiAmount = eth2Wei(amount)

        setUpdateLoading(true)

        const xBankContract = createXBankContract()
        const updateBlock = await xBankContract.methods
          .updatePool(poolID, parsedWeiAmount)
          .send({
            from: currentAccount,
          })
        console.log(updateBlock, 'createBlock')
        setUpdateLoading(false)
        onCloseUpdate()
        if (toast.isActive('Updated-Successfully-ID')) {
          // toast.closeAll()
        } else {
          toast({
            status: 'success',
            title: 'Updated successfully! ',
            id: 'Updated-Successfully-ID',
          })
        }
        onSuccess()
      } catch (error: any) {
        console.log(error?.message, error?.code, error?.data)
        const code: string = error?.code
        const originMessage: string = error?.message
        let title: string | ReactNode = code
        let description: string | ReactNode = originMessage
        if (!code && originMessage?.includes('{')) {
          const firstIndex = originMessage.indexOf('{')
          description = ''
          try {
            const hash = JSON.parse(
              originMessage.substring(firstIndex, originMessage.length),
            )?.transactionHash

            title = (
              <Text>
                {originMessage?.substring(0, firstIndex)} &nbsp;
                <Button
                  variant={'link'}
                  px={0}
                  onClick={() => {
                    window.open(
                      `${
                        import.meta.env.VITE_TARGET_CHAIN_BASE_URL
                      }/tx/${hash}`,
                    )
                  }}
                  textDecoration='underline'
                  color='white'
                >
                  see more
                </Button>
              </Text>
            )
          } catch {
            console.log('here')
            title = originMessage?.substring(0, firstIndex)
          }
        }
        toast({
          status: 'error',
          title,
          description,
          duration: 5000,
        })
        setUpdateLoading(false)
      }
    })
  }, [
    onSuccess,
    poolAmount,
    amount,
    toast,
    currentAccount,
    interceptFn,
    onCloseUpdate,
    poolID,
  ])

  const handleClose = useCallback(() => {
    if (updateLoading) return
    onCloseUpdate()
  }, [onCloseUpdate, updateLoading])

  return (
    <>
      <Button onClick={() => interceptFn(() => onOpenUpdate())} {...rest}>
        {children}
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpenUpdate}
        onClose={handleClose}
        isCentered
      >
        <ModalOverlay bg='black.2' />
        <ModalContent
          maxW={{
            xl: '576px',
            lg: '576px',
            md: '400px',
            sm: '326px',
            xs: '326px',
          }}
          px={{ md: '40px', sm: '20px', xs: '20px' }}
          borderRadius={16}
        >
          <ModalHeader
            pt={'40px'}
            px={0}
            alignItems='center'
            display={'flex'}
            justifyContent='space-between'
          >
            <Text
              fontSize={{ md: '28px', sm: '24px', xs: '24px' }}
              fontWeight='700'
              noOfLines={1}
            >
              Modify the ETH amount
            </Text>
            <SvgComponent
              svgId='icon-close'
              onClick={handleClose}
              cursor='pointer'
              svgSize='16px'
            />
          </ModalHeader>
          <ModalBody pb={'24px'} px={0}>
            {/* 数值们 */}
            <Flex
              py={{ md: '32px', sm: '20px', xs: '20px' }}
              px={{ md: '36px', sm: '12px', xs: '12px' }}
              bg={'gray.5'}
              borderRadius={16}
              justify='space-between'
              mb='32px'
            >
              {AmountDataItems.map((item) => (
                <AmountItem key={item.label} {...item} />
              ))}
            </Flex>
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
                    setAmount(v)
                  }}
                  errorBorderColor='red.1'
                  isInvalid={isError}
                  // lineHeight='60px'
                  borderRadius={8}
                  borderColor='gray.3'
                  isDisabled={updateLoading}
                >
                  <NumberInputField
                    h='60px'
                    px={'32px'}
                    _focus={{
                      borderColor: isError ? 'red.1' : 'blue.1',
                    }}
                    _focusVisible={{
                      boxShadow: `0 0 0 1px var(--chakra-colors-${
                        isError ? 'red-1' : 'blue-1'
                      })`,
                    }}
                    placeholder='Enter amount...'
                  />
                </NumberInput>

                {isError && (
                  <InputRightElement top='10px'>
                    <SvgComponent svgId='icon-error' />
                  </InputRightElement>
                )}
              </InputGroup>

              <Text mt={'8px'} color={isError ? 'red.1' : 'gray.3'}>
                {isError
                  ? errorMsg
                  : `Minimum input: ${formatFloat(floorPrice * 0.1)} `}
              </Text>
            </FormControl>
            <Text
              fontSize={'12px'}
              color='gray.4'
              textAlign={'center'}
              px={'32px'}
              mt={'20px'}
            >
              This is a Georli based demo, you may need to swap your GeorliETH
              into GoerliWETH with the “Deposit” function of this DEX contract:
              {import.meta.env.VITE_WETH_CONTRACT_ADDRESS}
            </Text>
          </ModalBody>

          <Button
            variant='primary'
            mr={'12px'}
            mt={'8px'}
            mb={'40px'}
            mx={'40px'}
            h='52px'
            isDisabled={isError || !Number(amount)}
            onClick={onConfirm}
            loadingText={'updating'}
            fontSize='16px'
            isLoading={updateLoading || refreshLoading}
          >
            Confirm
          </Button>
          {/* </ModalFooter> */}
        </ModalContent>
      </Modal>
      <ConnectWalletModal visible={isOpen} handleClose={onClose} />
    </>
  )
}

export default UpdatePoolAmountButton
