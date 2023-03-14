import { Flex, Text } from '@chakra-ui/react'

import { ImageWithFallback, SvgComponent } from '@/components'

import type { FunctionComponent } from 'react'

const CollectionListItem: FunctionComponent<{
  data: Record<string, any>
  onClick?: () => void
  isActive?: boolean
  count?: number
  iconSize?: number | string
}> = ({
  data: {
    contractAddress,
    name,
    imagePreviewUrl,
    safelistRequestStatus,
    id,
    image_url,
  },
  onClick,
  isActive,
  count,
  iconSize = 6,
}) => {
  return (
    <Flex
      key={`${contractAddress}-${id}`}
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
      <Flex alignItems={'center'} gap={4} w='80%'>
        <ImageWithFallback
          src={imagePreviewUrl || image_url}
          w={iconSize}
          h={iconSize}
          borderRadius={8}
        />
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
        {safelistRequestStatus === 'verified' && (
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
