import { Flex, Box } from '@chakra-ui/react'
import range from 'lodash/range'
import { type FunctionComponent, useMemo } from 'react'

import COLORS from '@/utils/Colors'

type PaginationProps = {
  showSizeChanger?: boolean
  onShowSizeChange?: () => void
  defaultCurrent?: number
  total: number
  onChange?: (page: number, pageSize?: number) => void
  current?: number
  disabled?: boolean
  pageSize?: number
}
const Pagination: FunctionComponent<PaginationProps> = ({
  // showSizeChanger = false,
  // onShowSizeChange,
  // defaultCurrent = 1,
  current = 1,
  total,
  // disabled = false,
  pageSize = 10,
}) => {
  const itemCount = useMemo(
    () => Math.ceil(total / pageSize),
    [total, pageSize],
  )

  return (
    <Flex alignItems={'center'} gap={4}>
      <Box>&lt;</Box>
      {range(1, itemCount + 1).map((page) => (
        <Flex
          key={page}
          w='36px'
          h='36px'
          borderRadius={36}
          bg={current === page ? COLORS.secondaryColor : 'white'}
          color={current === page ? COLORS.primaryColor : COLORS.textColor}
          alignItems='center'
          justify={'center'}
          _hover={{
            bg: COLORS.secondaryBgc,
          }}
          cursor='pointer'
        >
          {page}
        </Flex>
      ))}
      <Box>&gt;</Box>
    </Flex>
  )
}

/**
 * 
 *     <Pagination
      showSizeChanger
      onShowSizeChange={onShowSizeChange}
      defaultCurrent={3}
      total={500}
    />
 */

export default Pagination
