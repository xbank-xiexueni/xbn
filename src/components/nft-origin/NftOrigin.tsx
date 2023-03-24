import { Flex, Image, Text } from '@chakra-ui/react'
import { useMemo, type FunctionComponent } from 'react'

import { SvgComponent } from '@/components'

import IconX2y2 from '@/assets/icon-x2y2.svg'

/**
 * 1: looksrare
 * 2. opensea
 * 3. x2y2
 */
const NftOrigin: FunctionComponent<{ type: 1 | 2 | 3 }> = ({ type }) => {
  const { img, name } = useMemo(() => {
    switch (type) {
      case 1:
        return {
          img: <SvgComponent svgId='icon-loosrare' />,
          name: 'LooksRare',
        }

      case 2:
        return {
          img: <SvgComponent svgId='icon-opensea' />,

          name: 'OpenSea',
        }
      case 3:
        return {
          img: <Image src={IconX2y2} alt='x2y2' />,
          name: 'X2Y2',
        }

      default:
        return {
          img: <SvgComponent svgId='icon-loosrare' />,
          name: 'LooksRare',
        }
    }
  }, [type])
  return (
    <Flex gap={'4px'}>
      {img}
      <Text fontSize={'14px'} fontWeight={500} color='gray.3'>
        {name}
      </Text>
    </Flex>
  )
}

export default NftOrigin
