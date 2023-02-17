import { Flex, ListItem, Text, Image } from '@chakra-ui/react'

import { SvgComponent } from '@/components'

import type { FunctionComponent } from 'react'

const CollectionListItem: FunctionComponent<{
  data: any
  onClick?: () => void
  isActive?: boolean
  count?: number
}> = ({ data: { id, name, img }, onClick, isActive, count }) => {
  return (
    <ListItem
      key={id}
      px={4}
      py={3}
      display='flex'
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
      <Flex alignItems={'center'} gap={2}>
        <Image src={img} w={6} h={6} />
        <Text fontSize={'sm'}>
          {name}
          &nbsp;
        </Text>
        <SvgComponent svgId='icon-verified-fill' />
      </Flex>
      {isActive ? (
        <SvgComponent svgId='icon-checked' />
      ) : (
        count && <Text fontSize={'sm'}>{count}</Text>
      )}
    </ListItem>
  )
}

export default CollectionListItem
