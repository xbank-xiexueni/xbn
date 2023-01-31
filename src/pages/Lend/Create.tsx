import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Image,
  Select,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Tag,
  Text,
  type BoxProps,
  type CardProps,
} from '@chakra-ui/react'
import slice from 'lodash/slice'
import { useMemo, useState, type FunctionComponent } from 'react'
import { useNavigate } from 'react-router-dom'

import COLORS from '@/utils/Colors'
import { SUB_RESPONSIVE_MAX_W } from '@/utils/constants'

import IconArrowLeft from '@/assets/icon/icon-arrow-left.svg'

const CardWithBg: FunctionComponent<CardProps> = (props) => {
  return (
    <Card bg={COLORS.secondaryBgc} borderRadius={'16px'} p={8} {...props} />
  )
}

const DescriptionComponent: FunctionComponent<
  {
    data: {
      step: number
      title: string
      text: string
    }
  } & BoxProps
> = ({ data: { step, title, text }, ...rest }) => {
  return (
    <Box {...rest}>
      <Flex mb={5} alignItems='center'>
        <Tag
          bg={COLORS.primaryColor}
          color='white'
          borderRadius={'50%'}
          mr={4}
          w={8}
          h={8}
          justifyContent='center'
        >
          {step}
        </Tag>
        <Heading size={'md'}>{title}</Heading>
      </Flex>
      <Text color={COLORS.secondaryTextColor}>{text}</Text>
    </Box>
  )
}

const TENORS = [7, 14, 30, 60, 90]
const COLLATERALS = [10, 20, 30, 40, 50, 60, 70, 80, 90]

const STEPS_DESCRIPTIONS = [
  {
    title: 'Select Tenor',
    text: 'Determine the Tenor length for which potential borrowers can open a loan against. We commonly see a 60-days Tenor.',
  },
  {
    title: 'Select COLLATERALS Factor',
    text: 'Indicate the Colleteral Factor % which will help determine how much liquidity (Ethereum) borrowers can receive against the desired NFT collection. The higher the %, the more liquidity they can pull out of the pool. We typically recommend a 50% COLLATERALS Factor.',
  },
  {
    title: 'Set the interest rate for each loan condition',
    text: `According to the limit value of the loan conditions set in steps 1 and 2, the system refers to the historical order data to generate a suggested loan interest rate for you, and the funds approved by you under this interest rate are expected to generate income soon.
If the current loan conditions and suggested interest rates do not meet your expectations, you can adjust the loan interest rate through the big slider below, and all interest rate values in the table will increase or decrease
You can also use the small sliders on the right and bottom of the table to adjust the impact of changes in the two factors of COLLATERALS fat and loan duration on the interest rate.`,
  },
]

const INITIAL_TENOR = TENORS[3]
const INITIAL_COLLATERAL = COLLATERALS[4]

const Create = () => {
  const navigate = useNavigate()
  const [sliderValue, setSliderValue] = useState(INITIAL_COLLATERAL)
  const [selectCollateral, setSelectCollateral] = useState(INITIAL_COLLATERAL)
  const [selectTenor, setSelectTenor] = useState(INITIAL_TENOR)

  const colCount = useMemo(() => TENORS.indexOf(selectTenor), [selectTenor])
  const rowCount = useMemo(
    () => COLLATERALS.indexOf(selectCollateral),
    [selectCollateral],
  )
  const currentTenors = useMemo(() => {
    return slice(TENORS, 0, colCount + 1)
  }, [colCount])
  const currentCollaterals = useMemo(
    () => slice(COLLATERALS, 0, rowCount + 1),
    [rowCount],
  )

  const tableData = useMemo(() => {
    const arr = new Array(rowCount + 1) //表格有10行
    for (let i = 0; i < rowCount + 1; i++) {
      // arr[i] = new Array(colCount).fill(0) //每行有10列
      arr[i] = [`${currentCollaterals[i]} %`, ...currentTenors].map(
        (item, index) =>
          index === 0 ? item : `${item}-${currentCollaterals[i]}`,
      )
    }
    return arr
  }, [rowCount, currentCollaterals, currentTenors])

  return (
    <Container maxW={SUB_RESPONSIVE_MAX_W}>
      <Flex
        justify={{
          lg: 'space-between',
          md: 'flex-start',
        }}
        wrap='wrap'
      >
        <Button
          leftIcon={<Image src={IconArrowLeft} />}
          onClick={() => {
            navigate('/lend/my-pools')
          }}
        >
          Back
        </Button>

        <Box
          maxW={{
            lg: 800,
            md: '100%',
          }}
        >
          <Box mb={8}>
            <Heading size={'lg'} mb={2}>
              Create New Pool
            </Heading>
            <Text color={COLORS.secondaryTextColor}>
              Determine the Tenor length for which potential borrowers can open
              a loan against. We commonly see a 14-days Tenor.
            </Text>
          </Box>

          <CardWithBg mb={8}>
            <Flex justify={'space-between'}>
              <DescriptionComponent
                w={{
                  lg: '50%',
                  md: '100%',
                }}
                data={{
                  step: 1,
                  ...STEPS_DESCRIPTIONS[0],
                }}
              />
              <Select
                placeholder='Select option'
                w={'240px'}
                defaultValue={INITIAL_TENOR}
                onChange={(e) => setSelectTenor(Number(e.target.value))}
              >
                {TENORS.map((item) => (
                  <option value={item} key={item}>
                    {item} day
                  </option>
                ))}
              </Select>
            </Flex>
          </CardWithBg>
          <CardWithBg mb={8}>
            <Flex justify={'space-between'}>
              <DescriptionComponent
                w={{
                  lg: '50%',
                  md: '100%',
                }}
                data={{
                  step: 2,
                  ...STEPS_DESCRIPTIONS[1],
                }}
              />
              <Select
                placeholder='Select option'
                w={'240px'}
                defaultValue={INITIAL_COLLATERAL}
                onChange={(e) => setSelectCollateral(Number(e.target.value))}
              >
                {COLLATERALS.map((item) => (
                  <option key={item} value={item}>
                    {item} %
                  </option>
                ))}
              </Select>
            </Flex>
          </CardWithBg>
          <CardWithBg mb={8}>
            <Flex wrap={'wrap'}>
              <DescriptionComponent
                data={{
                  step: 3,
                  ...STEPS_DESCRIPTIONS[2],
                }}
              />
              <Slider
                defaultValue={INITIAL_COLLATERAL}
                min={COLLATERALS[0]}
                max={COLLATERALS[COLLATERALS.length - 1]}
                step={10}
                mt={10}
                mx={12}
                onChange={(target) => {
                  setSliderValue(target)
                }}
              >
                <SliderMark
                  value={COLLATERALS[0]}
                  mt='1'
                  ml='-2.5'
                  fontSize='sm'
                >
                  min
                </SliderMark>
                <SliderMark
                  value={COLLATERALS[COLLATERALS.length - 1]}
                  mt='1'
                  ml='-2.5'
                  fontSize='sm'
                >
                  max
                </SliderMark>
                <SliderMark
                  value={sliderValue}
                  textAlign='center'
                  // color='white'
                  mt='-10'
                  ml='-5'
                  w='12'
                >
                  {sliderValue}%
                </SliderMark>

                <SliderTrack bg={COLORS.tipTextColor}>
                  <SliderFilledTrack bg={COLORS.primaryColor} />
                </SliderTrack>
                <SliderThumb
                  boxSize={6}
                  borderWidth={5}
                  borderColor={COLORS.primaryColor}
                  _focus={{
                    boxShadow: 'none',
                  }}
                />
              </Slider>

              <Flex justify={'flex-end'} w='100%' alignItems={'center'} gap={8}>
                <Box bg='white' borderRadius={2} padding={2} mt={6}>
                  <Flex>
                    {[
                      'Collateral Factor/ Tenor',
                      ...currentTenors.map((i) => `${i} Day`),
                    ].map((item) => (
                      <Flex
                        key={item}
                        w='128px'
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
                        key={row[index]}
                        borderBottom={
                          index !== tableData?.length - 1
                            ? `1px solid ${COLORS.borderColor}`
                            : 'none'
                        }
                      >
                        {row.map((value: string, i: number) => (
                          <Flex
                            key={value}
                            w='128px'
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
                              {value}
                            </Text>
                          </Flex>
                        ))}
                      </Flex>
                    )
                  })}
                </Box>

                <Slider
                  orientation='vertical'
                  direction='ltr'
                  min={10}
                  max={20}
                  h='132px'
                  step={2}
                  // onChange={(target) => {
                  //   // setSliderValue(target)
                  // }}
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
                  min={10}
                  max={20}
                  w='132px'
                  step={2}
                  mt={1}
                  // onChange={(target) => {
                  //   // setSliderValue(target)
                  // }}
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
          </CardWithBg>
          <Flex justify={'center'} mb={10}>
            <Button
              variant={'primary'}
              onClick={() => navigate('/lend/my-pools/create/preview')}
            >
              Deposit ETH
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Container>
  )
}

export default Create
