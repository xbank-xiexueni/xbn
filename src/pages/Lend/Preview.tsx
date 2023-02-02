import {
  Container,
  Flex,
  Image,
  Button,
  Box,
  Heading,
  Text,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

import { AreaChartComponent } from '@/components'
import COLORS from '@/utils/Colors'
import { SUB_RESPONSIVE_MAX_W } from '@/utils/constants'

import IconArrowLeft from '@/assets/icon/icon-arrow-left.svg'
import IconTrend from '@/assets/icon/icon-trend.svg'

const Preview = () => {
  const navigate = useNavigate()
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
            navigate(-1)
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
          <Heading size={'lg'}>Create new pool</Heading>

          <Flex justify={'space-between'}>
            <Box
              w={{
                lg: '40%',
                md: '100%',
              }}
            >
              <Box mb={6}>
                <Text fontSize={'xs'} color={COLORS.secondaryTextColor} mb={2}>
                  Select Tenor
                </Text>
                <Select placeholder='Select option' h='56px'>
                  <option value='aa'>ass</option>
                </Select>
              </Box>
              <Box mb={6}>
                <Text fontSize={'xs'} color={COLORS.secondaryTextColor} mb={2}>
                  Select Collateral Factor
                </Text>
                <Select h='56px'>
                  <option>ass</option>
                </Select>
              </Box>
              <Box>
                <Text fontSize={'xs'} color={COLORS.secondaryTextColor} mb={2}>
                  Select Collateral Factor
                </Text>
                <Flex
                  h='56px'
                  px={4}
                  py={5}
                  borderRadius={8}
                  border={`1px solid ${COLORS.borderColor}`}
                  alignItems='center'
                  gap={3}
                >
                  <Image src={IconTrend} />
                  <Text fontSize={'xs'} color={COLORS.secondaryTextColor}>
                    min
                  </Text>
                  <Slider min={10} max={90} step={10} size={'sm'}>
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
                  <Text fontSize={'xs'} color={COLORS.secondaryTextColor}>
                    max
                  </Text>
                </Flex>
              </Box>
            </Box>

            <Box>
              <AreaChartComponent />
            </Box>
          </Flex>

          <Button
            variant={'primary'}
            w={{
              lg: '40%',
              md: '100%',
            }}
            mb={8}
            mt={10}
          >
            Deposit ETH
          </Button>

          <Text color={COLORS.tipTextColor}>
            According to the limit value of the loan conditions set in steps 1
            and 2, the system refers to the historical order data to generate a
            suggested loan interest rate for you, and the funds approved by you
            under this interest rate are expected to generate income soon. If
            the current loan conditions and suggested interest rates do not meet
            your expectations, you can adjust the loan interest rate through the
            big slider below, and all interest rate values in the table will
            increase or decrease You can also use the small sliders on the right
            and bottom of the table to adjust the impact of changes in the two
            factors of collateral fat and loan duration on the interest rate.
          </Text>
        </Box>
      </Flex>
    </Container>
  )
}

export default Preview
