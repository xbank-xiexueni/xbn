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
} from '@chakra-ui/react'
import { useRequest } from 'ahooks'
import debounce from 'lodash-es/debounce'
import {
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
  type FunctionComponent,
  useEffect,
} from 'react'
import { useNavigate } from 'react-router-dom'
import Web3 from 'web3/dist/web3.min.js'

import { ConnectWalletModal, SvgComponent } from '@/components'
import { WETH_CONTRACT_ADDRESS, XBANK_CONTRACT_ADDRESS } from '@/constants'
import { useWallet } from '@/hooks'
import {
  createWeb3Provider,
  createWethContract,
  createXBankContract,
} from '@/utils/createContract'
import { formatFloat } from '@/utils/format'
import { wei2Eth } from '@/utils/unit-conversion'

/**
 * create pool
 * use createPool
 */
const CreatePoolButton: FunctionComponent<
  ButtonProps & {
    data: {
      poolMaximumPercentage: number
      poolMaximumDays: number
      poolMaximumInterestRate: number
      loanTimeConcessionFlexibility: number
      loanRatioPreferentialFlexibility: number
      allowCollateralContract: string
      floorPrice: number
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
    floorPrice,
  } = data
  const toast = useToast()
  const timer = useRef<NodeJS.Timeout>()
  const [flag, setFlag] = useState(true)
  const navigate = useNavigate()
  const { currentAccount, interceptFn, isOpen, onClose } = useWallet()
  const {
    isOpen: isOpenApprove,
    onOpen: onOpenApprove,
    onClose: onCloseApprove,
  } = useDisclosure()

  const [approveLoading, setApproveLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [subscribeLoading, setSubscribeLoading] = useState(false)

  useEffect(() => {
    const web3 = createWeb3Provider()
    web3.eth.clearSubscriptions()
    return () => {
      web3.eth.clearSubscriptions()
    }
  }, [])

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
   * Your balance = LP 设定的数值
   * Has been lent = 这个 pool 当前进行中的贷款，尚未归还的本金金额
   * Can ben lent = Your balance - Has been lent （如果相减结果为负数，则显示0）
   */

  const isError = useMemo(() => {
    //  amount < balance + Has been lent
    if (!amount) return false
    const NumberAmount = Number(amount)
    if (NumberAmount > Number(wei2Eth(wethData))) {
      setErrorMsg(
        ` Insufficient wallet balance: ${formatFloat(
          Number(wei2Eth(wethData)),
        )} WETH`,
      )
      return true
    }
    if (NumberAmount < floorPrice * 0.1) {
      setErrorMsg(
        `Insufficient funds, Minimum input: ${formatFloat(floorPrice * 0.1)}`,
      )
      return true
    }
    return false
  }, [amount, wethData, floorPrice])

  const onConfirm = useCallback(() => {
    interceptFn(async () => {
      /**
       * 平均总耗时：
       * 1676961248463 - 1676961180777 =  67686 ms ≈ 1min
       */
      console.log(new Date().getTime(), '----------------start')
      // 预计算
      const UNIT256MAX =
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      try {
        const parsedWeiAmount = Web3.utils.toWei(amount, 'ether')
        const wethContract = createWethContract()
        setApproveLoading(true)
        const _allowance = await wethContract.methods
          .allowance(currentAccount, XBANK_CONTRACT_ADDRESS)
          .call()

        const allowanceHex = Web3.utils.toHex(_allowance)
        if (allowanceHex !== UNIT256MAX) {
          console.log('approve 阶段')

          await wethContract.methods
            .approve(XBANK_CONTRACT_ADDRESS, UNIT256MAX)
            .send({
              from: currentAccount,
            })
        }
        setApproveLoading(false)
        setCreateLoading(true)

        // const supportERC20Denomination = approveHash?.to
        const supportERC20Denomination = WETH_CONTRACT_ADDRESS

        const xBankContract = createXBankContract()
        const createBlock = await xBankContract.methods
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
        console.log(createBlock, 'createBlock', flag)
        setCreateLoading(false)
        setSubscribeLoading(true)
        // 监听 loan 是否生成
        xBankContract.events
          .PoolCreated({
            filter: {
              poolOwnerAddress: currentAccount,
            },
            fromBlock: createBlock?.BlockNumber || 'latest',
          })
          .on(
            'data',
            flag
              ? debounce((event) => {
                  console.log(event, 'on data') // same results as the optional callback above
                  if (toast.isActive('Created-Successfully-ID')) {
                    // toast.closeAll()
                  } else {
                    toast({
                      status: 'success',
                      title: 'Created successfully! ',
                      id: 'Created-Successfully-ID',
                    })
                  }
                  setSubscribeLoading(false)
                  setFlag(false)
                  onCloseApprove()
                  navigate('/xlending/lending/my-pools')
                }, 10000)
              : () => console.log(flag, 'flag false '),
          )
        // 如果一直监听不到
        timer.current = setTimeout(() => {
          console.log('2 分钟过去了')
          toast({
            status: 'info',
            title: 'The pool is being generated, please wait and refresh later',
          })
          navigate('/xlending/lending/my-pools')
        }, 2 * 60 * 1000)
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
        setCreateLoading(false)
        setApproveLoading(false)
      }
    })
  }, [
    amount,
    toast,
    poolMaximumPercentage,
    poolMaximumDays,
    poolMaximumInterestRate,
    loanRatioPreferentialFlexibility,
    loanTimeConcessionFlexibility,
    allowCollateralContract,
    currentAccount,
    interceptFn,
    flag,
    navigate,
    onCloseApprove,
  ])

  const handleClose = useCallback(() => {
    if (approveLoading || createLoading) return
    onCloseApprove()
  }, [onCloseApprove, approveLoading, createLoading])

  return (
    <>
      <Button onClick={() => interceptFn(() => onOpenApprove())} {...rest}>
        {children}
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpenApprove}
        onClose={handleClose}
        isCentered
      >
        <ModalOverlay bg='black.2' />
        <ModalContent
          borderRadius={16}
          maxW={{
            xl: '576px',
            lg: '576px',
            md: '400px',
            sm: '326px',
            xs: '326px',
          }}
          px={{ md: '40px', sm: '20px', xs: '20px' }}
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
            >
              Approve WETH
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
            {/* <Flex
              py={{ md: '32px', sm: '20px', xs: '20px' }}
              px={{ md: '36px', sm: '12px', xs: '12px' }}
              bg={`var(--chakra-colors-gray-5)`}
              borderRadius={16}
              justify='space-between'
              mb='32px'
            >
              {AmountDataItems.map((item) => (
                <AmountItem key={item.label} {...item} />
              ))}
            </Flex> */}
            <FormControl>
              <FormLabel fontWeight={'700'}>Amount</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.300'
                  fontSize='1.2em'
                  top='14px'
                >
                  <SvgComponent svgId='icon-eth' fill={'black.1'} />
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
                  placeholder='Enter the approve ETH amount...'
                  isDisabled={
                    approveLoading ||
                    createLoading ||
                    refreshLoading ||
                    subscribeLoading
                  }
                  top={'2px'}
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
                    placeholder='Enter the approve ETH amount...'
                  />
                </NumberInput>

                {isError && (
                  <InputRightElement top='14px' mr='8px'>
                    <SvgComponent svgId='icon-error' svgSize='24px' />
                  </InputRightElement>
                )}
              </InputGroup>

              <Text mt={'8px'} color={isError ? 'red.1' : 'gray.3'}>
                {isError
                  ? errorMsg
                  : `Minimum input: ${formatFloat(floorPrice * 0.1)}`}
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

          {/* <ModalFooter justifyContent={'center'}> */}
          <Button
            variant='primary'
            mr={'12px'}
            mt={'8px'}
            mb={'40px'}
            mx={{
              md: '40px',
              sm: '23px',
              xs: '23px',
            }}
            h='52px'
            isDisabled={isError || !Number(amount)}
            onClick={onConfirm}
            loadingText={
              approveLoading
                ? 'approving'
                : createLoading || subscribeLoading
                ? 'creating'
                : ''
            }
            fontSize='16px'
            isLoading={
              approveLoading ||
              createLoading ||
              refreshLoading ||
              subscribeLoading
            }
          >
            Approve
          </Button>
          {/* </ModalFooter> */}
        </ModalContent>
      </Modal>
      <ConnectWalletModal visible={isOpen} handleClose={onClose} />
    </>
  )
}

export default CreatePoolButton
