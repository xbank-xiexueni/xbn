import {
  Box,
  Divider,
  Flex,
  SlideFade,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
  type FlexProps,
} from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import ceil from 'lodash-es/ceil'
import isEmpty from 'lodash-es/isEmpty'
import maxBy from 'lodash-es/maxBy'
import minBy from 'lodash-es/minBy'
import range from 'lodash-es/range'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FunctionComponent,
} from 'react'

import ImgNft from '@/assets/nft.png'
import { EmptyComponent, ImageWithFallback, SvgComponent } from '@/components'
import { COLLATERALS, TENORS, UNIT } from '@/constants'
import { amortizationCalByDays } from '@/utils/calculation'
import { formatFloat } from '@/utils/format'
import { wei2Eth } from '@/utils/unit-conversion'

enum LOAN_DAYS_ENUM {
  Loan7Days = 7,
  Loan14Days = 14,
  Loan30Days = 30,
  Loan60Days = 60,
  Loan90Days = 90,
}

type PoolType = {
  pool_id: number
  pool_apr: number
  pool_days: LOAN_DAYS_ENUM
}

const originPoolList = [
  {
    id: 2,
    pool_id: 1,
    owner_address: '0x90FD70584270333a17f6E1f0022161AE495EA5F8',
    allow_collateral_contract: '0x10B8b56D53bFA5e374f38e6C0830BAd4ebeE33E6',
    support_erc20_denomination: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    pool_amount: 50000000000000000,
    pool_used_amount: 0,
    loan_count: 0,
    pool_maximum_percentage: 5000,
    pool_maximum_days: 60,
    pool_maximum_interest_rate: 5400,
    loan_time_concession_flexibility: 100,
    loan_ratio_preferential_flexibility: 50,
    activity: true,
  },
]

const InfoCard: FunctionComponent<
  FlexProps & { title: string; isNull?: boolean }
> = ({ title, isNull, children, ...rest }) => {
  return (
    <Flex
      flexDir={'column'}
      borderBottomColor='gray.2'
      py='10'
      borderBottomWidth={1}
      {...rest}
    >
      <Text fontSize={'20px'} fontWeight='700' mb='24px'>
        {title}
      </Text>
      {isNull ? <EmptyComponent mt={'40px'} mb={0} /> : children}
    </Flex>
  )
}

const H5Demo = () => {
  const [percentage, setPercentage] = useState(COLLATERALS[4])
  const [commodityWeiPrice] = useState(BigNumber(28000000000000000))

  useEffect(() => {
    if (isEmpty(originPoolList) || !originPoolList) {
      setPercentage(COLLATERALS[4])
      return
    }
    const percentagesMax = maxBy(
      originPoolList,
      (i) => i.pool_maximum_percentage,
    )?.pool_maximum_percentage
    if (!percentagesMax) {
      return
    }
    // 滑竿默认定位在这笔订单匹配到的所有贷款 offer 的刻度区间中最中间的那个刻度
    const defaultPercentage = ceil(percentagesMax / 1000 / 2) * 1000
    setPercentage(10000 - defaultPercentage)
  }, [])

  const loanPercentage = useMemo(() => 10000 - percentage, [percentage])
  // 首付价格
  const downPaymentWei = useMemo(() => {
    if (!commodityWeiPrice) return BigNumber(0)
    return commodityWeiPrice.multipliedBy(percentage).dividedBy(10000)
  }, [commodityWeiPrice, percentage])

  // 贷款价格
  const loanWeiAmount = useMemo(() => {
    return commodityWeiPrice.minus(downPaymentWei)
  }, [commodityWeiPrice, downPaymentWei])

  const [selectPool, setSelectPool] = useState<PoolType>()

  const pools = useMemo(() => {
    if (!originPoolList || isEmpty(originPoolList) || loanWeiAmount?.eq(0)) {
      setSelectPool(undefined)
      return []
    }
    const filterPercentageAndLatestBalancePools = originPoolList.filter(
      (item) => {
        // 此 pool 最新可用资产
        const poolLatestCanUseAmount = BigNumber(item.pool_amount).minus(
          item.pool_used_amount,
        )

        return (
          item.pool_maximum_percentage >= loanPercentage &&
          loanWeiAmount.lte(poolLatestCanUseAmount)
        )
      },
    )
    const currentPools: PoolType[] = []
    for (let index = 0; index < TENORS.length; index++) {
      // 7 14 30 60 90
      const item = TENORS[index]
      const currentFilterPools = filterPercentageAndLatestBalancePools.filter(
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
            return {
              pool_id,
              pool_apr:
                pool_maximum_interest_rate -
                (TENORS.indexOf(pool_maximum_days) - index) *
                  loan_time_concession_flexibility -
                // percentage 与最大贷款比例的 差
                // 4000 6000 => 1
                ((pool_maximum_percentage - loanPercentage) / 1000) *
                  loan_ratio_preferential_flexibility,
              pool_days: item,
            }
          },
        ),
        (i) => i.pool_apr,
      )
      if (!currentPool) break
      currentPools.push(currentPool)
    }
    setSelectPool(currentPools?.length > 1 ? currentPools[1] : currentPools[0])

    return currentPools
  }, [loanPercentage, loanWeiAmount])

  useEffect(() => {
    if (!pools) return
    setSelectPool(pools[1])
  }, [pools])

  // number of installments
  const [installmentOptions, setInstallmentOptions] = useState<(1 | 2 | 3)[]>()
  const [installmentValue, setInstallmentValue] = useState<1 | 2 | 3>(1)

  useEffect(() => {
    if (isEmpty(selectPool)) {
      setInstallmentOptions([])
      return
    }
    const { pool_days } = selectPool
    if (pool_days === LOAN_DAYS_ENUM.Loan7Days) {
      setInstallmentOptions([1])
      setInstallmentValue(1)
      return
    }
    setInstallmentValue(2)
    if (pool_days === LOAN_DAYS_ENUM.Loan14Days) {
      setInstallmentOptions([1, 2])
      return
    }
    setInstallmentOptions([1, 2, 3])
  }, [selectPool])

  const getPlanPer = useCallback(
    (value: 1 | 2 | 3) => {
      if (!loanWeiAmount || isEmpty(selectPool)) {
        return BigNumber(0)
      }
      const { pool_days, pool_apr } = selectPool
      const loanEthAmount = Number(wei2Eth(loanWeiAmount))
      const apr = pool_apr / 10000
      return amortizationCalByDays(loanEthAmount, apr, pool_days, value)
    },
    [selectPool, loanWeiAmount],
  )

  return (
    <Flex flexDirection={'column'} pb='200px'>
      {/* header*/}
      <Flex py='20px' justify={'space-between'}>
        <SvgComponent
          svgId='icon-arrow-down'
          transform={'rotate(90deg)'}
          cursor='pointer'
          onClick={() => {
            window.history.back()
          }}
        />
        <Text fontSize={'14px'} fontWeight='700'>
          Buy NFTs
        </Text>
        <Flex w='18px' />
      </Flex>
      {/* nft info */}
      <Flex flexDir={'column'}>
        <Flex gap={'12px'} alignItems='center'>
          <ImageWithFallback src={ImgNft} w='16' h='16' />
          <Flex flexDir={'column'}>
            <Text fontSize={'16px'} fontWeight='700'>
              MimicShhans #4088
            </Text>
            <Text fontSize={'12px'} fontWeight='500'>
              0.028 ETH
            </Text>
          </Flex>
        </Flex>
        <Flex borderRadius={8} bg='green.2' p={'4px'} mt={'28px'} gap='8px'>
          <SvgComponent
            svgId='icon-arrow'
            transform={'rotate(135deg)'}
            fill='var(--chakra-colors-green-3)'
          />
          <Text color='green.3' fontSize={'12px'} fontWeight='700'>
            +158.38% in the last 30 days.
          </Text>
        </Flex>
      </Flex>
      {/* down payment */}
      <InfoCard title='Down Payment'>
        <Flex
          p='16px'
          pr={'24px'}
          border={`1px solid var(--chakra-colors-gray-1)`}
          borderRadius={16}
          alignItems='center'
          gap={'8px'}
        >
          {downPaymentWei && (
            <Flex
              py='12px'
              bg='gray.5'
              borderRadius={8}
              gap={'4px'}
              alignItems='center'
              justify={'center'}
              px={'4px'}
            >
              <SvgComponent svgId='icon-eth' svgSize='20px' />
              <Text fontSize={'12px'} fontWeight='700'>
                {wei2Eth(downPaymentWei)}
              </Text>
            </Flex>
          )}

          <Divider orientation='vertical' h='24px' />
          <Slider
            min={COLLATERALS[0]}
            max={COLLATERALS[COLLATERALS.length - 1]}
            step={1000}
            onChange={(target) => {
              setPercentage(target)
            }}
            value={percentage}
          >
            {COLLATERALS.map((item) => (
              <SliderMark value={item} key={item} zIndex={1}>
                <Box
                  w={'6px'}
                  h={'6px'}
                  borderRadius={5}
                  borderWidth={'1px'}
                  borderColor='white'
                  mt={-0.5}
                  bg={percentage > item ? 'blue.1' : 'gray.1'}
                />
              </SliderMark>
            ))}
            <SliderTrack bg='gray.1' h='2px' mt='0.6'>
              <SliderFilledTrack
                bgGradient={`linear-gradient(90deg,#fff,var(--chakra-colors-blue-1))`}
              />
            </SliderTrack>
            <SliderThumb
              boxSize='24px'
              borderWidth={5}
              borderColor={'blue.1'}
              _focus={{
                boxShadow: 'none',
              }}
            />
            <SlideFade />
          </Slider>
        </Flex>

        <Flex justify={'center'} gap={'4px'} alignItems='center' mt='24px'>
          <Text fontSize='12px' fontWeight='500'>
            Loan amount
          </Text>
          <SvgComponent svgId='icon-eth' svgSize='12px' />
          <Text fontSize='12px' fontWeight='500'>
            {wei2Eth(loanWeiAmount)}
          </Text>
        </Flex>
      </InfoCard>

      {/* Loan Period */}
      <InfoCard title='Loan Period' isNull={isEmpty(pools)}>
        <Flex flexDir={'column'} gap={'8px'}>
          {pools.map((item) => (
            <Flex
              h='72px'
              alignItems={'center'}
              justify={'space-between'}
              key={JSON.stringify(item)}
              px='16px'
              borderWidth={selectPool?.pool_days === item.pool_days ? 2 : 1}
              borderRadius={8}
              onClick={() => setSelectPool(item)}
              borderColor={
                selectPool?.pool_days === item.pool_days ? 'blue.1' : 'gray.1'
              }
            >
              <Text fontSize={'16px'} fontWeight='700'>
                {item.pool_days} Days
              </Text>
              <Text fontSize={'12px'} fontWeight='400'>
                {item.pool_apr / 100} %{' '}
              </Text>
            </Flex>
          ))}
        </Flex>
      </InfoCard>

      {/* Number of installments */}
      <InfoCard
        title='Number of installments'
        isNull={isEmpty(installmentOptions)}
      >
        <Flex flexDir={'column'} gap={'8px'}>
          {installmentOptions?.map((value) => {
            return (
              <Flex
                h='72px'
                flexDir={'column'}
                justify='center'
                key={JSON.stringify(value)}
                px='16px'
                gap={'8px'}
                borderWidth={installmentValue === value ? 2 : 1}
                borderRadius={8}
                onClick={() => setInstallmentValue(value)}
                borderColor={installmentValue === value ? 'blue.1' : 'gray.1'}
              >
                <Text fontWeight={700} fontSize='16px'>
                  Pay in {value} installments
                </Text>
                <Text fontWeight={500} fontSize='12px'>
                  {formatFloat(getPlanPer(value))}
                  &nbsp;
                  {UNIT}/per
                </Text>
              </Flex>
            )
          })}
        </Flex>
      </InfoCard>

      {/* Repayment Plan */}
      {!commodityWeiPrice.eq(0) && !loanWeiAmount.eq(0) && (
        <InfoCard title='Repayment Plan' isNull={!selectPool}>
          <VStack
            bg='gray.5'
            py={'16px'}
            px={'16px'}
            borderRadius={12}
            spacing={'8px'}
          >
            <Flex justify={'space-between'} w='100%'>
              <Flex>
                <SvgComponent svgId='icon-calendar' />
                &nbsp;&nbsp;
                <Text fontSize='14px' fontWeight='400'>
                  Down payment on today
                </Text>
              </Flex>
              <Text fontSize='14px' fontWeight='medium'>
                {wei2Eth(downPaymentWei)}
              </Text>
            </Flex>
            {range(installmentValue).map((value, index) => (
              <Flex justify={'space-between'} w='100%' key={value}>
                <Flex>
                  <SvgComponent svgId='icon-calendar' />
                  &nbsp;&nbsp;
                  <Text fontSize='14px' fontWeight='400'>
                    {dayjs()
                      .add(
                        ((selectPool?.pool_days || 0) / installmentValue) *
                          (index + 1),
                        'days',
                      )
                      .format('YYYY/MM/DD')}
                  </Text>
                </Flex>
                <Text fontSize='14px' fontWeight='medium'>
                  {formatFloat(getPlanPer(installmentValue))} {UNIT}
                </Text>
              </Flex>
            ))}
          </VStack>
        </InfoCard>
      )}
    </Flex>
  )
}

export default H5Demo
