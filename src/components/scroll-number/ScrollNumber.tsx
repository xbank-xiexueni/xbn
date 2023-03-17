import { Box, Flex } from '@chakra-ui/react'
import range from 'lodash-es/range'
import { type FunctionComponent, useEffect, useRef, useState } from 'react'

import type { FlexProps } from '@chakra-ui/react'

const ScrollNumberItem: FunctionComponent<{
  value: string
  callback: (ended: boolean) => void
}> = ({ value, callback }) => {
  const ref = useRef<HTMLDivElement>(null)
  const transitionNode = ref?.current
  useEffect(() => {
    transitionNode?.addEventListener('transitionstart', () => {
      callback(false)
    })
    transitionNode?.addEventListener('transitionend', () => {
      callback(true)
    })
    return () => {
      transitionNode?.removeEventListener('transitionstart', () => {})
      transitionNode?.removeEventListener('transitionend', () => {})
    }
  }, [callback, transitionNode])

  if (value === '.' || value === '%')
    return (
      <Box
        w='4px'
        h='2px'
        top={'-2px'}
        left={'-5px'}
        fontSize='12px'
        position='relative'
      >
        {value}
      </Box>
    )

  return (
    <Box
      w={'14px'}
      h={'14px'}
      ml='-5px'
      position='relative'
      display='inline-block'
      overflow='hidden'
    >
      <Box
        position='absolute'
        left={0}
        top={0}
        height='auto'
        width='100%'
        transformOrigin='0 0'
        transition='top 0.6s'
        style={{ top: `${-1 * Number(value) * 16}px` }}
        ref={ref}
      >
        {range(0, 10).map((item) => (
          <Box key={item} w='14px' h='16px' lineHeight={'16px'} fontSize='12px'>
            {item}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
type ScrollNumberProps = {
  value: string
} & FlexProps

const ScrollNumber: FunctionComponent<ScrollNumberProps> = ({
  value,
  color = 'gray.3',
  ...rest
}) => {
  const [ended, setEnded] = useState(true)
  return (
    <Flex justify={'space-between'}>
      {value
        .toString()
        .split('')
        .map((item, i) => (
          <Flex
            color={ended ? color : 'blue.4'}
            {...rest}
            /* eslint-disable */
            key={i}
            /* eslint-disable */
          >
            <ScrollNumberItem value={item} callback={(e) => setEnded(e)} />
          </Flex>
        ))}
    </Flex>
  )
}

export default ScrollNumber
