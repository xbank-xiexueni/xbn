import {
  Box,
  Card,
  CardBody,
  CardFooter,
  type CardProps,
  Flex,
  Text,
  Button,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalFooter,
  ModalHeader,
  type ImageProps,
  Modal,
  type FlexProps,
  Highlight,
  InputGroup,
  NumberInput,
  NumberInputField,
  InputRightElement,
} from '@chakra-ui/react'
import useHover from 'ahooks/lib/useHover'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import round from 'lodash-es/round'
import {
  useMemo,
  useState,
  type FunctionComponent,
  useEffect,
  type ReactNode,
  useCallback,
  useRef,
} from 'react'

import {
  ImageWithFallback,
  ListingTag,
  MortgagedTag,
  Select,
  SvgComponent,
} from '@/components'
import { FORMAT_NUMBER, LIST_DURATION, UNIT } from '@/constants'
import { useIsMobile } from '@/hooks'
import { eth2Wei, wei2Eth } from '@/utils/unit-conversion'

const BUTTON_PROPS = {
  borderRadius: 0,
  fontSize: {
    md: '16px',
    sm: '12px',
    xs: '12px',
  },
  variant: 'unstyled',
  w: '50%',
  color: 'blue.1',
  bg: 'gray.5',
  _hover: {
    color: 'white',
    bg: 'blue.1',
  },
  h: '100%',
}

const DURATION_PROPS = {
  placeholder: 'Please select',
  h: '60px',
  borderColor: 'var(--chakra-colors-gray-4)',
  img: <SvgComponent svgId='icon-calendar' ml='12px' svgSize={'20px'} />,
}

export type ListDataType = {
  assetData?: {
    tokenID?: string
    name?: string
    imagePreviewUrl?: string
  }
  loanData?: {
    // 未偿贷款本金+利息 wei
    outstandingLoan?: number
    // 贷款结束的时间
    loanEndedTime?: number
  }
  // collection
  collectionData?: {
    name: string
    safelistRequestStatus: string
    minFloorPrice: number
    maxFloorPrice: number
  }
  listingData?: { listAmount: number; creatorEarn: number; duration: number }
  contractData?: MyAssetListItemType
}

export type ListModalType = 'create' | 'change' | 'cancel' | undefined

const NftInfoBox: FunctionComponent<
  FlexProps & {
    data?: ListDataType['assetData']
    price?: string
  }
> = ({ data, price, ...rest }) => {
  return (
    <Flex
      justify={'space-between'}
      py='24px'
      borderBottomColor={'gray.2'}
      borderBottomWidth={1}
      alignItems={'center'}
      w={{
        md: '495px',
        sm: '280px',
        xs: '280px',
      }}
      {...rest}
    >
      <Flex gap={'12px'} alignItems={'center'}>
        <ImageWithFallback
          src={data?.imagePreviewUrl}
          boxSize={'64px'}
          borderRadius={8}
        />
        <Box
          w={{
            md: '320px',
            sm: '100px',
            xs: '100px',
          }}
        >
          <Text fontSize={'20px'} fontWeight={'700'} noOfLines={1}>
            {data?.name || `#${data?.tokenID || ''}`}
          </Text>
          <Text fontSize={'14px'}>{'collection name'}</Text>
        </Box>
      </Flex>

      <Flex flexDir={'column'} alignItems={'flex-end'}>
        <Text color='gray.3' fontSize={'12px'}>
          Listing price
        </Text>
        <Text fontWeight={'700'}>
          {price || '---'}
          {UNIT}
        </Text>
      </Flex>
    </Flex>
  )
}

const Item: FunctionComponent<
  FlexProps & {
    label: string
    value: string | ReactNode
  }
> = ({ label, value, color = 'gray.3', fontWeight = '500', ...rest }) => {
  return (
    <Flex justify={'space-between'} {...rest}>
      <Text color={color} fontWeight={fontWeight}>
        {label}
      </Text>
      <Flex gap={'8px'}>
        {typeof value === 'string' ? (
          <Text color={color} fontWeight={fontWeight}>
            {value}
          </Text>
        ) : (
          value
        )}
      </Flex>
    </Flex>
  )
}

// 2.5%
const percentage = 2.5
const AMOUNT_MAX = 100000
const AMOUNT_MIN = 0
const DEFAULT_EARN = '5'
// 目前还不知道怎么获取
const gas = 100000000

// 版税的输入上下限
const EARN_MIN = percentage
const EARN_MAX = 100 - percentage

const MyAssetNftListCard: FunctionComponent<
  {
    data: ListDataType
    imageSize: ImageProps['boxSize']
  } & CardProps
> = ({ data, imageSize, ...rest }) => {
  const { assetData, contractData, loanData, listingData, collectionData } =
    data
  const ish5 = useIsMobile()

  const isMortgaged = useMemo(
    () =>
      contractData?.token_id && ['10', '3690'].includes(contractData?.token_id),
    [contractData],
  )

  const isListing = useMemo(
    () => contractData?.token_id === '10',
    [contractData],
  )

  const title = useMemo(() => {
    const unFormatName = assetData?.name || `#${contractData?.token_id || ''}`
    if (ish5) {
      const isLonger = unFormatName?.length > 20
      return isLonger ? `${unFormatName.substring(0, 20)}...` : unFormatName
    }
    return `${unFormatName}`
  }, [contractData, assetData, ish5])

  const [type, setType] = useState<ListModalType>()
  const closeModal = useCallback(() => setType(undefined), [])
  const listModalVisible = useMemo(
    () => !!type && ['create', 'change'].includes(type),
    [type],
  )

  const [price, setPrice] = useState<string>()
  const priceWei = useMemo(() => (price ? eth2Wei(price) : undefined), [price])
  const [earn, setEarn] = useState<string>(DEFAULT_EARN)
  const [durationValue, setDurationValue] = useState<number>()

  useEffect(() => {
    if (!listModalVisible) return
    if (!!listingData && type === 'change') {
      const { listAmount, duration, creatorEarn } = listingData
      const wei = wei2Eth(listAmount)
      setPrice(wei)
      setEarn((creatorEarn / 100).toString())
      setDurationValue(duration)
    } else {
      setPrice(undefined)
      setEarn(DEFAULT_EARN)
      setDurationValue(undefined)
    }
  }, [listModalVisible, listingData, type])

  const durationOptions = useMemo(() => {
    if (!listModalVisible) return LIST_DURATION
    if (!loanData?.loanEndedTime) return LIST_DURATION
    const { loanEndedTime } = loanData
    const diff = round(
      (-dayjs(new Date()).unix() + loanEndedTime) / 60 / 60 / 24,
    )
    const index = LIST_DURATION.findIndex((i) => {
      return i > diff
    })
    return LIST_DURATION.slice(0, index)
  }, [loanData, listModalVisible])

  /**
   *
   * 拉取当前最低地板价、最高地板价，给用户作为输入的参考
   * 可输入的最小金额： 这个抵押品对应 loan 的“未偿贷款本金+利息”/(1-服务费-用户输入的版税）+ 预估清算所需的 gas 费
   * 输入的金额低于地板价，但是不低于可输入的最小金额，给与橙色提醒
   * 输入的金额低于可输入的最小金额，按钮置灰，不可提交挂单
   * 用户挂单需要支付gas费，挂单之后修改条件或撤销挂单，需要再次支付gas费
   */
  const minInput = useMemo(() => {
    if (!listModalVisible) return
    if (!loanData?.outstandingLoan) return
    const { outstandingLoan } = loanData
    const loanAmount = BigNumber(outstandingLoan)
    const res =
      loanAmount
        .dividedBy(
          BigNumber(1)
            .minus(percentage / 100)
            .minus(Number(earn || 0) / 100),
        )
        .plus(gas) || BigNumber(0)

    if (isNaN(res.toNumber())) {
      // res = BigNumber(0)
    } else {
      console.log(
        '可输入的最小金额：这个抵押品对应 loan 的“未偿贷款本金+利息”/(1-2.5%-用户输入的版税）+ 预估清算所需的 gas 费',
        res.toNumber(),
      )
    }

    return res
  }, [loanData, earn, listModalVisible])

  // list amount 需要大于最小可输入值
  const isAmountError = useMemo(
    () => !!priceWei && !!minInput && minInput?.gt(priceWei),
    [minInput, priceWei],
  )

  // total potential earning
  const potentialEarns = useMemo(() => {
    if (!listModalVisible) return '---'
    if (!priceWei || !earn || !loanData?.outstandingLoan) return '---'
    const { outstandingLoan } = loanData
    const listPrice = BigNumber(priceWei)
    const wei = listPrice
      .multipliedBy(1 - Number(earn || 0) / 100 - percentage / 100)
      .minus(outstandingLoan)
    return wei2Eth(wei)
  }, [priceWei, earn, loanData, listModalVisible])

  const ref = useRef(null)
  const isHovering = useHover(ref)

  const show = useMemo(() => isHovering || ish5, [ish5, isHovering])
  return (
    <>
      <Card
        _hover={{
          boxShadow: `var(--chakra-colors-gray-2) 0px 0px 3px`,
        }}
        cursor='pointer'
        borderRadius={16}
        w='100%'
        h={'100%'}
        boxShadow='none'
        borderColor={'gray.2'}
        borderWidth='1px'
        ref={ref}
        {...rest}
      >
        <CardBody p={0} border='none'>
          <Box
            bg={'white'}
            borderTopRadius={16}
            overflow='hidden'
            pos={'relative'}
            w='100%'
          >
            <ImageWithFallback
              src={assetData?.imagePreviewUrl}
              borderRadius={0}
              alt={title}
              boxSize={imageSize}
              fit='contain'
              transition='all 0.6s'
              _hover={{
                transform: `scale(1.2)`,
              }}
            />
            {isListing && <ListingTag />}
          </Box>

          <Flex
            h={'68px'}
            justify='space-between'
            px='16px'
            alignItems={'center'}
            flexWrap={{
              md: 'nowrap',
              sm: 'wrap',
              xs: 'wrap',
            }}
            pos={'relative'}
          >
            <Text
              fontSize={{
                lg: '18px',
                md: '16px',
                sm: '16px',
                xs: '16px',
              }}
              fontWeight={'bold'}
              w={
                !isMortgaged
                  ? '100%'
                  : { xl: '70%', lg: '55%', md: '40%', sm: '100%', xs: '100%' }
              }
              noOfLines={2}
              lineHeight={'22px'}
            >
              {title}
            </Text>

            {isMortgaged && (
              <MortgagedTag
                pos={{
                  md: 'static',
                  sm: 'absolute',
                  xs: 'absolute',
                }}
                right={0}
                bottom={'6px'}
              />
            )}
          </Flex>
        </CardBody>

        {isListing ? (
          <Flex
            position='absolute'
            bottom={0}
            right={0}
            left={0}
            transition='all 0.15s'
            hidden={!isMortgaged}
            h={
              show
                ? {
                    lg: '56px',
                    md: '48px',
                    sm: '36px',
                    xs: '36px',
                  }
                : 0
            }
          >
            {['Change', 'Cancel'].map((item, index) => (
              <Button
                {...BUTTON_PROPS}
                key={item}
                hidden={!show}
                borderBottomLeftRadius={index === 0 ? 16 : 0}
                borderBottomRightRadius={index === 1 ? 16 : 0}
                onClick={() => {
                  if (item === 'Change') {
                    setType('change')
                    return
                  }
                  if (item === 'Cancel') {
                    setType('cancel')
                    return
                  }
                }}
              >
                {item}
              </Button>
            ))}
          </Flex>
        ) : (
          <Button
            borderRadius={16}
            hidden={!isMortgaged}
            borderTopLeftRadius={0}
            borderTopRightRadius={0}
            bg='blue.1'
            color='white'
            _hover={{
              opacity: 1,
              bg: 'blue.1',
              color: 'white',
            }}
            h={
              show
                ? {
                    lg: '56px',
                    md: '48px',
                    sm: '36px',
                    xs: '36px',
                  }
                : '0'
            }
            position='absolute'
            bottom={0}
            right={0}
            left={0}
            transition='all 0.15s'
            onClick={() => setType('create')}
          >
            {show && 'List for sale'}
          </Button>
        )}

        <CardFooter
          h={{
            lg: '56px',
            md: '48px',
            sm: '36px',
            xs: '36px',
          }}
          justify={'center'}
          alignItems='center'
          borderBottomRadius={16}
        />
        <Modal isOpen={type === 'cancel'} onClose={closeModal} isCentered>
          <ModalOverlay />
          <ModalContent
            maxW={{
              lg: '576px',
              md: '468px',
              sm: '326px',
              xs: '326px',
            }}
            p={{
              md: '40px',
              sm: '20px',
              xs: '20px',
            }}
          >
            <ModalHeader
              p={0}
              display={'flex'}
              justifyContent={'space-between'}
            >
              Confirming!
              <SvgComponent
                svgId='icon-close'
                onClick={closeModal}
                cursor={'pointer'}
              />
            </ModalHeader>
            <ModalBody p={0} mt='20px'>
              Are you sure you want to cancel the listing?
            </ModalBody>

            <ModalFooter p={0} mt='20px'>
              <Button mr={3} onClick={closeModal} borderRadius={8} px='30px'>
                no
              </Button>
              <Button variant='primary' borderRadius={8} px='30px'>
                yes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
      <Modal onClose={closeModal} isOpen={listModalVisible} isCentered>
        <ModalOverlay bg='black.2' h='100vh' />
        <ModalContent
          containerProps={{
            style: {
              overflow: 'initial',
            },
          }}
          maxW={{
            lg: '576px',
            md: '468px',
            sm: '326px',
            xs: '326px',
          }}
          px={{
            md: '40px',
            sm: '20px',
            xs: '20px',
          }}
          maxH={{
            md: '96vh',
            sm: '70vh',
            xs: '70vh',
          }}
          overflowY={'auto'}
        >
          <ModalHeader
            pt={{
              md: '40px',
              sm: '20px',
              xs: '20px',
            }}
            px={0}
            fontSize={'28px'}
            fontWeight={'700'}
            position={'sticky'}
            top={0}
            bg='white'
            zIndex={2}
            display={'flex'}
            justifyContent={'space-between'}
          >
            {type === 'change' && 'Change'} List item
            <SvgComponent
              svgId='icon-close'
              onClick={closeModal}
              cursor={'pointer'}
            />
          </ModalHeader>

          <ModalBody m={0} p={0}>
            {/* nft info */}
            <NftInfoBox data={assetData} price={price} />
            {/* inputs */}
            <Flex
              flexDir={'column'}
              py='24px'
              borderBottomColor={'gray.2'}
              borderBottomWidth={1}
            >
              {/* Set a price */}
              <Box>
                <Text fontWeight={'700'} mb='16px'>
                  Set a price
                </Text>
                {/* 快速填充 */}
                {!!collectionData && (
                  <Flex
                    gap={'8px'}
                    mb='16px'
                    flexWrap={{
                      md: 'nowrap',
                      sm: 'wrap',
                      xs: 'wrap',
                    }}
                  >
                    {[
                      collectionData?.minFloorPrice,
                      collectionData?.maxFloorPrice,
                    ].map((item, index) => (
                      <Flex
                        justify={'center'}
                        key={item}
                        bg={price === item.toString() ? 'gray.5' : 'white'}
                        borderColor={'rgba(0, 0, 0, 0.2)'}
                        borderWidth={1}
                        borderRadius={8}
                        py='20px'
                        w={{
                          md: '50%',
                          xs: '100%',
                          sm: '100%',
                        }}
                        lineHeight={'18px'}
                        cursor={'pointer'}
                        _hover={{
                          bg: 'gray.5',
                        }}
                        onClick={() => setPrice(item.toString())}
                      >
                        <Highlight
                          query={['Floor', 'Top attribute']}
                          styles={{
                            color: 'blue.1',
                            fontWeight: '700',
                            marginRight: '8px',
                          }}
                        >
                          {`${
                            index === 0 ? 'Floor' : 'Top attribute'
                          } ${item} ${UNIT}`}
                        </Highlight>
                      </Flex>
                    ))}
                  </Flex>
                )}

                {/* input */}
                <InputGroup mb='20px'>
                  <NumberInput
                    w='100%'
                    errorBorderColor='red.1'
                    isInvalid={isAmountError}
                    borderColor='gray.4'
                    value={price}
                    onChange={(v) => {
                      const numberV = Number(v)
                      if (numberV > AMOUNT_MAX || numberV < AMOUNT_MIN) return
                      setPrice(v)
                    }}
                    max={AMOUNT_MAX}
                    min={AMOUNT_MIN}
                  >
                    <NumberInputField
                      h='60px'
                      _focus={{
                        borderColor: isAmountError ? 'red.1' : 'blue.1',
                      }}
                      _focusVisible={{
                        boxShadow: `0 0 0 1px var(--chakra-colors-${
                          isAmountError ? 'red-1' : 'blue-1'
                        })`,
                      }}
                      placeholder='Amount...'
                      borderRadius={8}
                    />
                  </NumberInput>
                  {isAmountError && (
                    <InputRightElement mr='110px' h='60px'>
                      <SvgComponent
                        svgId='icon-info'
                        svgSize='24px'
                        fill={'red.1'}
                      />
                    </InputRightElement>
                  )}
                  <InputRightElement
                    bg='gray.5'
                    h='57px'
                    borderRightRadius={8}
                    borderColor={isAmountError ? 'red.1' : 'gray.4'}
                    borderWidth={0}
                    pr='70px'
                    pl='32px'
                    top={'1.5px'}
                    right={'1px'}
                    fontWeight={'700'}
                  >
                    {UNIT}
                  </InputRightElement>
                </InputGroup>

                {isAmountError && !!minInput && (
                  <Text
                    my='16px'
                    flexDir={'column'}
                    color='red.1'
                    fontSize={'14px'}
                    fontWeight={'500'}
                  >
                    Minimum input:&nbsp;
                    {BigNumber(wei2Eth(minInput)).toFormat(FORMAT_NUMBER)}
                    <br />
                    Price cannot be less than the outstanding loan amount
                  </Text>
                )}
                {!!collectionData &&
                  Number(price) < collectionData?.minFloorPrice &&
                  !isAmountError && (
                    <Flex
                      mt='16px'
                      color='orange.1'
                      fontSize={'14px'}
                      fontWeight={'500'}
                      alignItems={'center'}
                      lineHeight={'24px'}
                    >
                      <SvgComponent
                        svgId='icon-info'
                        fill={'orange.1'}
                        svgSize='16px'
                      />
                      Price is below collection floor price of&nbsp;
                      {collectionData?.minFloorPrice}
                      {UNIT}
                    </Flex>
                  )}
              </Box>
              {/* Creator earnings */}
              {/* earn 输入范围 2.5 ~ 97.5 */}
              <Flex justify={'space-between'} alignItems={'center'} mb='20px'>
                <Text fontWeight={'700'}>Creator earnings</Text>

                <InputGroup w='100px' alignItems={'center'}>
                  <NumberInput
                    min={EARN_MIN}
                    step={0.01}
                    max={EARN_MAX}
                    precision={2}
                    onChange={(v) => {
                      const numberV = Number(v)
                      if (numberV > EARN_MAX || numberV < EARN_MIN) return
                      setEarn(v)
                    }}
                    value={earn}
                    h='52px'
                  >
                    <NumberInputField
                      h='52px'
                      borderRadius={8}
                      _focusVisible={{
                        borderColor:
                          Number(earn) > EARN_MAX || Number(earn) < EARN_MIN
                            ? 'red.1'
                            : 'blue.1',
                      }}
                      type='number'
                      fontWeight='500'
                      color='black.1'
                    />
                  </NumberInput>
                  <InputRightElement h='52px' lineHeight={'52px'}>
                    %
                  </InputRightElement>
                </InputGroup>
              </Flex>
              {/* Duration */}
              <Box>
                <Text fontWeight={'700'} mb='16px'>
                  Duration
                </Text>
                <Select
                  {...DURATION_PROPS}
                  onChange={(e: any) => setDurationValue(e?.value as number)}
                  options={durationOptions?.map((item) => ({
                    label: `${item} Days`,
                    value: item,
                  }))}
                  defaultValue={
                    type === 'change' && !!listingData
                      ? {
                          value: listingData?.duration,
                          label: `${listingData?.duration} Days`,
                        }
                      : undefined
                  }
                />
                {/* 换算美元 */}
                {/* <Text
                fontSize={'14px'}
                fontWeight={'500'}
                mt='12px'
                color='gray.3'
              >
                $10000 Total
              </Text> */}
              </Box>
            </Flex>

            {/* price summary */}
            <Flex flexDir={'column'} gap={'12px'} py='24px'>
              <Item label='Listing price' value={`${price || '---'} ${UNIT}`} />
              <Item label='Creator earnings' value={`${earn || '---'}%`} />
              <Item
                label='Service fee'
                value={
                  <Text color={'green.1'} fontWeight={'700'}>
                    <Highlight
                      query={`${percentage.toFixed(2)}%`}
                      styles={{
                        color: 'black.1',
                        textDecoration: 'line-through',
                      }}
                    >{`${percentage.toFixed(2)}% 0%`}</Highlight>
                  </Text>
                }
              />
              <Item
                label='Total potential earnings'
                value={`${potentialEarns} ${UNIT}`}
                color={'black.1'}
                fontWeight={'700'}
              />
            </Flex>

            {/* button */}
            <Flex
              pt='12px'
              px={{
                md: '40px',
                sm: '20px',
                xs: '20px',
              }}
              pb={{
                md: '40px',
                sm: '20px',
                xs: '20px',
              }}
              position={'sticky'}
              bottom={'0px'}
              bg='white'
            >
              <Button
                variant={'primary'}
                w='100%'
                h='52px'
                isDisabled={!price || !earn || !durationValue}
              >
                {type === 'change' ? 'Change List' : 'Complete listing'}
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default MyAssetNftListCard
