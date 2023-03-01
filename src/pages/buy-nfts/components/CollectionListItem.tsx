import { Flex, Text } from '@chakra-ui/react'

import type { CollectionListItemType } from '@/api'
import { ImageWithFallback, SvgComponent } from '@/components'

import type { FunctionComponent } from 'react'

const CollectionListItem: FunctionComponent<{
  data: CollectionListItemType
  onClick?: () => void
  isActive?: boolean
  count?: number
}> = ({
  data: { contract_addr, name, image_url, safelist_request_status },
  onClick,
  isActive,
  count,
}) => {
  return (
    <Flex
      key={contract_addr}
      px={4}
      py={3}
      alignItems={'center'}
      justifyContent='space-between'
      border={`1px solid var(--chakra-colors-gray-2)`}
      borderRadius={8}
      _hover={{
        bg: 'blue.2',
      }}
      cursor='pointer'
      bg={isActive ? 'blue.2' : 'white'}
      onClick={onClick}
    >
      <Flex alignItems={'center'} gap={1} w='80%'>
        <ImageWithFallback src={image_url} w={6} h={6} borderRadius={8} />
        <Text
          fontSize={'sm'}
          display='inline-block'
          overflow='hidden'
          whiteSpace='nowrap'
          textOverflow='ellipsis'
        >
          {name}
          &nbsp;
        </Text>
        {safelist_request_status === 'verified' && (
          <SvgComponent svgId='icon-verified-fill' />
        )}
      </Flex>
      {isActive ? (
        <SvgComponent svgId='icon-checked' />
      ) : (
        !!count && <Text fontSize={'sm'}>{count}</Text>
      )}
    </Flex>
  )
}

export default CollectionListItem
