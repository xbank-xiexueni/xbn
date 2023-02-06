import { Flex, ListItem, Box, Text, Image } from '@chakra-ui/react'

import COLORS from '@/utils/Colors'

import IconChecked from '@/assets/icon/icon-checked.svg'
import IconVerifiedFill from '@/assets/icon/icon-verified-fill.svg'

import type { FunctionComponent } from 'react'

const CollectionListItem: FunctionComponent<{
  data: any
  onClick?: () => void
  isActive?: boolean
}> = ({ data: { id, name }, onClick, isActive }) => {
  return (
    <ListItem
      key={id}
      px={4}
      py={3}
      display='flex'
      alignItems={'center'}
      justifyContent='space-between'
      border={`1px solid ${COLORS.borderColor}`}
      borderRadius={8}
      _hover={{
        bg: COLORS.secondaryColor,
      }}
      cursor='pointer'
      bg={isActive ? COLORS.secondaryColor : 'white'}
      onClick={onClick}
    >
      <Flex alignItems={'center'}>
        <Box w={6} h={6} bg='gray.600' mr={4} />
        <Text fontSize={'sm'}>
          {name}
          &nbsp;
        </Text>
        <Image src={IconVerifiedFill} />
      </Flex>
      {isActive ? (
        <Image src={IconChecked} />
      ) : (
        <Text fontSize={'sm'}>{id}</Text>
      )}
    </ListItem>
  )
}

export default CollectionListItem
