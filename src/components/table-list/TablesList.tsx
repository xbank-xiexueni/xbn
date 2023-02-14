import { Box } from '@chakra-ui/react'

import MyTable, { type MyTableProps } from '../my-table'

import type { FunctionComponent } from 'react'

const TableList: FunctionComponent<{
  tables: MyTableProps[]
}> = ({ tables }) => {
  return (
    <Box>
      {tables?.map((item) => (
        <MyTable {...item} key={item.key} />
      ))}
    </Box>
  )
}

export default TableList
