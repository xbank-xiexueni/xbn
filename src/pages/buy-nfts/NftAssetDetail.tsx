import {
  Box,
  SimpleGrid,
  Image,
  Text,
  Flex,
  Button,
  SlideFade,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  HStack,
  Highlight,
  VStack,
  Divider,
  useDisclosure,
} from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import isEmpty from 'lodash/isEmpty'
import range from 'lodash/range'
import { useCallback, useContext, useEffect, useState } from 'react'

import TestImage from '@/assets/IMAGE.png'
import { ConnectWalletModal, SvgComponent } from '@/components'
import { TransactionContext } from '@/context/TransactionContext'
import COLORS from '@/utils/Colors'
import { amortizationCalByDays } from '@/utils/calculation'
import { COLLATERALS, UNIT } from '@/utils/constants'

import test from '@/assets/test-img.svg'

import BelongToCollection from './components/BelongToCollection'
import DetailComponent from './components/DetailComponent'
import LabelComponent from './components/LabelComponent'
import PlanItem from './components/PlanItem'
import RadioCard from './components/RadioCard'

const NftAssetDetail = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { currentAccount } = useContext(TransactionContext)
  const interceptFn = useCallback(
    (fn?: () => void) => {
      // 判断是否连接钱包
      if (!currentAccount) {
        onOpen()
        return
      }
      if (fn) {
        fn()
      }
    },
    [currentAccount, onOpen],
  )
  // const { id } = useParams()
  const [
    commodityPrice,
    // srCommodityPrice
  ] = useState(90)
  const [sliderValue, setSliderValue] = useState(COLLATERALS[4])
  const [loanAmount, setLoanAmount] = useState<number>()

  useEffect(() => {
    if (!commodityPrice) return
    setLoanAmount((commodityPrice * sliderValue) / 100)
  }, [sliderValue, commodityPrice])

  // loan periods
  const [
    periodOptions,
    // setPeriodOptions
  ] = useState<(7 | 14 | 30 | 60 | 90)[]>([7, 14, 30, 60, 90])
  const [periodValue, setPeriodValue] = useState<7 | 14 | 30 | 60 | 90>(7)

  // number of installments
  const [installmentOptions, setInstallmentOptions] = useState<(1 | 2 | 3)[]>([
    1, 2, 3,
  ])
  const [installmentValue, setInstallmentValue] = useState<1 | 2 | 3>(1)

  useEffect(() => {
    if (!periodValue) return
    if (periodValue === 7) {
      setInstallmentOptions([1])
      return
    }
    if (periodValue === 14) {
      setInstallmentOptions([1, 2])
      return
    }
    setInstallmentOptions([1, 2, 3])
  }, [periodValue])

  const handleClickPay = useCallback(() => {
    interceptFn(() => {
      console.log('点击 down payment')
    })
  }, [interceptFn])

  const getPlanPer = useCallback(
    (value: number) => {
      if (!loanAmount) return BigNumber(0)
      return amortizationCalByDays(loanAmount, 0.29, periodValue, value)
    },
    [periodValue, loanAmount],
  )

  return (
    <SimpleGrid minChildWidth='600px' spacing='40px' mt={8} pb='100px'>
      <Flex
        flexWrap={'wrap'}
        justify={{
          lg: 'flex-start',
          md: 'center',
        }}
        flexDirection={'column'}
        w='600px'
      >
        <Image src={TestImage} />
        <BelongToCollection
          data={{ name: 'xxn', img: test, price: '1.78', verified: true }}
        />
      </Flex>

      <Box>
        {/* 价格 名称 */}
        <DetailComponent
          data={{
            name1: 'xxx',
            name2: 'sssssssss',
            price: `${commodityPrice}`,
            verified: true,
          }}
        />

        {/* Down payment */}
        <LabelComponent label='Down Payment'>
          <Flex
            p={4}
            pr={6}
            border={`1px solid ${COLORS.tipTextColor}`}
            borderRadius={16}
            alignItems='center'
            gap={4}
          >
            <Flex
              py={3}
              bg={COLORS.secondaryBgc}
              borderRadius={8}
              gap={1}
              alignItems='baseline'
              justify={'center'}
              w='80px'
            >
              <SvgComponent svgId='icon-eth' svgSize='18px' />
              <Text fontSize={'lg'}>{commodityPrice - (loanAmount || 0)}</Text>
            </Flex>
            <Divider orientation='vertical' h={6} />
            <Slider
              min={COLLATERALS[0]}
              max={COLLATERALS[COLLATERALS.length - 1]}
              step={10}
              onChange={(target) => {
                setSliderValue(target)
              }}
              value={sliderValue}
            >
              {COLLATERALS.map((item) => (
                <SliderMark value={item} fontSize='sm' key={item} zIndex={1}>
                  <Box
                    w={2}
                    h={2}
                    borderRadius={8}
                    borderWidth={1}
                    borderColor='white'
                    mt={-1}
                    bg={
                      sliderValue > item
                        ? COLORS.primaryColor
                        : COLORS.tipTextColor
                    }
                  />
                </SliderMark>
              ))}
              <SliderTrack bg={COLORS.tipTextColor}>
                <SliderFilledTrack
                  // bg={COLORS.secondaryColor}
                  bgGradient={`linear-gradient(90deg,#fff,${COLORS.primaryColor})`}
                />
              </SliderTrack>
              <SliderThumb
                boxSize={6}
                borderWidth={5}
                borderColor={COLORS.primaryColor}
                _focus={{
                  boxShadow: 'none',
                }}
              />
              <SlideFade />
            </Slider>
          </Flex>

          <Flex justify={'center'} gap={2} alignItems='center' mt={6}>
            <Text fontSize={'xs'} fontWeight='500'>
              Loan amount
            </Text>
            <SvgComponent svgId='icon-eth' svgSize='12px' />
            <Text fontSize={'xs'} fontWeight='500'>
              {loanAmount}
            </Text>
          </Flex>
        </LabelComponent>

        {/* Loan Period */}
        <LabelComponent label='Loan Period' isEmpty={isEmpty(periodOptions)}>
          <HStack gap={2}>
            {periodOptions.map((value, index) => {
              return (
                <Flex
                  key={value}
                  w={`${100 / periodOptions.length}%`}
                  maxW={136}
                >
                  <RadioCard
                    onClick={() => setPeriodValue(value)}
                    isActive={value === periodValue}
                  >
                    <Text fontWeight={700}>{value} Days</Text>
                    <Text
                      fontWeight={500}
                      fontSize='xs'
                      color={COLORS.primaryColor}
                    >
                      <Highlight
                        query={'APR'}
                        styles={{ color: COLORS.textColor }}
                      >
                        {`${29 + index} % APR`}
                      </Highlight>
                    </Text>
                  </RadioCard>
                </Flex>
              )
            })}
          </HStack>
        </LabelComponent>

        {/* Number of installments */}
        <LabelComponent
          label='Number of installments'
          isEmpty={isEmpty(installmentOptions)}
        >
          <HStack gap={4}>
            {installmentOptions.map((value) => {
              return (
                <Flex
                  key={value}
                  w={`${100 / installmentOptions.length}%`}
                  maxW={188}
                >
                  <RadioCard
                    onClick={() => setInstallmentValue(value)}
                    isActive={value === installmentValue}
                  >
                    <Text fontWeight={700}>Pay in {value} installments</Text>
                    <Text fontWeight={500} fontSize='xs'>
                      {loanAmount && getPlanPer(value).toFixed(4)}
                      &nbsp;
                      {UNIT}/per
                    </Text>
                  </RadioCard>
                </Flex>
              )
            })}
          </HStack>
        </LabelComponent>

        {/* Repayment Plan */}
        <LabelComponent label='Repayment Plan'>
          <VStack
            bg={COLORS.secondaryBgc}
            py={6}
            px={4}
            borderRadius={12}
            spacing={4}
          >
            <PlanItem value={'20'} label='Down payment on today' />

            {range(installmentValue).map((value, index) => (
              <PlanItem
                value={getPlanPer(installmentValue).toFixed(4)}
                label={dayjs()
                  .add((periodValue / installmentValue) * (index + 1), 'days')
                  .format('YYYY/MM/DD')}
                key={value}
              />
            ))}
          </VStack>
        </LabelComponent>

        {/* Trading Information */}
        <LabelComponent label='Trading Information' borderBottom={'none'}>
          {loanAmount && (
            <Flex
              border={`1px solid ${COLORS.tipTextColor}`}
              py={6}
              px={4}
              borderRadius={12}
              gap={4}
              direction='column'
            >
              {/* Commodity price */}
              <Flex justify={'space-between'}>
                <Text color={COLORS.secondaryTextColor}>Commodity price</Text>
                <Text color={COLORS.secondaryTextColor}>
                  {commodityPrice} {UNIT}
                </Text>
              </Flex>
              {/* Down payment */}
              <Flex justify={'space-between'}>
                <Text color={COLORS.secondaryTextColor}>Down payment</Text>
                <Text color={COLORS.secondaryTextColor}>
                  {commodityPrice - loanAmount} {UNIT}
                </Text>
              </Flex>
              {/* Loan amount */}
              <Flex justify={'space-between'}>
                <Text color={COLORS.secondaryTextColor}>Loan amount</Text>
                <Text color={COLORS.secondaryTextColor}>
                  {loanAmount} {UNIT}
                </Text>
              </Flex>
              {/* Interest fee */}
              <Flex justify={'space-between'}>
                <Text color={COLORS.secondaryTextColor}>Interest fee</Text>
                <Text color={COLORS.secondaryTextColor}>
                  {getPlanPer(installmentValue)
                    .multipliedBy(installmentValue)
                    .minus(loanAmount)
                    .toFixed(4)}
                  {UNIT}
                </Text>
              </Flex>
              <Divider color={COLORS.borderColor} />
              {/* Total repayment */}
              <Flex justify={'space-between'}>
                <Text fontSize={'md'} fontWeight='bold'>
                  Total repayment
                </Text>
                <Text fontSize={'md'} fontWeight='bold'>
                  {getPlanPer(installmentValue)
                    .multipliedBy(installmentValue)
                    .minus(loanAmount)
                    .plus(commodityPrice)
                    .toFixed(4)}
                  {UNIT}
                </Text>
              </Flex>
              {/* Floor breakeven */}
              <Flex justify={'space-between'}>
                <Text fontSize={'md'} fontWeight='bold'>
                  Floor breakeven
                </Text>
                <Text fontSize={'md'} fontWeight='bold'>
                  xxx {UNIT}
                </Text>
              </Flex>
            </Flex>
          )}
        </LabelComponent>

        {/* 按钮 */}
        <Button
          variant={'primary'}
          display='flex'
          h='60px'
          w='100%'
          onClick={handleClickPay}
          disabled={!loanAmount}
        >
          <Text fontWeight={'400'}>Down payment</Text>&nbsp;
          {commodityPrice - (loanAmount || 0)} {UNIT}
        </Button>
      </Box>

      <ConnectWalletModal visible={isOpen} handleClose={onClose} />
    </SimpleGrid>
  )
}

export default NftAssetDetail
