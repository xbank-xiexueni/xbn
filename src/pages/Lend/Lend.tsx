import {
  Box,
  Button,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Image,
  Heading,
  HStack,
  Tag,
  List,
} from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
import debounce from 'lodash/debounce'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FunctionComponent,
  type ReactElement,
} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import ImgLend from '@/assets/LEND.png'
import { InputSearch, Pagination, Table } from '@/components'
import type { ColumnProps, MyTableProps } from '@/components/Table'
// import { TransactionContext } from '@/context/TransactionContext'
import COLORS from '@/utils/Colors'
import { generateList } from '@/utils/utils'

import IconEth from '@/assets/icon/icon-eth.svg'
import IconPlus from '@/assets/icon/icon-plus.svg'

import { CollectionListItem } from '../buy-nfts/Market'

const DescriptionComponent: FunctionComponent<{
  data: {
    titleImage?: string
    title?: string | ReactElement
    description?: string | ReactElement
    img?: string
    keys?: {
      value: string | ReactElement
      label: string | ReactElement
    }[]
  }
}> = ({ data: { title = '', description = '', img = '', keys = [] } }) => {
  return (
    <Flex
      justify={{
        sm: 'center',
        md: 'space-between',
      }}
      alignItems='center'
      wrap='wrap'
    >
      <Box
        maxW={{
          md: '40%',
          xl: '50%',
          sm: '100%',
        }}
      >
        {typeof title === 'string' ? (
          <Heading fontSize={'6xl'}>{title}</Heading>
        ) : (
          title
        )}
        {typeof description === 'string' ? (
          <Text
            color={COLORS.secondaryTextColor}
            mt={2}
            mb={10}
            fontSize={'xl'}
            fontWeight='medium'
          >
            {description}
          </Text>
        ) : (
          description
        )}

        <HStack spacing={10}>
          {keys.map(({ label, value }) => (
            <Box key={`${label}`}>
              {typeof value === 'string' ? (
                <Heading fontSize={'3xl'}>{value}</Heading>
              ) : (
                value
              )}
              {typeof label === 'string' ? (
                <Text color={COLORS.infoTextColor}>{label}</Text>
              ) : (
                label
              )}
            </Box>
          ))}
        </HStack>
      </Box>
      <Image
        src={img}
        w={{
          sm: '100%',
          md: '440px',
        }}
      />
    </Flex>
  )
}

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

const column1: ColumnProps[] = [
  {
    title: 'Collection',
    dataIndex: 'col1',
    key: 'col1',
    align: 'left',
    render: (_, value) => (
      <Flex alignItems={'center'} gap={2}>
        <Box w={10} h={10} bg='pink' borderRadius={4} />
        <Text>{value}</Text>
      </Flex>
    ),
  },
  {
    title: 'Est. Floor*',
    dataIndex: 'col2',
    key: 'col2',
  },
  {
    title: 'TVL (USD)',
    dataIndex: 'col3',
    key: 'col3',
    sortable: true,
  },
  {
    title: 'Collateral Factor',
    dataIndex: 'col4',
    key: 'col4',
  },
  {
    title: 'Interest',
    dataIndex: 'col5',
    key: 'Interest',
  },
  {
    title: 'Trade',
    dataIndex: 'ID',
    key: 'ID',
    align: 'right',
    thAlign: 'right',
    fixed: 'right',
    render: (_, id) => {
      return (
        <Flex>
          <Link to={`/lend/pools/create/${id}`}>
            <Text>Supply</Text>
          </Link>
        </Flex>
      )
    },
  },
]

const column2: ColumnProps[] = [
  {
    title: 'Collection',
    dataIndex: 'col1',
    key: 'col1',
    align: 'left',
    render: (_, value) => (
      <Flex alignItems={'center'} gap={2}>
        <Box w={10} h={10} bg='pink' borderRadius={4} />
        <Text>{value}</Text>
      </Flex>
    ),
  },
  {
    title: 'Est. Floor*',
    dataIndex: 'col2',
    key: 'col2',
  },
  {
    title: 'TVL (USD)',
    dataIndex: 'col3',
    key: 'col3',
    sortable: true,
  },
  {
    title: 'Collateral Factor',
    dataIndex: 'col4',
    key: 'col4',
  },
  {
    title: 'Tenor',
    dataIndex: 'col5',
    key: 'col5',
  },
  {
    title: 'Interest',
    dataIndex: 'col6',
    key: 'col6',
  },
  { title: 'Loans', dataIndex: 'col7', key: 'col7' },
  {
    title: '',
    dataIndex: 'ID',
    key: 'ID',
    align: 'right',
    fixed: 'right',
    thAlign: 'right',
    render: (_, id) => {
      return (
        <Flex alignItems='center' gap={2}>
          <Link to=''>
            <Text color={COLORS.secondaryTextColor}>Details</Text>
          </Link>
          <Link to={`/lend/pools/edit/${id}`}>
            <Text
              color={COLORS.primaryColor}
              py={3}
              px={4}
              borderRadius={8}
              bg='white'
            >
              Manage
            </Text>
          </Link>
        </Flex>
      )
    },
  },
]

const column3: ColumnProps[] = [
  {
    title: 'Asset',
    dataIndex: 'col1',
    key: 'col1',
    align: 'left',
    render: (_, value) => (
      <Flex alignItems={'center'} gap={2}>
        <Box w={10} h={10} bg='pink' borderRadius={4} />
        <Text>{value}</Text>
      </Flex>
    ),
  },
  {
    title: 'Lender',
    dataIndex: 'col2',
    key: 'col2',
  },
  {
    title: 'Borrower',
    dataIndex: 'col3',
    key: 'col3',
  },
  {
    title: 'Loan value',
    dataIndex: 'col4',
    key: 'col4',
  },
  {
    title: 'Duration',
    dataIndex: 'col5',
    key: 'col5',
  },
  {
    title: 'Interest',
    dataIndex: 'col6',
    key: 'col6',
  },
]

const Lend = () => {
  // const {
  //   currentAccount,
  //   connectWallet,
  //   getBalance,
  //   balance,
  //   getBalanceFromContract,
  // } = useContext(TransactionContext)
  const {
    data: activeCollectionList,
    loading: loading1,
    runAsync: runActiveCollectionsAsync,
  } = useRequest(() => generateList(10))

  const {
    data: myPoolsList,
    loading: loading2,
    runAsync: runMyPoolsAsync,
  } = useRequest(() => generateList(20))

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [tabKey, setTabKey] = useState<0 | 1 | 2>(0)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    setTabKey(() => {
      switch (pathname) {
        case '/lend/pools':
          return 0
        case '/lend/my-pools':
          return 1
        case '/lend/loans':
          return 2
        default:
          return 0
      }
    })
  }, [pathname])

  const handleSearch = useCallback(
    (value: string) => {
      if (!value) {
        return
      }
      if (tabKey === 0) {
        runActiveCollectionsAsync()
        // 搜索 activeCollections
      }
      if (tabKey === 1) {
        // 搜索 my pools
        runMyPoolsAsync()
      }
    },
    [tabKey, runActiveCollectionsAsync, runMyPoolsAsync],
  )

  const debounceHandleSearch = useMemo(() => {
    return debounce(handleSearch, 1000)
  }, [handleSearch])

  useEffect(() => {
    debounceHandleSearch(searchValue)
  }, [searchValue, debounceHandleSearch])

  return (
    <>
      {/* <Button onClick={getBalanceFromContract}>调用啦</Button> */}
      <Box my={10}>
        <DescriptionComponent
          data={{
            img: ImgLend,
            title: 'Lend',
            description:
              'Provide funds to support NFT installment, obtain interest or collateral.',
            keys: [
              {
                label: 'Collections',
                value: '51',
              },
              {
                label: 'Historical Lent Out',
                value: (
                  <Flex alignItems={'center'}>
                    <Image src={IconEth} height={8} />
                    <Heading fontSize={'3xl'}>1,859.8</Heading>
                  </Flex>
                ),
              },
              {
                label: 'Total Value Locked',
                value: '$1.35M',
              },
            ],
          }}
        />
      </Box>

      <Tabs
        index={tabKey}
        position='relative'
        onChange={(key) => {
          setSearchValue('')
          switch (key) {
            case 0:
              navigate('/lend/pools')
              break
            case 1:
              navigate('/lend/my-pools')
              break
            case 2:
              navigate('/lend/loans')
              break

            default:
              break
          }
        }}
      >
        {tabKey !== 2 && (
          <Flex position={'absolute'} right={0} top={0}>
            <InputSearch
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
            />
            {tabKey === 0 && (
              <Button variant={'secondary'} minW='200px'>
                + Creative new pool
              </Button>
            )}
          </Flex>
        )}

        <TabList
          _active={{
            color: COLORS.primaryColor,
            fontWeight: 'bold',
          }}
          borderBottomWidth={1}
        >
          <Tab
            pt={4}
            px={2}
            pb={5}
            _selected={{
              color: COLORS.primaryColor,
              borderBottomWidth: 1,
              borderColor: COLORS.primaryColor,
            }}
            fontWeight='bold'
          >
            Active Collections
          </Tab>
          <Tab
            pt={4}
            px={2}
            pb={5}
            _selected={{
              color: COLORS.primaryColor,
              borderBottomWidth: 1,
              borderColor: COLORS.primaryColor,
            }}
            fontWeight='bold'
          >
            My Pools&nbsp;
            <Tag
              bg={COLORS.primaryColor}
              color='white'
              borderRadius={15}
              fontSize={'xs'}
              h={5}
            >
              {myPoolsList?.length}
            </Tag>
          </Tab>
          <Tab
            pt={4}
            px={2}
            pb={5}
            _selected={{
              color: COLORS.primaryColor,
              borderBottomWidth: 1,
              borderColor: COLORS.primaryColor,
            }}
            fontWeight='bold'
          >
            Open Loans
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Table
              loading={loading1}
              columns={column1}
              data={activeCollectionList || []}
              caption={() => <Pagination total={123} />}
              onSort={(args) => {
                console.log(args)
                runActiveCollectionsAsync()
              }}
            />
          </TabPanel>
          <TabPanel p={0}>
            <Table
              loading={loading2}
              columns={column2}
              data={myPoolsList || []}
              caption={() => (
                <Button
                  variant={'primary'}
                  alignItems='center'
                  leftIcon={<Image src={IconPlus} />}
                  onClick={() => {
                    navigate('/lend/pools/create')
                  }}
                >
                  New Pool
                </Button>
              )}
              onSort={(args) => {
                console.log(args, tabKey)
                runMyPoolsAsync()
              }}
            />
          </TabPanel>
          <TabPanel p={0}>
            <Flex justify={'space-between'} mt={4}>
              <Box
                border={`1px solid ${COLORS.borderColor}`}
                borderRadius={12}
                p={6}
                w={{
                  lg: '25%',
                  md: '30%',
                }}
              >
                <Heading size={'md'} mb={4}>
                  Collections
                </Heading>
                <InputSearch placeholder='Collections...' />

                <List spacing={4} mt={4}>
                  {(myPoolsList || []).map((item) => (
                    <CollectionListItem
                      data={{ ID: item.ID }}
                      key={JSON.stringify(item)}
                      // onClick={() => setSelectCollection(item)}
                      // isActive={selectCollection === item}
                    />
                  ))}
                </List>
              </Box>
              <Box
                w={{
                  lg: '72%',
                  md: '65%',
                }}
              >
                <OpenLoansTables
                  tables={[
                    {
                      title: 'Current Loans as Borrower',
                      // loading: loading,
                      columns: [
                        ...column3,
                        // {
                        //   title: '',
                        //   dataIndex: 'ID',
                        //   key: 'ID',
                        //   fixed: 'right',
                        //   render: () => (
                        //     <Flex alignItems='center'>
                        //       <Link to=''>
                        //         <Text color={COLORS.secondaryTextColor}>
                        //           Details
                        //         </Text>
                        //       </Link>
                        //       <Button
                        //         ml={1}
                        //         variant={'primaryLink'}
                        //         // onClick={() => {
                        //         //   navigate(`/lend/pools/edit/${id}`)
                        //         // }}
                        //       >
                        //         Repay
                        //       </Button>
                        //     </Flex>
                        //   ),
                        // },
                      ],

                      data: [],
                    },
                    {
                      title: 'Previous Loans as Borrower(Paid off)',
                      columns: [...column3],
                      data: [],
                    },
                    {
                      title: 'Previous Loans as Borrower(Overdue)',
                      columns: [...column3],
                      data: [],
                    },
                  ]}
                />
              </Box>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}

export default Lend
