import {
  Table as ChakraTable,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  type TableProps,
  Flex,
  Box,
} from '@chakra-ui/react'
import isEmpty from 'lodash-es/isEmpty'
import { useState, type ReactElement } from 'react'

import { LoadingComponent, EmptyComponent, SvgComponent } from '..'
import '../my-table/table.less'

type ColumnRenderType = (
  arg0: string | boolean | number,
  arg1: Record<string, string | boolean | number>,
) => ReactElement
export interface ColumnProps {
  title: string
  dataIndex: string
  key: string
  // col
  align?: 'left' | 'right' | 'center'
  // thead
  thAlign?: 'left' | 'right' | 'center'
  width?: number
  render?: ColumnRenderType
  sortable?: boolean
  fixedRight?: boolean
}
export type MyTableProps = TableProps & {
  columns: ColumnProps[]
  data: Record<string, any>[]
  onSort?: (arg: { direction: string; field: string }) => void
  loading?: boolean
  caption?: () => ReactElement
  emptyRender?: () => ReactElement
  maxW?: string
  tableTitle?: () => ReactElement
}

const MyTable = ({
  columns,
  data,
  onSort,
  loading = false,
  caption,
  tableTitle,
  emptyRender,
  maxW,
}: MyTableProps) => {
  const [sortParams, setSortParam] = useState({
    direction: '',
    field: '',
  })
  return (
    <Box position={'relative'}>
      {!!tableTitle && tableTitle()}
      {<LoadingComponent loading={loading} h='250px' />}
      {isEmpty(data) && (
        <Box h='250px'>
          <Box left={0} right={0} top={'40px'} bottom={0} pos='absolute'>
            {emptyRender ? emptyRender() : <EmptyComponent />}
          </Box>
        </Box>
      )}
      {!isEmpty(data) && (
        <TableContainer position={'relative'} maxW={maxW || '100%'}>
          <ChakraTable
            variant='unstyled'
            style={{
              borderCollapse: 'collapse',
              borderSpacing: '0 10px',
            }}
            className='my-table'
          >
            <Thead>
              <Tr pos='relative'>
                {columns.map(
                  ({
                    key,
                    sortable,
                    width,
                    thAlign,
                    title,
                    dataIndex,
                    fixedRight,
                  }) => (
                    <Th
                      textAlign={thAlign}
                      key={key}
                      color={
                        sortParams.field === dataIndex ? 'blue.1' : 'gray.4'
                      }
                      position={fixedRight ? 'sticky' : 'relative'}
                      zIndex={fixedRight ? 1 : 'inherit'}
                      bg='white'
                      right={0}
                      fontSize={'16px'}
                      fontWeight='medium'
                      cursor={sortable ? 'pointer' : 'default'}
                      w={width || `${100 / columns.length}%`}
                      py={0}
                      paddingInlineStart={0}
                      paddingInlineEnd={0}
                      // textAlign={align}
                      onClick={() => {
                        if (!sortable) return
                        const { direction, field } = sortParams
                        if (field === dataIndex) {
                          let nextDirection: 'ASC' | 'DESC' | '' = ''
                          let newField = field
                          if (direction === '') {
                            nextDirection = 'ASC'
                          }
                          if (direction === 'ASC') {
                            nextDirection = 'DESC'
                          }
                          if (direction === 'DESC') {
                            nextDirection = ''
                            newField = ''
                          }
                          if (onSort) {
                            onSort({
                              ...sortParams,
                              direction: nextDirection,
                              field: newField,
                            })
                          }

                          setSortParam(() => ({
                            ...sortParams,
                            direction: nextDirection,
                            field: newField,
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
                        boxShadow={
                          fixedRight
                            ? `-4px 0 5px -3px var(--chakra-colors-gray-2)`
                            : ''
                        }
                        py={'16px'}
                        minW={isEmpty(data) ? '100px' : ''}
                      >
                        {title}
                        {sortable && sortParams.field !== dataIndex && (
                          <SvgComponent svgId='icon-unsort' />
                        )}

                        {sortParams.field === dataIndex &&
                          sortParams.direction === 'ASC' && (
                            <SvgComponent svgId='icon-sort-down' />
                          )}
                        {sortParams.field === dataIndex &&
                          sortParams.direction === 'DESC' && (
                            <SvgComponent svgId='icon-sort-up' />
                          )}
                      </Flex>
                    </Th>
                  ),
                )}
              </Tr>
            </Thead>
            <Tbody>
              {data?.map((item) => (
                <Tr
                  key={JSON.stringify(item)}
                  bg='gray.5'
                  mb={'16px'}
                  pos='relative'
                >
                  {columns.map(
                    (
                      {
                        dataIndex,
                        render,
                        key,
                        width,
                        align = 'left',
                        fixedRight,
                      },
                      colIndex,
                    ) => (
                      <Th
                        fontSize={{ md: '16px', sm: '14px', xs: '14px' }}
                        key={key}
                        w={width}
                        textAlign={align}
                        position={fixedRight ? 'sticky' : 'relative'}
                        zIndex={fixedRight ? 1 : 'inherit'}
                        right={0}
                        bg={fixedRight ? 'white' : 'gray.5'}
                        py={0}
                        paddingInlineStart={0}
                        paddingInlineEnd={0}
                        borderTopRightRadius={
                          colIndex === columns?.length - 1 && !fixedRight
                            ? 10
                            : 0
                        }
                        borderBottomRightRadius={
                          colIndex === columns?.length - 1 && !fixedRight
                            ? 10
                            : 0
                        }
                        borderBottomLeftRadius={colIndex === 0 ? 10 : 0}
                        borderTopLeftRadius={colIndex === 0 ? 10 : 0}
                      >
                        <Box
                          lineHeight={{ md: '40px', sm: '20px', xs: '20px' }}
                          boxShadow={
                            fixedRight
                              ? `-4px 0 5px -3px var(--chakra-colors-gray-2)`
                              : ''
                          }
                          py={'16px'}
                          w={width}
                          paddingInlineStart={'24px'}
                          paddingInlineEnd={'24px'}
                          // display={'table-cell'}
                          bg='gray.5'
                          borderTopLeftRadius={colIndex === 0 ? 10 : 0}
                          borderTopRightRadius={
                            colIndex === columns?.length - 1 ? 10 : 0
                          }
                          borderBottomLeftRadius={colIndex === 0 ? 10 : 0}
                          borderBottomRightRadius={
                            colIndex === columns?.length - 1 ? 10 : 0
                          }
                        >
                          {!!render ? (
                            <Flex justifyContent={align}>
                              {render(item[dataIndex], item)}
                            </Flex>
                          ) : (
                            item[dataIndex]
                          )}
                        </Box>
                      </Th>
                    ),
                  )}
                </Tr>
              ))}
            </Tbody>
          </ChakraTable>
        </TableContainer>
      )}

      {!!caption && (
        <Flex justify={'center'} my={'64px'}>
          {!loading && caption()}
        </Flex>
      )}
    </Box>
  )
}

export default MyTable
