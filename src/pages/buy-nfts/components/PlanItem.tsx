import { Flex, Image, Text } from '@chakra-ui/react'

import { UNIT } from '@/utils/constants'

import IconCalendar from '@/assets/icon/icon-calendar.svg'

import type { FunctionComponent } from 'react'

const PlanItem: FunctionComponent<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  return (
    <Flex justify={'space-between'} w='100%'>
      <Flex>
        <Image src={IconCalendar} />
        &nbsp;&nbsp;
        <Text fontSize={'sm'}>{label}</Text>
      </Flex>
      <Text fontSize={'sm'}>
        {value} {UNIT}
      </Text>
    </Flex>
  )
}

export default PlanItem
