import { Card } from '@chakra-ui/react'

import type { CardProps } from '@chakra-ui/react'
import type { FunctionComponent } from 'react'

const CardWithBg: FunctionComponent<CardProps> = (props) => {
  return <Card bg='gray.5' borderRadius={'16px'} p={8} {...props} />
}

export default CardWithBg
