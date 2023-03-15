import {
  Box,
  Heading,
  Flex,
  Text,
  Highlight,
  useToast,
  Spinner,
  Button,
} from '@chakra-ui/react'
import useRequest from 'ahooks/lib/useRequest'
import BigNumber from 'bignumber.js'
import { unix } from 'dayjs'
import groupBy from 'lodash-es/groupBy'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { apiGetLoans } from '@/api'
import { ConnectWalletModal, ImageWithFallback, TableList } from '@/components'
import type { ColumnProps } from '@/components/my-table'
import { FORMAT_NUMBER, UNIT } from '@/constants'
import type { AssetQuery } from '@/hooks'
import { useAssetLazyQuery, useWallet } from '@/hooks'
import { amortizationCalByDays } from '@/utils/calculation'
import { createWeb3Provider, createXBankContract } from '@/utils/createContract'
import { formatAddress } from '@/utils/format'
import { wei2Eth } from '@/utils/unit-conversion'

import type { ReactNode } from 'react'

const Loans = () => {
  // const navigate = useNavigate()
  const { isOpen, onClose, interceptFn, currentAccount } = useWallet()

  const toast = useToast()
  const [repayLoadingMap, setRepayLoadingMap] =
    useState<Record<string, boolean>>()

  useEffect(() => {
    interceptFn()
  }, [interceptFn])

  // const [selectCollection, setSelectCollection] = useState<number>()
  const [nftInfoList, setNftInfoList] = useState<AssetQuery['asset'][]>()

  const [runAsync, { loading: assetInfoLoading }] = useAssetLazyQuery()

  const { loading, data, refresh } = useRequest(apiGetLoans, {
    ready: !!currentAccount,
    debounceWait: 100,
    defaultParams: [
      {
        borrower_address: currentAccount,
      },
    ],
    onSuccess: async ({ data: _data }) => {
      let arr
      const taskPromises = _data.map(async (item) => {
        return runAsync({
          variables: {
            assetContractAddress: item?.nft_collateral_contract,
            assetTokenId: item?.nft_collateral_id,
          },
        })
          .then(({ data: assetData }) => {
            arr.push(assetData?.asset)
          })
          .catch((error: Error) => {
            console.log(
              '🚀 ~ file: NftAssetDetail.tsx:150 ~ .then ~ error:',
              error,
            )
          })
      })
      await Promise.all(taskPromises).catch((error) => {
        console.log('🚀 ~ file: NftAssetDetail.tsx:108 ~ error:', error)
      })
      setNftInfoList(arr)
    },
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
        try {
          const xBankContract = createXBankContract()
          setRepayLoadingMap((prev) => ({
            ...prev,
            [loan_id]: true,
          }))
          // 1. 查看需要偿还的金额
          const repaymentAmount = await xBankContract.methods
            .getNextRepaymentAmount(loan_id)
            .call()
          const provider = createWeb3Provider()

          const currentBalance = await provider.eth.getBalance(currentAccount)
          if (BigNumber(currentBalance).lt(Number(repaymentAmount))) {
            toast({
              title: 'Insufficient balance',
              status: 'warning',
            })
            setRepayLoadingMap((prev) => ({
              ...prev,
              [loan_id]: false,
            }))
            return
          }
          console.log(
            currentBalance,
            repaymentAmount,
            BigNumber(currentBalance).lt(Number(repaymentAmount)),
          )

          // 2. 调用 xbank.repayLoan
          const repayHash = await xBankContract.methods
            .repayLoan(loan_id)
            .send({
              from: currentAccount,
              gas: 300000,
              value: repaymentAmount,
            })
          setRepayLoadingMap((prev) => ({
            ...prev,
            [loan_id]: false,
          }))
          console.log(repayHash, 'qqqqqqq')
          toast({
            status: 'success',
            title: 'successful repayment',
          })
          refresh()
        } catch (error: any) {
          // 0x13dbffe7546510d2428edef6e609a2e2d4ed6c7cd90f5c0845d33a31688b9f6b
          console.log('🚀 ~ file: Loans.tsx:197 ~ interceptFn ~ error:', error)
          const code: string = error?.code
          const originMessage: string = error?.message
          let title: string | ReactNode = code
          let description: string | ReactNode = originMessage
          if (!code && originMessage?.includes('{')) {
            const firstIndex = originMessage.indexOf('{')
            description = ''
            try {
              const hash = JSON.parse(
                originMessage.substring(firstIndex, originMessage.length),
              )?.transactionHash

              title = (
                <Text>
                  {originMessage?.substring(0, firstIndex)} &nbsp;
                  <Button
                    variant={'link'}
                    px={0}
                    onClick={() => {
                      window.open(
                        `${
                          import.meta.env.VITE_TARGET_CHAIN_BASE_URL
                        }/tx/${hash}`,
                      )
                    }}
                    textDecoration='underline'
                    color='white'
                  >
                    see more
                  </Button>
                </Text>
              )
            } catch {
              console.log('here')
              title = originMessage?.substring(0, firstIndex)
            }
          }

          setRepayLoadingMap((prev) => ({
            ...prev,
            [loan_id]: false,
          }))
          toast({
            status: 'error',
            title,
            description,
          })
        }
      })
    },
    [interceptFn, currentAccount, refresh, toast],
  )

  const loansForBuyerColumns: ColumnProps[] = [
    {
      title: 'Asset',
      dataIndex: 'nft_asset_info',
      key: 'nft_asset_info',
      align: 'left',
      width: 180,
      render: (_: any, info: any) => {
        const currentInfo = nftInfoList?.find(
          (i) =>
            i.tokenID === info.nft_collateral_id &&
            i.assetContractAddress.toLowerCase() ===
              info.nft_collateral_contract.toLowerCase(),
        )
        return (
          <Flex alignItems={'center'} gap={2}>
            <ImageWithFallback
              src={currentInfo?.imagePreviewUrl as string}
              w={10}
              h={10}
              borderRadius={4}
            />
            <Text
              w={'60%'}
              display='inline-block'
              overflow='hidden'
              whiteSpace='nowrap'
              textOverflow='ellipsis'
            >
              {currentInfo?.name || `#${currentInfo?.tokenID}`}
            </Text>
          </Flex>
        )
      },
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
      render: (_: any, item: Record<string, any>) => {
        return (
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
                  .minus(item.total_repayment),
              ),
            ).toFormat(FORMAT_NUMBER)}
            {UNIT}
          </Text>
        )
      },
    },
  ]

  return (
    <Box mt='60px'>
      <Heading size={'2xl'} mb='60px'>
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
                            ),
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
                        onClick={() => {
                          if (repayLoadingMap && repayLoadingMap[value]) {
                            return
                          }
                          handleClickRepay(value)
                        }}
                        w='68px'
                        textAlign={'center'}
                      >
                        {repayLoadingMap && repayLoadingMap[value] ? (
                          <Spinner color='blue.1' size={'sm'} />
                        ) : (
                          <Text color='blue.1' fontSize='sm' fontWeight={'700'}>
                            Repay
                          </Text>
                        )}
                      </Box>
                    ),
                  },
                ],

                loading: loading || assetInfoLoading,
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
                loading: loading || assetInfoLoading,
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
                loading: loading || assetInfoLoading,
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
