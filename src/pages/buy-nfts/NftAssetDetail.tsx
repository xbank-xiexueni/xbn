import {
  Box,
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
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { floor, minBy } from 'lodash-es'
import isEmpty from 'lodash-es/isEmpty'
import min from 'lodash-es/min'
import range from 'lodash-es/range'
import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import type { PoolsListItemType } from '@/api'
import { apiGetAssetDetail, apiGetPools } from '@/api'
import {
  ConnectWalletModal,
  ImageWithFallback,
  SvgComponent,
} from '@/components'
import { COLLATERALS, TENORS, UNIT } from '@/constants'
import { useWallet } from '@/hooks'
import { amortizationCalByDays } from '@/utils/calculation'

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
  const { state: collectionData } = useLocation()

  const [commodityPrice, setCommodityPrice] = useState<BigNumber>()
  const [detail, setDetail] = useState({
    asset: '',
    image: '',
  })
  const [notFound, setNotFound] = useState(false)
  const { loading: detailLoading } = useRequest(apiGetAssetDetail, {
    ready: !!id,
    defaultParams: [{ id: id as string }],
    onSuccess: ({ data }) => {
      setCommodityPrice(BigNumber(min([data.price, data.oraclePrice])))
      setDetail({
        image: data?.image,
        asset: data.name,
      })
    },
    debounceWait: 100,
    onError: ({ response: { status } }: any) => {
      if (status === 404) {
        setNotFound(true)
      }
    },
  })

  const [sliderValue, setSliderValue] = useState(COLLATERALS[4])
  const [loanAmount, setLoanAmount] = useState<BigNumber>()

  useEffect(() => {
    if (!commodityPrice) return
    setLoanAmount(commodityPrice.multipliedBy(sliderValue).dividedBy(100))
  }, [sliderValue, commodityPrice])

  const [pools, setPools] = useState<PoolType[]>([])

  const [selectPool, setSelectPool] = useState<PoolType>()
  const [filterPools, setFilterPools] = useState<PoolsListItemType[]>([])

  const [filterLoading, setFilterLoading] = useState(false)

  const { loading: getPoolLoading } = useRequest(apiGetPools, {
    defaultParams: [
      {
        allow_collateral_contract: collectionData?.contract_addr,
      },
    ],
    ready: !!id && !!collectionData?.contract_addr,
    debounceWait: 100,
    onSuccess: async ({ data }) => {
      if (!data) return
      const _filter: PoolsListItemType[] = []
      const taskPromises = data.map((item) => {
        return window?.ethereum
          .request({
            method: 'eth_getBalance',
            params: [item.owner_address, 'latest'],
          })
          .then((res: string) => {
            const currentBalance = Number(ethers.utils.formatEther(res))
            console.log(
              '🚀 ~ file: NftAssetDetail.tsx:137 ~ .then ~ currentBalance:',
              item.pool_maximum_percentage / 100 >= sliderValue,
              loanAmount?.lte(currentBalance),
            )

            if (
              item.pool_maximum_percentage / 100 >= sliderValue &&
              loanAmount?.lte(currentBalance)
            ) {
              _filter.push(item)
              console.log(_filter, '1212')
            }
          })
          .catch((error: any) => {
            console.log(
              '🚀 ~ file: NftAssetDetail.tsx:150 ~ .then ~ error:',
              error,
            )
          })
      })
      setFilterLoading(true)
      await Promise.all(taskPromises)
      console.log(_filter, 'before')
      setFilterPools(_filter)
      setFilterLoading(false)
    },
  })

  useEffect(() => {
    if (isEmpty(filterPools)) {
      return
    }

    //0.000001
    const currentPools: PoolType[] = []
    for (let index = 0; index < TENORS.length; index++) {
      const item = TENORS[index]
      const currentFilterPools = filterPools.filter(
        (i) => i.pool_maximum_days >= item,
      )
      if (isEmpty(currentFilterPools)) break
      const currentPool = minBy(
        currentFilterPools.map(
          ({
            pool_id,
            pool_maximum_interest_rate,
            pool_maximum_days,
            loan_time_concession_flexibility,
            pool_maximum_percentage,
            loan_ratio_preferential_flexibility,
          }) => {
            const rate = pool_maximum_interest_rate / 100
            const timeFlex = loan_time_concession_flexibility / 10000
            const ratioFlex = loan_ratio_preferential_flexibility / 10000
            const percentage = pool_maximum_percentage / 100
            return {
              pool_id,
              poolApr:
                rate -
                (TENORS.indexOf(pool_maximum_days) - index) * timeFlex -
                ((percentage - sliderValue) / 10) * ratioFlex,
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
  }, [sliderValue, filterPools])

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

  if (notFound)
    return (
      <Alert status='error' justifyContent={'space-between'}>
        <Flex>
          <AlertIcon />
          not found
        </Flex>

        <Link to='/buy-nfts/market'>
          <Text color='black.1'>go to Market</Text>
        </Link>
      </Alert>
    )
  return (
    <Flex
      justify={{
        lg: 'space-between',
        md: 'center',
      }}
      alignItems='flex-start'
      flexWrap={{ lg: 'nowrap', md: 'wrap', sm: 'wrap' }}
      gap={10}
    >
      {detailLoading ? (
        <Skeleton height={700} borderRadius={16} />
      ) : (
        <Flex
          justify={{
            xl: 'flex-start',
            lg: 'center',
          }}
          alignItems={{
            xl: 'flex-start',
            lg: 'center',
          }}
          w={{
            xl: '600px',
            lg: '450px',
            md: '80%',
            sm: '100%',
          }}
          flexDirection={'column'}
        >
          <ImageWithFallback
            src={detail?.image}
            borderRadius={20}
            boxSize={{
              xl: '600px',
              lg: '380px',
              md: '100%',
            }}
          />
          <BelongToCollection
            data={{
              ...collectionData,
            }}
          />
        </Flex>
      )}

      <Box
        w={{
          lg: '600px',
          md: '100%',
        }}
      >
        {/* 价格 名称 */}
        <DetailComponent
          data={{
            name1: collectionData?.name,
            name2: detail?.asset,
            price: commodityPrice?.toFormat(4) || '',
            verified: collectionData?.safelist_request_status === 'verified',
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
          loading={filterLoading || getPoolLoading}
        >
          <Flex gap={2} flexWrap='wrap'>
            {pools.map(({ poolID, poolApr, poolDays }) => {
              return (
                <Flex
                  key={`${poolID}-${poolApr}-${poolDays}`}
                  w={`${100 / pools.length}%`}
                  minW='137px'
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
                        {`${poolApr && floor(poolApr, 4)} % APR`}
                      </Highlight>
                    </Text>
                  </RadioCard>
                </Flex>
              )
            })}
          </Flex>
        </LabelComponent>

        {/* Number of installments */}
        <LabelComponent
          label='Number of installments'
          isEmpty={isEmpty(installmentOptions)}
          loading={filterLoading || getPoolLoading}
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
            loading={filterLoading || getPoolLoading}
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
          loading={filterLoading || getPoolLoading}
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
            !loanAmount ||
            detailLoading ||
            filterLoading ||
            isEmpty(selectPool) ||
            getPoolLoading
          }
        >
          <Text fontWeight={'400'}>Down payment</Text>&nbsp;
          {commodityPrice?.minus(loanAmount || 0).toFormat(FIXED_NUM)} {UNIT}
        </Button>
      </Box>

      <ConnectWalletModal visible={isOpen} handleClose={onClose} />
    </Flex>
  )
}

export default NftAssetDetail
