import {
  Box,
  Button,
  Flex,
  Highlight,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import { isEmpty } from 'lodash-es'
import { useEffect, useMemo, useState } from 'react'

import { ImageWithFallback, SvgComponent, Select } from '@/components'
import { FORMAT_NUMBER, LIST_DURATION, UNIT } from '@/constants'
import type { NftAsset } from '@/hooks'

import type { FlexProps } from '@chakra-ui/react'
import type { FunctionComponent, ReactNode } from 'react'

const NftInfoBox: FunctionComponent<
  FlexProps & {
    data?: NftAsset
    price?: string
  }
> = ({ data, price }) => {
  return (
    <Flex
      justify={'space-between'}
      py='24px'
      borderBottomColor={'gray.2'}
      borderBottomWidth={1}
      alignItems={'center'}
      w='495px'
    >
      <Flex gap={'12px'}>
        <ImageWithFallback
          src={data?.imagePreviewUrl}
          boxSize={'64px'}
          borderRadius={8}
        />
        <Box w='320px'>
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

// 2.5%
const percentage = 2.5
const AMOUNT_MAX = 100000
const AMOUNT_MIN = 0
const DEFAULT_EARN = '2.5'

const Item: FunctionComponent<
  FlexProps & {
    label: string
    value: string
    extra?: ReactNode
  }
> = ({
  label,
  value,
  extra,
  color = 'gray.3',
  fontWeight = '500',
  ...rest
}) => {
  return (
    <Flex justify={'space-between'} {...rest}>
      <Text color={color} fontWeight={fontWeight}>
        {label}
      </Text>
      <Flex gap={'8px'}>
        <Text color={color} fontWeight={fontWeight}>
          {value}
        </Text>
        {!!extra && extra}
      </Flex>
    </Flex>
  )
}

const ListForSaleModal: FunctionComponent<{
  data?: NftAsset
  onClose: () => void
  isOpen: boolean
  // 未偿贷款本金+利息
  loanAmount: number
}> = ({ onClose, isOpen, data, loanAmount, ...rest }) => {
  const [price, setPrice] = useState<string>()
  const [earn, setEarn] = useState<string>(DEFAULT_EARN)
  const [durationValue, setDurationValue] = useState<number>(30)

  useEffect(() => {
    setPrice(undefined)
    setEarn(DEFAULT_EARN)
    setDurationValue(30)
  }, [isOpen])

  const durationSelectorProps = useMemo(
    () => ({
      placeholder: 'Please select',
      defaultValue: {
        label: `30 Days`,
        value: 30,
      },
      h: '60px',
      img: <SvgComponent svgId='icon-calendar' ml='12px' svgSize={'20px'} />,
      onChange: (e: any) => setDurationValue(e?.value as number),
      options: LIST_DURATION?.map((item) => ({
        label: `${item} Days`,
        value: item,
      })),
    }),
    [],
  )

  const floorPrice = useMemo(() => {
    if (!data || !data?.orderPrice) return []
    const orderPrice = Number(data?.orderPrice)
    return [orderPrice + 0.1888, orderPrice + 0.3518]
  }, [data])

  /**
   *
   * 拉取当前最低地板价、最高地板价，给用户作为输入的参考
   * 可输入的最小金额： 这个抵押品对应 loan 的“未偿贷款本金+利息”/(1-2.5%-用户输入的版税）+ 预估清算所需的 gas 费
   * 输入的金额低于地板价，但是不低于可输入的最小金额，给与橙色提醒
   * 输入的金额低于可输入的最小金额，按钮置灰，不可提交挂单
   * creator earnings：用市场售价，扣除版税，再扣除 market 手续费之后剩余的资金
   * 用户挂单需要支付gas费，挂单之后修改条件或撤销挂单，需要再次支付gas费
   */
  const gas = 0.1
  const minInput = useMemo(() => {
    const loan = BigNumber(loanAmount)
    const res = loan
      .dividedBy(
        BigNumber(1)
          .minus(percentage / 100)
          .minus(Number(earn || 0) / 100),
      )
      .multipliedBy(gas)

    if (isNaN(res.toNumber())) {
      console.log(loanAmount)
      return BigNumber(100000)
    } else {
      console.log(
        '可输入的最小金额：这个抵押品对应 loan 的“未偿贷款本金+利息”/(1-2.5%-用户输入的版税）+ 预估清算所需的 gas 费',
        res.toNumber(),
      )
    }

    return res
  }, [loanAmount, earn, gas])

  const isAmountError = useMemo(
    () => minInput.gt(Number(price)),
    [minInput, price],
  )

  const earnMinAndMax = useMemo(
    () => ({ min: percentage, max: 100 - percentage }),
    [],
  )

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered {...rest}>
      <ModalOverlay bg='black.2' />
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
        maxH={{
          md: '95vh',
          sm: '70vh',
          xs: '70vh',
        }}
        overflowY={'auto'}
      >
        <ModalHeader p={0} fontSize={'28px'} fontWeight={'700'}>
          List item
        </ModalHeader>
        <ModalCloseButton
          fontSize={'16px'}
          top={{
            md: '40px',
            xs: '25px',
            sm: '25px',
          }}
          right={{
            md: '30px',
            sm: '16px',
            xs: '16px',
          }}
        />
        <ModalBody m={0} p={0}>
          {/* nft info */}
          <NftInfoBox data={data} price={price} />
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
              {!isEmpty(floorPrice) && (
                <Flex
                  gap={'8px'}
                  mb='16px'
                  flexWrap={{
                    md: 'nowrap',
                    sm: 'wrap',
                    xs: 'wrap',
                  }}
                >
                  {floorPrice.map((item, index) => (
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

              {isAmountError && (
                <Text
                  my='16px'
                  flexDir={'column'}
                  color='red.1'
                  fontSize={'14px'}
                  fontWeight={'500'}
                >
                  Minimum input:{minInput.toFormat(FORMAT_NUMBER)}
                  <br />
                  Price cannot be less than the outstanding loan amount
                </Text>
              )}
              {!isEmpty(floorPrice) &&
                Number(price) < floorPrice[0] &&
                !isAmountError && (
                  <Flex
                    mt='16px'
                    color='orange.1'
                    fontSize={'14px'}
                    fontWeight={'500'}
                    alignItems={'center'}
                    lineHeight={'24px'}
                  >
                    <SvgComponent svgId='icon-info' fill={'orange.1'} />
                    Price is below collection floor price of {floorPrice[0]}
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
                  min={earnMinAndMax.min}
                  step={0.01}
                  max={earnMinAndMax.max}
                  precision={2}
                  onChange={(v) => {
                    const numberV = Number(v)
                    if (
                      numberV > earnMinAndMax.max ||
                      numberV < earnMinAndMax.min
                    )
                      return
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
                        Number(earn) > earnMinAndMax.max ||
                        Number(earn) < earnMinAndMax.min
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
              <Select {...durationSelectorProps} />
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
            <Item label='Creator earnings' value={`${earn || '---'} %`} />
            <Item label='Service fee' value={`${'--'} ${UNIT}`} />
            <Item
              label='Total potential earnings'
              value={`${'--'} ${UNIT}`}
              color={'black.1'}
              fontWeight={'700'}
            />
          </Flex>

          {/* button */}
          <Flex
            mt='12px'
            px={{
              md: '40px',
              sm: '20px',
              xs: '20px',
            }}
          >
            <Button
              variant={'primary'}
              w='100%'
              h='52px'
              isDisabled={!price || !earn || !durationValue}
            >
              Complete listing
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ListForSaleModal
