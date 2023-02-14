import { Box } from '@chakra-ui/react'

import Table, { type MyTableProps } from './table'

import type { FunctionComponent } from 'react'

const TableList: FunctionComponent<{
  tables: MyTableProps[]
}> = ({ tables }) => {
  return (
    <Box>
      {tables?.map((item) => (
        <Table {...item} key={item.key} />
      ))}
    </Box>
  )
}

export default TableList
