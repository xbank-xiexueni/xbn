import { Box } from '@chakra-ui/react'

import type { MyTableProps } from '@/components/table/Table'
import Table from '@/components/table/Table'

import type { FunctionComponent } from 'react'

const OpenLoansTables: FunctionComponent<{
  tables: MyTableProps[]
}> = ({ tables }) => {
  return (
    <Box>
      {tables?.map((item) => (
        <Table {...item} key={JSON.stringify(item)} />
      ))}
    </Box>
  )
}

export default OpenLoansTables
