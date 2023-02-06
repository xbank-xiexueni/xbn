import { Card } from '@chakra-ui/react'

import COLORS from '@/utils/Colors'

import type { CardProps } from '@chakra-ui/react'
import type { FunctionComponent } from 'react'

const CardWithBg: FunctionComponent<CardProps> = (props) => {
  return (
    <Card bg={COLORS.secondaryBgc} borderRadius={'16px'} p={8} {...props} />
  )
}

export default CardWithBg
