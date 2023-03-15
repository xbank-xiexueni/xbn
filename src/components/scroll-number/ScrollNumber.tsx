import { Box, Flex } from '@chakra-ui/react'
import range from 'lodash-es/range'
import { type FunctionComponent, useEffect, useRef, useState } from 'react'

const ScrollNumberItem: FunctionComponent<{
  value: string
  callback: (ended: boolean) => void
  ended: boolean
}> = ({ value, callback, ended }) => {
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
        color={ended ? 'gray.3' : 'blue.4'}
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
          <Box
            key={item}
            color={ended ? 'gray.3' : 'blue.4'}
            w='14px'
            h='16px'
            lineHeight={'16px'}
            fontSize='12px'
            fontWeight={'500'}
          >
            {item}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
type ScrollNumberProps = {
  value: string
}

const ScrollNumber: FunctionComponent<ScrollNumberProps> = ({ value }) => {
  const [ended, setEnded] = useState(true)

  return (
    <Flex justify={'space-between'}>
      {value
        .toString()
        .split('')
        .map((item, i) => (
          <ScrollNumberItem
            value={item}
            /* eslint-disable */
            key={i}
            /* eslint-disable */
            callback={(e) => setEnded(e)}
            ended={ended}
          />
        ))}
    </Flex>
  )
}

export default ScrollNumber
