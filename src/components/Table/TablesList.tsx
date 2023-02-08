import { Box } from '@chakra-ui/react'

import Table, { type MyTableProps } from '@/components/table/Table'

import type { FunctionComponent } from 'react'

const OpenLoansTables: FunctionComponent<{
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

export default OpenLoansTables
