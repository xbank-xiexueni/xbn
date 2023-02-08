import { Flex, Image, Text } from '@chakra-ui/react'
import { useMemo, type FunctionComponent } from 'react'

import COLORS from '@/utils/Colors'

import IconLooksRare from '@/assets/icon/icon-loosrare.svg'
import IconOpenSea from '@/assets/icon/icon-opensea.svg'
import IconX2y2 from '@/assets/icon/icon-x2y2.svg'

/**
 * 1: looksrare
 * 2. opensea
 * 3. x2y2
 */
const NftOrigin: FunctionComponent<{ type: 1 | 2 | 3 }> = ({ type }) => {
  const { src, name } = useMemo(() => {
    switch (type) {
      case 1:
        return {
          src: IconLooksRare,
          name: 'LooksRare',
        }

      case 2:
        return {
          src: IconOpenSea,
          name: 'OpenSea',
        }
      case 3:
        return {
          src: IconX2y2,
          name: 'X2Y2',
        }

      default:
        return {
          src: IconLooksRare,
          name: 'LooksRare',
        }
    }
  }, [type])
  return (
    <Flex gap={1}>
      <Image src={src} />
      <Text
        fontSize={'14px'}
        fontWeight={500}
        color={COLORS.secondaryTextColor}
      >
        {name}
      </Text>
    </Flex>
  )
}

export default NftOrigin
