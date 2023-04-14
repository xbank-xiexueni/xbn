import {
  Flex,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderTrack,
  Text,
  SliderThumb,
  Box,
  SlideFade,
} from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import slice from 'lodash-es/slice'
import { type FunctionComponent, useMemo, useState, useEffect } from 'react'

import { COLLATERALS, LP_BASE_RATE, TENORS } from '@/constants'

import ScrollNumber from '../scroll-number/ScrollNumber'

const TOP_SLIDER_STEPS = [0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6]

const RIGHT_SLIDER_STEPS = [0, 50, 100, 150, 200]

const BOTTOM_SLIDER_STEPS = [0, 50, 100, 150, 200]

const BaseRateTable: FunctionComponent<{
  selectTenor: number
  selectCollateral: number
  defaultValue?: {
    loan_ratio_preferential_flexibility: number
    loan_time_concession_flexibility: number
    pool_maximum_interest_rate: number
  }
  onChange?: (
    poolMaximumInterestRate: number,
    loanRatioPreferentialFlexibility: number,
    loanTimeConcessionFlexibility: number,
  ) => void
}> = ({ selectCollateral, selectTenor, onChange, defaultValue }) => {
  const baseRate = useMemo((): number => {
    return LP_BASE_RATE[`${selectTenor}-${selectCollateral}`]
  }, [selectTenor, selectCollateral])

  const [sliderTopValue, setSliderTopValue] = useState(1)
  const [sliderRightValue, setSliderRightValue] = useState(100)
  const [sliderBottomValue, setSliderBottomValue] = useState(100)

  const initialSliderTopValue = useMemo(
    () =>
      defaultValue ? defaultValue.pool_maximum_interest_rate / baseRate : 1,
    [defaultValue, baseRate],
  )

  const initialSliderRightValue = useMemo(
    () => defaultValue?.loan_ratio_preferential_flexibility || 100,
    [defaultValue],
  )
  const initialSliderBottomValue = useMemo(
    () => defaultValue?.loan_time_concession_flexibility || 100,
    [defaultValue],
  )

  useEffect(() => {
    setSliderBottomValue(initialSliderBottomValue)
    setSliderRightValue(initialSliderRightValue)
    setSliderTopValue(initialSliderTopValue)
  }, [initialSliderBottomValue, initialSliderRightValue, initialSliderTopValue])

  const colCount = useMemo(() => TENORS.indexOf(selectTenor) + 1, [selectTenor])
  const rowCount = useMemo(
    () => COLLATERALS.indexOf(selectCollateral) + 1,
    [selectCollateral],
  )

  const currentTenors = useMemo(() => {
    return slice(TENORS, 0, colCount)
  }, [colCount])
  const currentCollaterals = useMemo(
    () => slice(COLLATERALS, 0, rowCount),
    [rowCount],
  )

  const tableData = useMemo(() => {
    const arr = new Array(rowCount)
    for (let i = 0; i < rowCount; i++) {
      const forMapArr = [...currentTenors]
      arr[i] = forMapArr.map((_, index) => {
        const res =
          baseRate * sliderTopValue -
          ((rowCount - i - 1) * sliderRightValue +
            (colCount - index - 1) * sliderBottomValue)

        return res
      })
    }
    return arr
  }, [
    colCount,
    rowCount,
    currentTenors,
    baseRate,
    sliderRightValue,
    sliderBottomValue,
    sliderTopValue,
  ])

  const [bottomTipVisible, setBottomTipVisible] = useState(false)
  const [rightTipVisible, setRightTipVisible] = useState(false)

  return (
    <>
      <Flex>
        <Slider
          defaultValue={initialSliderTopValue}
          min={TOP_SLIDER_STEPS[0]}
          max={TOP_SLIDER_STEPS[TOP_SLIDER_STEPS.length - 1]}
          step={0.2}
          mt={'40px'}
          mx={{
            md: 12,
            xs: 2,
            sm: 2,
          }}
          onChange={(target) => {
            setSliderTopValue(target)
            if (!onChange) return
            onChange(baseRate * target, sliderRightValue, sliderBottomValue)
          }}
          mb={8}
        >
          {TOP_SLIDER_STEPS.map((item) => (
            <SliderMark value={item} fontSize='14px' key={item} zIndex={1}>
              <Box
                w={'12px'}
                h={'12px'}
                boxSize={{
                  md: '12px',
                  sm: '6px',
                  xs: '6px',
                }}
                borderRadius={8}
                borderWidth={{ md: 3, sm: 1, xs: 1 }}
                borderColor='white'
                mt={{
                  md: '-6px',
                  sm: -1,
                  xs: -1,
                }}
                bg={sliderTopValue > item ? `blue.1` : `gray.1`}
              />
            </SliderMark>
          ))}

          <SliderMark
            value={TOP_SLIDER_STEPS[0]}
            mt='16px'
            ml='-2.5'
            fontSize='12px'
            color={`gray.3`}
          >
            min
          </SliderMark>
          <SliderMark
            value={TOP_SLIDER_STEPS[TOP_SLIDER_STEPS.length - 1]}
            fontSize='12px'
            mt='16px'
            color={`gray.3`}
            ml='-3.5'
          >
            max
          </SliderMark>
          {/* <SliderMark
            value={sliderTopValue}
            textAlign='center'
            // color='white'
            mt='-10'
            ml='-5'
            w='12'
            zIndex={5}
          >
            {sliderTopValue}%
          </SliderMark> */}
          <SliderTrack bg={`gray.1`}>
            <SliderFilledTrack
              // bg={`var(--chakra-colors-blue-2)`}
              bgGradient={`linear-gradient(90deg,#fff,var(--chakra-colors-blue-1))`}
            />
          </SliderTrack>
          <SliderThumb
            boxSize='24px'
            borderWidth={'5px'}
            borderColor={`blue.1`}
            _focus={{
              boxShadow: 'none',
            }}
          />
          <SlideFade />
        </Slider>
      </Flex>

      <Flex
        justify={{
          md: 'flex-end',
          sm: 'space-between',
          xs: 'space-between',
        }}
        w='100%'
        alignItems={'center'}
        gap={{
          md: 8,
          sm: '4px',
          xs: '4px',
        }}
      >
        <Box
          bg='white'
          borderRadius={8}
          p={{
            md: 2,
            sm: 0,
            xs: 0,
          }}
          mt='24px'
          w={{
            md: '660px',
            sm: '95%',
            xs: '95%',
          }}
          pos={'relative'}
        >
          <Flex>
            {[
              'Collateral Factor/ Tenor',
              ...currentTenors.map((i) => `${i} Days`),
            ].map((item, i) => (
              <Flex
                key={item}
                w={`${(1 / (colCount || 1)) * 100}%`}
                alignItems={'center'}
                justify='center'
                h={'40px'}
                borderBottomColor='gray.2'
                borderBottomWidth={1}
              >
                <Text
                  textAlign={'center'}
                  fontSize='12px'
                  fontWeight={'bold'}
                  lineHeight='12px'
                  transform={{
                    md: 'none',
                    sm: `scale(${i !== 0 ? 0.83333 : 0.66666})`,
                    xs: `scale(${i !== 0 ? 0.83333 : 0.66666})`,
                  }}
                  transformOrigin='center'
                >
                  {item}
                </Text>
              </Flex>
            ))}
          </Flex>

          {/* table */}
          {tableData.map((row, index) => {
            return (
              <Flex
                /* eslint-disable */
                key={index}
                /* eslint-disable */
                borderBottom={
                  index !== tableData?.length - 1
                    ? `1px solid var(--chakra-colors-gray-2)`
                    : 'none'
                }
              >
                {[currentCollaterals[index], ...row]?.map(
                  (value: string, i: number) => (
                    <Flex
                      /* eslint-disable */
                      key={i}
                      /* eslint-disable */
                      alignItems={'center'}
                      justify='center'
                      h={{
                        md: '40px',
                        sm: '35px',
                        xs: '35px',
                      }}
                      w={`${(1 / (colCount || 1)) * 100}%`}
                    >
                      {i === 0 ? (
                        <Text
                          textAlign={'center'}
                          fontSize='12px'
                          fontWeight={'bold'}
                          color={'black.1'}
                          transform={{
                            md: 'none',
                            sm: 'scale(0.83333)',
                            xs: 'scale(0.83333)',
                          }}
                          transformOrigin='center'
                        >
                          {Number(value) / 100}%
                        </Text>
                      ) : (
                        <ScrollNumber
                          value={`${BigNumber(value)
                            .dividedBy(100)
                            .toFormat(2)}%`}
                          color={
                            i === row?.length && index === tableData?.length - 1
                              ? 'blue.1'
                              : 'gray.3'
                          }
                          fontWeight={
                            i === row?.length && index === tableData?.length - 1
                              ? '700'
                              : '500'
                          }
                        />
                      )}
                    </Flex>
                  ),
                )}
              </Flex>
            )
          })}
        </Box>

        <Flex
          flexDir={'column'}
          alignItems='center'
          gap={'4px'}
          onMouseEnter={() => setRightTipVisible(true)}
          onMouseLeave={() => setRightTipVisible(false)}
        >
          {rightTipVisible && <Box color={'gray.4'}>-</Box>}
          <Slider
            orientation='vertical'
            direction='ltr'
            defaultValue={initialSliderRightValue}
            min={RIGHT_SLIDER_STEPS[0]}
            max={RIGHT_SLIDER_STEPS[RIGHT_SLIDER_STEPS.length - 1]}
            h='132px'
            step={50}
            onChange={(target) => {
              // setSliderValue(target)
              setSliderRightValue(target)
              if (!onChange) return
              onChange(baseRate * sliderTopValue, target, sliderBottomValue)
            }}
          >
            <SliderTrack bg={`gray.1`}>
              <SliderFilledTrack bg={`blue.1`} />
            </SliderTrack>
            <SliderThumb
              boxSize={'16px'}
              borderWidth={'2px'}
              borderColor={`blue.1`}
              _focus={{
                boxShadow: 'none',
              }}
            />
          </Slider>
          {rightTipVisible && <Box color={'gray.4'}>+</Box>}
        </Flex>
      </Flex>
      <Flex justify={'center'} mt={'20px'}>
        <Flex
          alignItems={'center'}
          gap={'8px'}
          justify='center'
          onMouseEnter={() => setBottomTipVisible(true)}
          onMouseLeave={() => setBottomTipVisible(false)}
          h='30px'
        >
          {bottomTipVisible && <Box color={'gray.4'}>-</Box>}

          <Slider
            min={BOTTOM_SLIDER_STEPS[0]}
            max={BOTTOM_SLIDER_STEPS[BOTTOM_SLIDER_STEPS.length - 1]}
            w='140px'
            step={50}
            defaultValue={initialSliderBottomValue}
            mt={'4px'}
            onChange={(target) => {
              setSliderBottomValue(target)
              if (!onChange) return
              onChange(baseRate * sliderTopValue, sliderRightValue, target)
            }}
          >
            <SliderTrack bg={`gray.1`}>
              <SliderFilledTrack bg={`blue.1`} />
            </SliderTrack>
            <SliderThumb
              boxSize={'16px'}
              borderWidth={'2px'}
              borderColor={`blue.1`}
              _focus={{
                boxShadow: 'none',
              }}
            />
          </Slider>
          {bottomTipVisible && <Box color={'gray.4'}>+</Box>}
        </Flex>
      </Flex>
    </>
  )
}

export default BaseRateTable
