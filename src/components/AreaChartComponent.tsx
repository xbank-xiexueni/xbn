import { Box, Flex, Text, Heading } from '@chakra-ui/react'
import { Area, Tooltip, ComposedChart } from 'recharts'

import COLORS from '@/utils/Colors'

const data = [
  {
    name: '7 days',
    uv: 0,
    pv: 10,
    amt: 2400,
  },
  {
    name: '14 days',
    uv: 2000,
    pv: 20,
    amt: 2210,
  },
  {
    name: '30 days',
    uv: 5000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: '60 days',
    uv: 8080,
    pv: 3908,
    amt: 2000,
  },
]

export default function AreaChartComponent() {
  return (
    <Box position={'relative'}>
      <Box position={'absolute'} left={4}>
        <Text fontSize={'md'}>In 30 days & 50% Factor, you will have </Text>
        <Heading size={'lg'} color={COLORS.primaryColor}>
          22% APR
        </Heading>
      </Box>

      <Flex>
        <ComposedChart
          width={400}
          height={240}
          data={data}
          style={{
            borderColor: COLORS.borderColor,
            borderLeftWidth: 1,
            borderBottomWidth: 1,
          }}
        >
          <defs>
            <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#0000FF' stopOpacity={0.3} />
              <stop
                offset='98.96%'
                stopColor='rgba(0, 0, 255, 0)'
                stopOpacity={0.3}
              />
            </linearGradient>
          </defs>
          <Tooltip />

          <Area
            type='monotone'
            dataKey='uv'
            stroke={COLORS.primaryColor}
            fill={'url(#colorUv)'}
          />
        </ComposedChart>
        <Flex direction={'column'} justify='space-between' mt={10}>
          {[50, 40, 30, 20, 10].map((item) => (
            <Text color={COLORS.secondaryTextColor} fontSize='xs' key={item}>
              {item} %
            </Text>
          ))}
        </Flex>
      </Flex>

      <Flex justify={'space-between'} mt={5}>
        {data.map(({ name }) => (
          <Box
            key={name}
            borderRadius={32}
            bg={COLORS.secondaryBgc}
            py={1}
            px={3}
            fontSize='md'
            color={COLORS.secondaryTextColor}
          >
            {name}
          </Box>
        ))}
      </Flex>
    </Box>
  )
}
