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
  Skeleton,
} from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { filter, minBy } from 'lodash-es'
import isEmpty from 'lodash-es/isEmpty'
import min from 'lodash-es/min'
import range from 'lodash-es/range'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { apiGetAssetDetail, apiGetPoolsByAssets } from '@/api'
import { ConnectWalletModal, SvgComponent } from '@/components'
import { COLLATERALS, TENORS, UNIT } from '@/constants'
import { useWallet } from '@/hooks'
import { amortizationCalByDays } from '@/utils/calculation'

import test from '@/assets/test-img.svg'

import BelongToCollection from './components/BelongToCollection'
import DetailComponent from './components/DetailComponent'
import LabelComponent from './components/LabelComponent'
import PlanItem from './components/PlanItem'
import RadioCard from './components/RadioCard'

const FIXED_NUM = 4

enum LOAN_DAYS_ENUM {
  Loan7Days = 7,
  Loan14Days = 14,
  Loan30Days = 30,
  Loan60Days = 60,
  Loan90Days = 90,
}

type PoolType = {
  poolID?: number
  poolApr?: number
  poolDays?: LOAN_DAYS_ENUM
}
const NftAssetDetail = () => {
  const { isOpen, onClose, interceptFn } = useWallet()
  const { id } = useParams()
  const [commodityPrice, srCommodityPrice] = useState<BigNumber>()
  const [detail, setDetail] = useState({
    asset: '',
    collection: '',
    image: '',
  })
  const { loading: detailLoading } = useRequest(apiGetAssetDetail, {
    ready: !!id,
    defaultParams: [{ id: id as string }],
    onSuccess: (_data) => {
      const { data } = _data
      srCommodityPrice(BigNumber(min([data.price, data.oraclePrice])))
      setDetail({
        image: data?.image,
        asset: data.name,
        collection: 'collection name',
      })
    },
    debounceWait: 100,
  })

  const [sliderValue, setSliderValue] = useState(COLLATERALS[4])
  const [loanAmount, setLoanAmount] = useState<BigNumber>()

  useEffect(() => {
    if (!commodityPrice) return
    setLoanAmount(commodityPrice.multipliedBy(sliderValue).dividedBy(100))
  }, [sliderValue, commodityPrice])

  const [pools, setPools] = useState<PoolType[]>([])

  const [selectPool, setSelectPool] = useState<PoolType>()

  const { loading: filterLoading, data: poolsData } = useRequest(
    apiGetPoolsByAssets,
    {
      defaultParams: [{ id: id as string }],
      ready: !!id,
      debounceWait: 100,
    },
  )

  useEffect(() => {
    if (isEmpty(poolsData)) {
      return
    }
    const {
      data: { list },
    } = poolsData
    const filteredPools = filter(list, (item) => {
      return (
        item.poolMaximumPercentage >= sliderValue && loanAmount?.lte(item.price)
      )
    })
    const currentPools: PoolType[] = []
    for (let index = 0; index < TENORS.length; index++) {
      const item = TENORS[index]
      const currentFilterPools = filteredPools.filter(
        (i) => i.poolMaximumDays >= item,
      )
      if (isEmpty(currentFilterPools)) break
      const currentPool = minBy(
        currentFilterPools.map(
          ({
            poolID,
            poolMaximumInterestRate,
            poolMaximumDays,
            loanTimeConcessionFlexibility,
            poolMaximumPercentage,
            loanRatioPreferentialFlexibility,
          }) => {
            return {
              poolID,
              poolApr:
                poolMaximumInterestRate -
                (TENORS.indexOf(poolMaximumDays) - index) *
                  loanTimeConcessionFlexibility -
                ((poolMaximumPercentage - sliderValue) / 10) *
                  loanRatioPreferentialFlexibility,
              poolDays: item,
            }
          },
        ),
        (i) => i.poolApr,
      )
      if (!currentPool) break
      currentPools.push(currentPool)
    }
    setPools(currentPools)
    setSelectPool(currentPools?.length > 1 ? currentPools[1] : currentPools[0])
  }, [poolsData, sliderValue, loanAmount])

  // number of installments
  const [installmentOptions, setInstallmentOptions] = useState<(1 | 2 | 3)[]>()
  const [installmentValue, setInstallmentValue] = useState<1 | 2 | 3>(1)

  useEffect(() => {
    if (isEmpty(selectPool)) {
      setInstallmentOptions([])
      return
    }
    const { poolDays } = selectPool
    if (poolDays === LOAN_DAYS_ENUM.Loan7Days) {
      setInstallmentOptions([1])
      setInstallmentValue(1)
      return
    }
    setInstallmentValue(2)
    if (poolDays === LOAN_DAYS_ENUM.Loan14Days) {
      setInstallmentOptions([1, 2])
      return
    }
    setInstallmentOptions([1, 2, 3])
  }, [selectPool])

  const handleClickPay = useCallback(() => {
    interceptFn(() => {
      console.log('点击 down payment')
    })
  }, [interceptFn])

  const getPlanPer = useCallback(
    (value: number) => {
      if (!loanAmount || !selectPool?.poolDays || !selectPool.poolApr)
        return BigNumber(0)
      return amortizationCalByDays(
        loanAmount?.toNumber(),
        selectPool.poolApr / 100,
        selectPool?.poolDays,
        value,
      )
    },
    [selectPool, loanAmount],
  )

  return (
    <SimpleGrid minChildWidth='600px' spacing='40px' mt={8} pb='100px'>
      {detailLoading ? (
        <Skeleton height={700} borderRadius={16} />
      ) : (
        <Flex
          flexWrap={'wrap'}
          justify={{
            lg: 'flex-start',
            md: 'center',
          }}
          flexDirection={'column'}
          w='600px'
        >
          <Image src={detail?.image} borderRadius={20} h='600px' />
          <BelongToCollection
            data={{
              name: 'Collection name',
              img: test,
              price: '1.78',
              verified: true,
            }}
          />
        </Flex>
      )}

      <Box>
        {/* 价格 名称 */}
        <DetailComponent
          data={{
            name1: 'Collection name',
            name2: detail?.asset,
            price: commodityPrice?.toFormat(4) || '',
            verified: true,
          }}
          loading={detailLoading}
        />

        {/* Down payment */}
        <LabelComponent label='Down Payment' loading={detailLoading}>
          <Flex
            p={4}
            pr={6}
            border={`1px solid var(--chakra-colors-gray-1)`}
            borderRadius={16}
            alignItems='center'
            gap={4}
          >
            {loanAmount && (
              <Flex
                py={3}
                bg='gray.5'
                borderRadius={8}
                gap={1}
                alignItems='center'
                justify={'center'}
                px={2}
              >
                <SvgComponent svgId='icon-eth' svgSize='20px' />
                <Text fontSize={'lg'}>
                  {commodityPrice?.minus(loanAmount).toFormat(FIXED_NUM)}
                </Text>
              </Flex>
            )}

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
                    bg={sliderValue > item ? 'blue.1' : 'gray.1'}
                  />
                </SliderMark>
              ))}
              <SliderTrack bg='gray.1'>
                <SliderFilledTrack
                  bgGradient={`linear-gradient(90deg,#fff,var(--chakra-colors-blue-1))`}
                />
              </SliderTrack>
              <SliderThumb
                boxSize={6}
                borderWidth={5}
                borderColor={'blue.1'}
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
              {loanAmount?.toFormat(FIXED_NUM)}
            </Text>
          </Flex>
        </LabelComponent>

        {/* Loan Period */}
        <LabelComponent
          label='Loan Period'
          isEmpty={isEmpty(selectPool)}
          loading={filterLoading}
        >
          <HStack gap={2}>
            {pools.map(({ poolID, poolApr, poolDays }) => {
              return (
                <Flex
                  key={`${poolID}-${poolApr}-${poolDays}`}
                  w={`${100 / pools.length}%`}
                  maxW={136}
                >
                  <RadioCard
                    onClick={() =>
                      setSelectPool({
                        poolApr,
                        poolID,
                        poolDays,
                      })
                    }
                    isActive={selectPool?.poolDays === poolDays}
                  >
                    <Text fontWeight={700}>{poolDays} Days</Text>
                    <Text fontWeight={500} fontSize='xs' color='blue.1'>
                      <Highlight query={'APR'} styles={{ color: `black.1` }}>
                        {`${poolApr?.toFixed(4)} % APR`}
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
          loading={filterLoading}
        >
          <HStack gap={4}>
            {installmentOptions?.map((value) => {
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
                      {loanAmount && getPlanPer(value).toFixed(FIXED_NUM)}
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
        {commodityPrice && loanAmount && (
          <LabelComponent
            label='Repayment Plan'
            isEmpty={isEmpty(selectPool)}
            loading={filterLoading}
          >
            <VStack bg='gray.5' py={6} px={4} borderRadius={12} spacing={4}>
              <PlanItem
                value={commodityPrice.minus(loanAmount).toFormat(FIXED_NUM)}
                label='Down payment on today'
              />

              {range(installmentValue).map((value, index) => (
                <PlanItem
                  value={getPlanPer(installmentValue).toFixed(FIXED_NUM)}
                  label={dayjs()
                    .add(
                      ((selectPool?.poolDays || 0) / installmentValue) *
                        (index + 1),
                      'days',
                    )
                    .format('YYYY/MM/DD')}
                  key={value}
                />
              ))}
            </VStack>
          </LabelComponent>
        )}

        {/* Trading Information */}
        <LabelComponent
          label='Trading Information'
          borderBottom={'none'}
          loading={filterLoading}
          isEmpty={isEmpty(pools)}
        >
          {loanAmount && commodityPrice && (
            <Flex
              border={`1px solid var(--chakra-colors-gray-1)`}
              py={6}
              px={4}
              borderRadius={12}
              gap={4}
              direction='column'
            >
              {/* Commodity price */}
              <Flex justify={'space-between'}>
                <Text color='gray.3'>Commodity price</Text>
                <Text color='gray.3'>
                  {commodityPrice?.toFormat(FIXED_NUM)} {UNIT}
                </Text>
              </Flex>
              {/* Down payment */}
              <Flex justify={'space-between'}>
                <Text color='gray.3'>Down payment</Text>
                <Text color='gray.3'>
                  {commodityPrice.minus(loanAmount).toFormat(FIXED_NUM)} {UNIT}
                </Text>
              </Flex>
              {/* Loan amount */}
              <Flex justify={'space-between'}>
                <Text color='gray.3'>Loan amount</Text>
                <Text color='gray.3'>
                  {loanAmount.toFormat(FIXED_NUM)} {UNIT}
                </Text>
              </Flex>
              {/* Interest fee */}
              <Flex justify={'space-between'}>
                <Text color='gray.3'>Interest fee</Text>
                <Text color='gray.3'>
                  {getPlanPer(installmentValue)
                    .multipliedBy(installmentValue)
                    .minus(loanAmount)
                    .toFixed(FIXED_NUM)}
                  {UNIT}
                </Text>
              </Flex>
              <Divider color='gray.2' />
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
                    .toFixed(FIXED_NUM)}
                  {UNIT}
                </Text>
              </Flex>
              {/* Floor breakeven */}
              <Flex justify={'space-between'}>
                <Text fontSize={'md'} fontWeight='bold'>
                  Floor breakeven
                </Text>
                <Text fontSize={'md'} fontWeight='bold'>
                  {/* {getPlanPer(installmentValue)
                    .multipliedBy(installmentValue)
                    .minus(loanAmount)
                    .plus(commodityPrice)
                    .toFixed(FIXED_NUM)}
                  {UNIT} */}
                  xxx
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
          isDisabled={
            !loanAmount || detailLoading || filterLoading || isEmpty(selectPool)
          }
        >
          <Text fontWeight={'400'}>Down payment</Text>&nbsp;
          {commodityPrice?.minus(loanAmount || 0).toFormat(FIXED_NUM)} {UNIT}
        </Button>
      </Box>

      <ConnectWalletModal visible={isOpen} handleClose={onClose} />
    </SimpleGrid>
  )
}

export default NftAssetDetail
