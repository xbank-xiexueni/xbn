import { Flex, Text } from '@chakra-ui/react'

import { SvgComponent } from '@/components'
import { UNIT } from '@/utils/constants'

import type { FunctionComponent } from 'react'

const PlanItem: FunctionComponent<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  return (
    <Flex justify={'space-between'} w='100%'>
      <Flex>
        <SvgComponent svgId='icon-calendar' />
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
