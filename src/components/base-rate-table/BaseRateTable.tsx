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
import floor from 'lodash-es/floor'
import slice from 'lodash-es/slice'
import { type FunctionComponent, useMemo, useState } from 'react'

import { COLLATERALS, LP_BASE_RATE, TENORS } from '@/constants'

const TOP_SLIDER_STEPS = [0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6]

const RIGHT_SLIDER_STEPS = [0, 0.5, 1, 1.5, 2]

const BOTTOM_SLIDER_STEPS = [0, 0.5, 1, 1.5, 2]

const BaseRateTable: FunctionComponent<{
  selectTenor: number
  selectCollateral: number
  onChange?: (
    poolMaximumInterestRate: number,
    loanRatioPreferentialFlexibility: number,
    loanTimeConcessionFlexibility: number,
  ) => void
}> = ({ selectCollateral, selectTenor, onChange }) => {
  const baseRate = useMemo((): number => {
    return LP_BASE_RATE[`${selectTenor}-${selectCollateral}`]
  }, [selectTenor, selectCollateral])

  const [sliderTopValue, setSliderTopValue] = useState(1)
  const [sliderRightValue, setSliderRightValue] = useState(1)
  const [sliderBottomValue, setSliderBottomValue] = useState(1)

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

        return floor(res, 2)
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
          defaultValue={1}
          min={TOP_SLIDER_STEPS[0]}
          max={TOP_SLIDER_STEPS[TOP_SLIDER_STEPS.length - 1]}
          step={0.2}
          mt={10}
          mx={12}
          onChange={(target) => {
            setSliderTopValue(target)
            if (!onChange) return
            onChange(baseRate * target, sliderRightValue, sliderBottomValue)
          }}
          mb={8}
        >
          {TOP_SLIDER_STEPS.map((item) => (
            <SliderMark value={item} fontSize='sm' key={item} zIndex={1}>
              <Box
                w={2}
                h={2}
                borderRadius={8}
                borderWidth={1}
                borderColor='white'
                mt={-1}
                bg={sliderTopValue > item ? `blue.1` : `gray.1`}
              />
            </SliderMark>
          ))}

          <SliderMark
            value={TOP_SLIDER_STEPS[0]}
            mt={4}
            ml='-2.5'
            fontSize='sm'
            color={`gray.3`}
          >
            min
          </SliderMark>
          <SliderMark
            value={TOP_SLIDER_STEPS[TOP_SLIDER_STEPS.length - 1]}
            ml='-2.5'
            fontSize='sm'
            mt={4}
            color={`gray.3`}
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
            boxSize={6}
            borderWidth={5}
            borderColor={`blue.1`}
            _focus={{
              boxShadow: 'none',
            }}
          />
          <SlideFade />
        </Slider>
      </Flex>

      <Flex justify={'flex-end'} w='100%' alignItems={'center'} gap={8}>
        <Box
          bg='white'
          borderRadius={8}
          padding={2}
          mt={6}
          w='660px'
          pos={'relative'}
        >
          <Flex>
            {[
              'Collateral Factor/ Tenor',
              ...currentTenors.map((i) => `${i} Days`),
            ].map((item) => (
              <Flex
                key={item}
                w={`${(1 / (colCount || 1)) * 100}%`}
                alignItems={'center'}
                justify='center'
                h='40px'
                borderBottomColor='gray.2'
                borderBottomWidth={1}
              >
                <Text
                  textAlign={'center'}
                  fontSize='xs'
                  fontWeight={'bold'}
                  lineHeight='12px'
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
                key={`${JSON.stringify(row)}-${index}`}
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
                      key={`${value}-${i}`}
                      /* eslint-disable */
                      alignItems={'center'}
                      justify='center'
                      h='40px'
                      w={`${(1 / (colCount || 1)) * 100}%`}
                    >
                      <Text
                        textAlign={'center'}
                        fontSize='xs'
                        fontWeight={i === 0 ? 'bold' : 'normal'}
                        color={i === 0 ? `black.1` : `gray.3`}
                      >
                        {value}%
                      </Text>
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
          gap={1}
          onMouseEnter={() => setRightTipVisible(true)}
          onMouseLeave={() => setRightTipVisible(false)}
        >
          {rightTipVisible && <Box color={'gray.4'}>-</Box>}
          <Slider
            orientation='vertical'
            direction='ltr'
            defaultValue={1}
            min={RIGHT_SLIDER_STEPS[0]}
            max={RIGHT_SLIDER_STEPS[RIGHT_SLIDER_STEPS.length - 1]}
            h='132px'
            step={0.5}
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
              boxSize={4}
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
      <Flex justify={'center'} mt={5}>
        <Flex
          alignItems={'center'}
          gap={2}
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
            step={0.2}
            defaultValue={1}
            mt={1}
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
              boxSize={4}
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
