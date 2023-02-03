import {
  Card,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderTrack,
  Text,
  SliderThumb,
  Box,
  Button,
  SlideFade,
} from '@chakra-ui/react'
import slice from 'lodash/slice'
import { type FunctionComponent, useMemo, useState } from 'react'

import { DescriptionComponent } from '@/pages/Lend/Create'
import COLORS from '@/utils/Colors'
import { COLLATERALS, LP_BASE_RATE, TENORS } from '@/utils/constants'

const TOP_SLIDER_STEPS = [0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6]

const RIGHT_SLIDER_STEPS = [0, 0.5, 1, 1.5, 2]

const BOTTOM_SLIDER_STEPS = [0, 0.5, 1, 1.5, 2]

const LpBaseRateTable: FunctionComponent<{
  selectTenor: number
  selectCollateral: number
  description?: { title: string; text: string }
}> = ({ selectCollateral, selectTenor, description }) => {
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
    const arr = new Array(rowCount) //表格有10行
    for (let i = 0; i < rowCount; i++) {
      const forMapArr = [...currentTenors]
      arr[i] = forMapArr.map((_, index) => {
        return (
          (baseRate -
            ((rowCount - i - 1) * sliderRightValue +
              (colCount - index - 1) * sliderBottomValue)) *
          sliderTopValue
        ).toFixed(2)
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

  return (
    <Card mb={8} bg={COLORS.secondaryBgc} borderRadius={'16px'} p={8}>
      <Flex wrap={'wrap'}>
        {description && (
          <DescriptionComponent
            data={{
              step: 4,
              ...description,
            }}
          />
        )}

        <Slider
          defaultValue={1}
          min={TOP_SLIDER_STEPS[0]}
          max={TOP_SLIDER_STEPS[TOP_SLIDER_STEPS.length - 1]}
          step={0.2}
          mt={10}
          mx={12}
          onChange={(target) => {
            setSliderTopValue(target)
          }}
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
                bg={
                  sliderTopValue > item
                    ? COLORS.primaryColor
                    : COLORS.tipTextColor
                }
              />
            </SliderMark>
          ))}

          <SliderMark
            value={TOP_SLIDER_STEPS[0]}
            mt='1'
            ml='-2.5'
            fontSize='sm'
          >
            min
          </SliderMark>
          <SliderMark
            value={TOP_SLIDER_STEPS[TOP_SLIDER_STEPS.length - 1]}
            mt='1'
            ml='-2.5'
            fontSize='sm'
          >
            max
          </SliderMark>
          <SliderMark
            value={sliderTopValue}
            textAlign='center'
            // color='white'
            mt='-10'
            ml='-5'
            w='12'
            zIndex={5}
          >
            {sliderTopValue}%
          </SliderMark>

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

        <Flex justify={'flex-end'} w='100%' alignItems={'center'} gap={8}>
          <Box
            bg='white'
            borderRadius={2}
            padding={2}
            mt={6}
            w='660px'
            id='base-rate-table'
            pos={'relative'}
          >
            <Flex>
              {[
                'Collateral Factor/ Tenor',
                ...currentTenors.map((i) => `${i} Day`),
              ].map((item) => (
                <Flex
                  key={item}
                  w='20%'
                  alignItems={'center'}
                  justify='center'
                  h='40px'
                  borderBottom={`1px solid ${COLORS.borderColor}`}
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
                      ? `1px solid ${COLORS.borderColor}`
                      : 'none'
                  }
                >
                  {[currentCollaterals[index], ...row]?.map(
                    (value: string, i: number) => (
                      <Flex
                        /* eslint-disable */
                        key={`${value}-${i}`}
                        /* eslint-disable */
                        w='20%'
                        alignItems={'center'}
                        justify='center'
                        h='40px'
                      >
                        <Text
                          textAlign={'center'}
                          fontSize='xs'
                          fontWeight={i === 0 ? 'bold' : 'normal'}
                          color={
                            i === 0
                              ? COLORS.textColor
                              : COLORS.secondaryTextColor
                          }
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
            }}
          >
            <SliderTrack bg={COLORS.tipTextColor}>
              <SliderFilledTrack bg={COLORS.primaryColor} />
            </SliderTrack>
            <SliderThumb
              boxSize={4}
              borderWidth={'2px'}
              borderColor={COLORS.primaryColor}
              _focus={{
                boxShadow: 'none',
              }}
            />
          </Slider>
        </Flex>
      </Flex>
      <Flex justify={'center'} mt={5}>
        <Flex alignItems={'center'}>
          <Button variant='ghost'>-</Button>
          <Slider
            min={BOTTOM_SLIDER_STEPS[0]}
            max={BOTTOM_SLIDER_STEPS[BOTTOM_SLIDER_STEPS.length - 1]}
            w='132px'
            step={0.2}
            defaultValue={1}
            mt={1}
            onChange={(target) => {
              setSliderBottomValue(target)
            }}
          >
            <SliderTrack bg={COLORS.tipTextColor}>
              <SliderFilledTrack bg={COLORS.primaryColor} />
            </SliderTrack>
            <SliderThumb
              boxSize={4}
              borderWidth={'2px'}
              borderColor={COLORS.primaryColor}
              _focus={{
                boxShadow: 'none',
              }}
            />
          </Slider>
          <Button variant='ghost'>+</Button>
        </Flex>
      </Flex>
    </Card>
  )
}

export default LpBaseRateTable
