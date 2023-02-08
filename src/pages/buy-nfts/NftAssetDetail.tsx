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
  useRadioGroup,
  HStack,
  Highlight,
  VStack,
  Divider,
} from '@chakra-ui/react'
import range from 'lodash/range'
import { useState } from 'react'

import TestImage from '@/assets/IMAGE.png'
import COLORS from '@/utils/Colors'
import { COLLATERALS } from '@/utils/constants'

import IconEth from '@/assets/icon/icon-eth.svg'
import test from '@/assets/test-img.svg'

import BelongToCollection from './components/BelongToCollection'
import DetailComponent from './components/DetailComponent'
import LabelComponent from './components/LabelComponent'
import PlanItem from './components/PlanItem'
import RadioCard from './components/RadioCard'

const NftAssetDetail = () => {
  // const { id } = useParams()
  const [sliderValue, setSliderValue] = useState(COLLATERALS[4])
  const [
    periodOptions,
    // setPeriodOptions
  ] = useState(['react', 'vue', 'svelte'])

  const {
    getRootProps: getPeriodRootProps,
    getRadioProps: getPeriodRadioProps,
  } = useRadioGroup({
    name: 'periodOptions',
    defaultValue: 'react',
    onChange: console.log,
  })
  const periodGroup = getPeriodRootProps()

  const [
    installmentOptions,
    // setInstallmentOptions
  ] = useState(['react', 'vue', 'svelte'])

  const {
    getRootProps: getInstallmentRootProps,
    getRadioProps: getInstallmentRadioProps,
  } = useRadioGroup({
    name: 'installmentOptions',
    defaultValue: 'react',
    onChange: console.log,
  })
  const installmentGroup = getInstallmentRootProps()

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
            price: '111',
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
              alignItems='center'
              justify={'center'}
              w='80px'
            >
              <Image src={IconEth} h='20px' />
              <Text fontSize={'lg'}>20</Text>
            </Flex>
            <Divider orientation='vertical' h={6} />
            <Slider
              min={COLLATERALS[0]}
              max={COLLATERALS[COLLATERALS.length - 1]}
              step={0.2}
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
            <Image src={IconEth} h='14px' />
            <Text fontSize={'xs'} fontWeight='500'>
              70
            </Text>
          </Flex>
        </LabelComponent>

        {/* Loan Period */}
        <LabelComponent label='Loan Period'>
          <HStack {...periodGroup} gap={4}>
            {periodOptions.map((value, index) => {
              const radio = getPeriodRadioProps({ value })
              return (
                <Flex
                  key={value}
                  w={`${100 / periodOptions.length}%`}
                  maxW={136}
                >
                  <RadioCard {...radio}>
                    <Text fontWeight={700} mb='58px'>
                      {index} Days
                    </Text>
                    <Text
                      fontWeight={500}
                      fontSize='xs'
                      color={COLORS.primaryColor}
                    >
                      <Highlight
                        query={'APR'}
                        styles={{ color: COLORS.textColor }}
                      >
                        29% APR
                      </Highlight>
                    </Text>
                  </RadioCard>
                </Flex>
              )
            })}
          </HStack>
        </LabelComponent>

        {/* Number of installments */}
        <LabelComponent label='Number of installments'>
          <HStack {...installmentGroup} gap={4}>
            {installmentOptions.map((value, index) => {
              const radio = getInstallmentRadioProps({ value })
              return (
                <Flex
                  key={value}
                  w={`${100 / installmentOptions.length}%`}
                  maxW={188}
                >
                  <RadioCard {...radio}>
                    <Text fontWeight={700} mb='58px'>
                      Pay in {index} installments
                    </Text>
                    <Text fontWeight={500} fontSize='xs'>
                      70 ETG/per
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
            {range(3).map((value) => (
              <PlanItem value={`${value}`} label='xxxxxx' key={value} />
            ))}
          </VStack>
        </LabelComponent>

        {/* Trading Information */}
        <LabelComponent label='Trading Information' borderBottom={'none'}>
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
              <Text color={COLORS.secondaryTextColor}>xxx ETH</Text>
            </Flex>
            {/* Down payment */}
            <Flex justify={'space-between'}>
              <Text color={COLORS.secondaryTextColor}>Down payment</Text>
              <Text color={COLORS.secondaryTextColor}>xxx ETH</Text>
            </Flex>
            {/* Loan amount */}
            <Flex justify={'space-between'}>
              <Text color={COLORS.secondaryTextColor}>Loan amount</Text>
              <Text color={COLORS.secondaryTextColor}>xxx ETH</Text>
            </Flex>
            {/* Interest fee */}
            <Flex justify={'space-between'}>
              <Text color={COLORS.secondaryTextColor}>Interest fee</Text>
              <Text color={COLORS.secondaryTextColor}>xxx ETH</Text>
            </Flex>
            <Divider color={COLORS.borderColor} />
            {/* Total repayment */}
            <Flex justify={'space-between'}>
              <Text fontSize={'md'} fontWeight='bold'>
                Total repayment
              </Text>
              <Text fontSize={'md'} fontWeight='bold'>
                xxx ETH
              </Text>
            </Flex>
            {/* Floor breakeven */}
            <Flex justify={'space-between'}>
              <Text fontSize={'md'} fontWeight='bold'>
                Floor breakeven
              </Text>
              <Text fontSize={'md'} fontWeight='bold'>
                xxx ETH
              </Text>
            </Flex>
          </Flex>
        </LabelComponent>

        {/* 按钮 */}
        <Button variant={'primary'} display='flex' h='60px' w='100%'>
          <Text fontWeight={'400'}>Down payment</Text>&nbsp;20 ETH
        </Button>
      </Box>
    </SimpleGrid>
  )
}

export default NftAssetDetail
