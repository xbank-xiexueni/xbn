import { Box, Heading, Flex, Text, Highlight, useToast } from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
import BigNumber from 'bignumber.js'
import { unix } from 'dayjs'
import groupBy from 'lodash-es/groupBy'
import { useCallback, useEffect, useMemo } from 'react'

import { apiGetLoans } from '@/api'
import { ConnectWalletModal, ImageWithFallback, TableList } from '@/components'
import type { ColumnProps } from '@/components/my-table'
import { FORMAT_NUMBER, UNIT } from '@/constants'
import { useWallet } from '@/hooks'
import { amortizationCalByDays } from '@/utils/calculation'
import { createWeb3Provider, createXBankContract } from '@/utils/createContract'
import formatAddress from '@/utils/formatAddress'
import { wei2Eth } from '@/utils/unit-conversion'

export const loansForBuyerColumns: ColumnProps[] = [
  {
    title: 'Asset',
    dataIndex: 'nft_collateral_id',
    key: 'nft_collateral_id',
    align: 'left',
    width: 220,
    render: (value: any, _: Record<string, any>) => (
      <Flex alignItems={'center'} gap={2}>
        <ImageWithFallback
          src={_.img as string}
          w={10}
          h={10}
          borderRadius={4}
        />
        <Text>{value}</Text>
      </Flex>
    ),
  },
  {
    title: 'Lender',
    dataIndex: 'lender_address',
    key: 'lender_address',
    render: (value: any) => <Text>{formatAddress(value.toString())}</Text>,
  },
  {
    title: 'Borrower',
    dataIndex: 'borrower_address',
    key: 'borrower_address',
    render: (value: any) => <Text>{formatAddress(value.toString())}</Text>,
  },
  {
    title: 'Start time',
    dataIndex: 'loan_start_time',
    key: 'loan_start_time',
    render: (value: any) => <Text>{unix(value).format('YYYY/MM/DD')}</Text>,
  },
  {
    title: 'Loan value',
    dataIndex: 'total_repayment',
    key: 'total_repayment',
    render: (value: any) => (
      <Text>
        {wei2Eth(value)} {UNIT}
      </Text>
    ),
  },
  {
    title: 'Duration',
    dataIndex: 'loan_duration',
    key: 'loan_duration',
    render: (value: any) => <Text>{value / 24 / 60 / 60} days</Text>,
  },
  {
    title: 'Interest',
    dataIndex: 'loan_interest_rate',
    key: 'loan_interest_rate',
    render: (_: any, item: Record<string, any>) => (
      <Text>
        {BigNumber(
          wei2Eth(
            amortizationCalByDays(
              item?.total_repayment,
              item?.loan_interest_rate / 10000,
              (item?.loan_duration / 24 / 60 / 60) as 7 | 14 | 30 | 60 | 90,
              item?.repay_times,
            )
              .multipliedBy(item?.repay_times)
              .minus(item.total_repayment)
              .toNumber(),
          ),
        ).toFormat(FORMAT_NUMBER)}
        {UNIT}
      </Text>
    ),
  },
]

const Loans = () => {
  // const navigate = useNavigate()
  const { isOpen, onClose, interceptFn, currentAccount } = useWallet()

  const toast = useToast()

  useEffect(() => interceptFn(), [interceptFn])

  // const [selectCollection, setSelectCollection] = useState<number>()

  const { loading, data, refresh } = useRequest(apiGetLoans, {
    ready: !!currentAccount,
    debounceWait: 100,
    // defaultParams: [
    // {
    //   borrower_address: currentAccount,
    // },
    // ],
  })

  // const currentCollectionLoans = useMemo(() => {
  //   return data?.data?.filter(
  //     (item: any) =>
  //       item.collectionId === selectCollection || !selectCollection,
  //   )
  // }, [data, selectCollection])

  const statuedLoans = useMemo(
    () =>
      groupBy(
        // currentCollectionLoans,
        data?.data,
        'loan_status',
      ),
    [data],
  )

  // const collectionList = useMemo(() => {
  //   const arr = data?.data || []
  //   if (isEmpty(arr)) {
  //     return []
  //   }
  //   const res: { id: number; name: string; img: string }[] = []
  //   arr.forEach((element: any) => {
  //     if (isEmpty(res.find((i) => i.id === element.collectionId))) {
  //       res.push({
  //         id: element.collectionId,
  //         name: element.collectionName,
  //         img: element.collectionImg,
  //       })
  //     }
  //   })
  //   return res
  // }, [data])

  // const getCollectionLength = useCallback(
  //   (targetId: string) => {
  //     return data?.data?.filter((i: any) => i.collectionId === targetId).length
  //   },
  //   [data],
  // )

  const handleClickRepay = useCallback(
    (loan_id: string) => {
      interceptFn(async () => {
        const xBankContract = createXBankContract()

        // 1. 查看需要偿还的金额
        const repaymentAmount = await xBankContract.methods
          .getRepaymentAmount(loan_id)
          .call()
        const provider = createWeb3Provider()

        const currentBalance = await provider.eth.getBalance(currentAccount)
        if (BigNumber(currentBalance).lt(Number(repaymentAmount))) {
          toast({
            title: 'Insufficient balance',
            status: 'warning',
          })
          return
        }
        console.log(
          currentBalance,
          repaymentAmount,
          BigNumber(currentBalance).lt(Number(repaymentAmount)),
        )

        // 2. 转账到合约

        // 3. 调用 xbank.repayLoan

        // 没写完
        // const repayHash = await xBankContract.methods
        //   .repayLoan(loan_id)
        //   .seed({
        //     from: '',
        //   })

        refresh()
      })
    },
    [interceptFn, currentAccount, refresh, toast],
  )

  return (
    <Box>
      <Heading size={'2xl'} my='60px'>
        Loans
      </Heading>

      <Flex justify={'space-between'} mt={4}>
        {/* <Box
          border={`1px solid var(--chakra-colors-gray-2)`}
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

          <List spacing={4} mt={4} position='relative'>
            <LoadingComponent loading={false} />
            {isEmpty(collectionList) && <EmptyComponent />}
            {!isEmpty(collectionList) && (
              <Flex
                justify={'space-between'}
                py={3}
                px={4}
                alignItems='center'
                borderRadius={8}
                border={`1px solid var(--chakra-colors-gray-2)`}
                cursor='pointer'
                onClick={() => {
                  setSelectCollection(undefined)
                }}
                bg={!selectCollection ? 'blue.2' : 'white'}
              >
                <Text fontSize={'sm'} fontWeight='700'>
                  All my Collections
                </Text>
                {!selectCollection ? (
                  <SvgComponent svgId='icon-checked' />
                ) : (
                  <Text fontSize={'sm'}>{10}</Text>
                )}
              </Flex>
            )}

            {!isEmpty(collectionList) &&
              collectionList.map((item: any) => (
                <CollectionListItem
                  data={{ ...item }}
                  key={item.id}
                  onClick={() => setSelectCollection(item.id)}
                  isActive={selectCollection === item.id}
                  count={getCollectionLength(item.id)}
                />
              ))}
          </List>
        </Box> */}
        <Box
          // w={{
          //   lg: '72%',
          //   md: '65%',
          // }}
          w='100%'
        >
          <TableList
            tables={[
              {
                tableTitle: () => (
                  <Heading size={'md'} mt={6}>
                    Current Loans as Borrower
                  </Heading>
                ),
                // loading: loading,
                columns: [
                  ...loansForBuyerColumns,
                  // {
                  //   title: 'next payment date',
                  //   dataIndex: 'col10',
                  //   key: 'col10',
                  // },
                  {
                    title: 'amount',
                    dataIndex: 'col9',
                    key: 'col9',
                    render: (_: any, item: Record<string, any>) => (
                      <Text>
                        {BigNumber(
                          wei2Eth(
                            amortizationCalByDays(
                              item.total_repayment,
                              item.loan_interest_rate / 10000,
                              (item.loan_duration / 24 / 60 / 60) as
                                | 7
                                | 14
                                | 30
                                | 60
                                | 90,
                              item.repay_times,
                            ).toNumber(),
                          ),
                        ).toFormat(8)}
                        &nbsp;
                        {UNIT}
                      </Text>
                    ),
                  },
                  {
                    title: '',
                    dataIndex: 'loan_id',
                    key: 'loan_id',
                    fixedRight: true,
                    render: (value: any) => (
                      <Box
                        px={3}
                        bg='white'
                        borderRadius={8}
                        cursor='pointer'
                        onClick={() => handleClickRepay(value)}
                      >
                        <Text color='blue.1' fontSize='sm' fontWeight={'700'}>
                          Repay
                        </Text>
                      </Box>
                    ),
                  },
                ],

                loading: loading,
                data: statuedLoans[0],
                key: '1',
              },
              {
                tableTitle: () => (
                  <Heading size={'md'} mt={6}>
                    <Highlight
                      styles={{
                        fontSize: '18px',
                        fontWeight: 500,
                        color: `gray.3`,
                      }}
                      query='(Paid Off)'
                    >
                      Previous Loans as Borrower(Paid Off)
                    </Highlight>
                  </Heading>
                ),

                columns: loansForBuyerColumns,
                loading: loading,
                data: statuedLoans[1],
                key: '2',
              },
              {
                tableTitle: () => (
                  <Heading size={'md'} mt={6}>
                    <Highlight
                      styles={{
                        fontSize: '18px',
                        fontWeight: 500,
                        color: `gray.3`,
                      }}
                      query='(Overdue)'
                    >
                      Previous Loans as Borrower(Overdue)
                    </Highlight>
                  </Heading>
                ),
                columns: loansForBuyerColumns,
                loading: loading,
                data: statuedLoans[2],
                key: '3',
              },
            ]}
          />
        </Box>
      </Flex>
      <ConnectWalletModal visible={isOpen} handleClose={onClose} />
    </Box>
  )
}

export default Loans
