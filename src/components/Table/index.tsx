import {
  Image,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  type TableProps,
  Flex,
  Spinner,
  Heading,
} from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import { useState, type FunctionComponent, type ReactElement } from 'react'

import COLORS from '@/utils/Colors'

import IconSortDESC from '@/assets/icon/icon-sort-down.svg'
import IconSortASC from '@/assets/icon/icon-sort-up.svg'
import IconUnSort from '@/assets/icon/icon-unsort.svg'

import EmptyTableComponent from './EmptyTableComponent'
import './index.css'

export interface ColumnProps {
  title: string
  dataIndex: string
  key: string
  // col
  align?: 'left' | 'right' | 'center'
  // thead
  thAlign?: 'left' | 'right' | 'center'
  width?: number
  render?: (
    arg0: Record<string, string | boolean | number>,
    arg1: string | boolean | number,
  ) => ReactElement
  sortable?: boolean
}
export type MyTableProps = TableProps & {
  columns: ColumnProps[]
  data: Record<string, string | boolean | number>[]
  onSort?: (arg: { direction: string; field: string }) => void
  loading?: boolean
  caption?: () => ReactElement
}

const Index: FunctionComponent<MyTableProps> = ({
  columns,
  data,
  onSort,
  loading = false,
  caption,
  title: tableTitle,
}) => {
  const [sortParams, setSortParam] = useState({
    direction: '',
    field: '',
  })
  return (
    <TableContainer position={'relative'}>
      {loading && (
        <Flex
          position={'absolute'}
          left={0}
          right={0}
          top={0}
          bottom={0}
          bg='rgba(0,0,0,.2)'
          borderRadius={4}
          alignItems='center'
          justify={'center'}
        >
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </Flex>
      )}
      {tableTitle && (
        <Heading size={'md'} mt={6}>
          {tableTitle}
        </Heading>
      )}

      <Table
        variant='unstyled'
        style={{
          borderCollapse: 'collapse',
          borderSpacing: '0 10px',
        }}
        className='my-table'
        title='asas'
      >
        {!!caption && !loading && <TableCaption>{caption()}</TableCaption>}
        <Thead>
          <Tr>
            {columns.map(
              ({ key, sortable, width, thAlign, title, dataIndex }) => (
                <Th
                  textAlign={thAlign}
                  key={key}
                  color={
                    sortParams.field === dataIndex
                      ? COLORS.primaryColor
                      : COLORS.infoTextColor
                  }
                  fontSize={'md'}
                  fontWeight='medium'
                  cursor={sortable ? 'pointer' : 'default'}
                  w={width || `${100 / columns.length}%`}
                  // textAlign={align}
                  onClick={() => {
                    if (!sortable) return
                    const { direction, field } = sortParams
                    if (field === dataIndex) {
                      // 改变方向
                      const nextDirection: 'ASC' | 'DESC' | '' =
                        direction === ''
                          ? 'ASC'
                          : direction === 'ASC'
                          ? 'DESC'
                          : ''
                      if (onSort) {
                        onSort({
                          ...sortParams,
                          direction: nextDirection,
                        })
                      }

                      setSortParam((prev) => ({
                        ...prev,
                        direction: nextDirection,
                      }))
                    } else {
                      // 字段改变
                      if (onSort) {
                        onSort({
                          field: dataIndex,
                          direction: 'ASC',
                        })
                      }

                      setSortParam({
                        field: dataIndex,
                        direction: 'ASC',
                      })
                    }
                  }}
                >
                  <Flex
                    justify={
                      thAlign === 'center'
                        ? 'center'
                        : thAlign === 'right'
                        ? 'flex-end'
                        : 'flex-start'
                    }
                  >
                    {title}
                    {sortable && sortParams.field !== dataIndex && (
                      <Image src={IconUnSort} />
                    )}

                    {sortParams.field === dataIndex &&
                      sortParams.direction === 'ASC' && (
                        <Image src={IconSortASC} />
                      )}
                    {sortParams.field === dataIndex &&
                      sortParams.direction === 'DESC' && (
                        <Image src={IconSortDESC} />
                      )}
                  </Flex>
                </Th>
              ),
            )}
          </Tr>
        </Thead>
        <Tbody>
          {isEmpty(data) ? (
            <Tr>
              <Td colSpan={columns.length}>
                <EmptyTableComponent />
              </Td>
            </Tr>
          ) : (
            data.map((item, rowIndex) => (
              <Tr
                key={JSON.stringify(item)}
                bg={COLORS.secondaryBgc}
                borderRadius={20}
                mb={4}
              >
                {columns.map(
                  (
                    { dataIndex, render, key, width, align = 'left' },
                    colIndex,
                  ) => (
                    <Th
                      fontSize='md'
                      key={key}
                      w={width}
                      textAlign={align}
                      borderTopLeftRadius={!(rowIndex && colIndex) ? 10 : 0}
                      borderTopRightRadius={
                        rowIndex === 0 && colIndex === columns?.length - 1
                          ? 10
                          : 0
                      }
                      borderBottomLeftRadius={!colIndex ? 10 : 0}
                      borderBottomRightRadius={
                        colIndex === columns?.length - 1 ? 10 : 0
                      }
                    >
                      {!!render ? (
                        <Flex justifyContent={align}>
                          {render(item, item[dataIndex])}
                        </Flex>
                      ) : (
                        item[dataIndex]
                      )}
                    </Th>
                  ),
                )}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default Index
