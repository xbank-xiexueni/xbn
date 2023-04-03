import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  type CardProps,
} from '@chakra-ui/react'
import isEmpty from 'lodash-es/isEmpty'
import { useEffect, useMemo, useState, type FunctionComponent } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import {
  BaseRateTable,
  Select,
  SvgComponent,
  AsyncSelectCollection,
  NotFound,
  H5SecondaryHeader,
} from '@/components'
import {
  TENORS,
  COLLATERALS,
  INITIAL_COLLATERAL,
  INITIAL_TENOR,
  STEPS_DESCRIPTIONS,
  LP_BASE_RATE,
  RESPONSIVE_MAX_W,
} from '@/constants'
import type { NftCollection } from '@/hooks'

import CardWithBg from './components/CardWithBg'
import CreatePoolButton from './components/CreatePoolButton'
import StepDescription from './components/StepDescription'
import UpdatePoolItemsButton from './components/UpdatePoolItemsButton'

const Wrapper: FunctionComponent<
  {
    stepIndex: number
  } & CardProps
> = ({ stepIndex, children }) => {
  return (
    <CardWithBg mb={'32px'}>
      <Flex
        justify={'space-between'}
        alignItems='start'
        flexWrap={{
          md: 'nowrap',
          sm: 'wrap',
          xs: 'wrap',
        }}
        rowGap={'24px'}
        columnGap={'16px'}
        display={{
          md: 'flex',
          xs: 'block',
          sm: 'block',
        }}
      >
        <StepDescription
          data={{
            step: stepIndex,
            ...STEPS_DESCRIPTIONS[stepIndex - 1],
          }}
        />
        {children}
        {/* {isEmpty(params) ? <InputSearch /> : params.collectionId} */}
      </Flex>
    </CardWithBg>
  )
}

const Create = () => {
  const navigate = useNavigate()
  const params = useParams() as {
    action: 'create' | 'edit'
  }
  const { state } = useLocation() as {
    state: {
      contractAddress: string
      nftCollection: NftCollection
      poolData: PoolsListItemType
    }
  }
  const initialItems = useMemo(
    () => ({
      tenor: state?.poolData?.pool_maximum_days || INITIAL_TENOR,
      collateral:
        state?.poolData?.pool_maximum_percentage || INITIAL_COLLATERAL,
      loanRatioPreferentialFlexibility:
        state?.poolData?.loan_ratio_preferential_flexibility || 100,
      loanTimeConcessionFlexibility:
        state?.poolData?.loan_time_concession_flexibility || 100,
    }),
    [state],
  )

  const [selectCollateral, setSelectCollateral] = useState(
    initialItems?.collateral,
  )
  const [selectTenor, setSelectTenor] = useState(initialItems?.tenor)
  const [selectCollection, setSelectCollection] = useState<{
    contractAddress: string
    nftCollection: NftCollection
  }>({
    contractAddress: state?.contractAddress,
    nftCollection: state?.nftCollection,
  })

  const initialPoolMaximumInterestRate = useMemo(() => {
    return (
      state?.poolData?.pool_maximum_interest_rate ||
      LP_BASE_RATE[`${selectTenor}-${selectCollateral}`]
    )
  }, [state, selectCollateral, selectTenor])

  const [rateData, setRateData] = useState<{
    poolMaximumInterestRate: number
    loanRatioPreferentialFlexibility: number
    loanTimeConcessionFlexibility: number
  }>({
    poolMaximumInterestRate:
      LP_BASE_RATE[`${initialItems.tenor}-${initialItems.collateral}`],
    loanRatioPreferentialFlexibility: 100,
    loanTimeConcessionFlexibility: 100,
  })

  useEffect(() => {
    setRateData({
      poolMaximumInterestRate: initialPoolMaximumInterestRate,
      loanRatioPreferentialFlexibility:
        initialItems.loanRatioPreferentialFlexibility,
      loanTimeConcessionFlexibility: initialItems.loanTimeConcessionFlexibility,
    })
  }, [initialPoolMaximumInterestRate, initialItems])

  const collectionSelectorProps = useMemo(
    () => ({
      placeholder: 'Please select',
      onChange: (e: {
        contractAddress: string
        nftCollection: NftCollection
      }) => {
        setSelectCollection(e)
      },
      defaultValue: state
        ? {
            contractAddress: state?.contractAddress,
            nftCollection: state?.nftCollection,
          }
        : undefined,
      isDisabled: params.action === 'edit',
    }),
    [state, params],
  )

  const tenorSelectorProps = useMemo(
    () => ({
      placeholder: 'Please select',
      defaultValue: {
        label: `${initialItems.tenor} Days`,
        value: initialItems.tenor,
      },
      img: <SvgComponent svgId='icon-calendar' ml='12px' svgSize={'20px'} />,
      onChange: (e: any) => setSelectTenor(e?.value as number),
      options: TENORS?.map((item) => ({
        label: `${item} Days`,
        value: item,
      })),
    }),
    [initialItems],
  )

  const collateralSelectorProps = useMemo(
    () => ({
      placeholder: 'Please select',
      // w={'240px'}
      img: <SvgComponent svgId='icon-intersect' ml={'12px'} svgSize={'20px'} />,
      defaultValue: {
        label: `${initialItems.collateral / 100} %`,
        value: initialItems.collateral,
      },
      onChange: (e: any) => setSelectCollateral(e?.value as number),
      options: COLLATERALS?.map((item) => ({
        label: `${item / 100} %`,
        value: item,
      })),
    }),
    [initialItems],
  )

  if (!params || !['edit', 'create'].includes(params?.action)) {
    return <NotFound />
  }
  if (params.action === 'edit' && (!state || isEmpty(state))) {
    return <NotFound title='pool not found' />
  }
  return (
    <Container
      maxW={{
        ...RESPONSIVE_MAX_W,
        lg: 1024,
        xl: 1024,
      }}
      px={'2px'}
    >
      <Flex
        justify={{
          lg: 'space-between',
          md: 'flex-start',
        }}
        wrap='wrap'
        mt={{
          md: 10,
          sm: 0,
          xs: 0,
        }}
      >
        <H5SecondaryHeader />
        <Button
          leftIcon={<SvgComponent svgId='icon-arrow-left' />}
          onClick={() => {
            navigate(-1)
          }}
          display={{
            md: 'flex',
            sm: 'none',
            xs: 'none',
          }}
        >
          Back
        </Button>

        <Box
          maxW={{
            lg: 800,
            md: '100%',
          }}
        >
          <Box mb={8}>
            <Heading
              fontSize={{
                md: '40px',
                sm: '24px',
                xs: '24px',
              }}
              mb={'8px'}
            >
              {params.action === 'create' ? 'Create New Pool' : 'Manage Pool'}
            </Heading>
            {params.action === 'create' && (
              <Text
                color='gray.3'
                w={{
                  md: '75%',
                  sm: '95%',
                  xs: '95%',
                }}
              >
                Setting up a new pool to lend against borrowers with preferred
                length of duration and collateral factor ratio.
              </Text>
            )}
          </Box>
          <Wrapper stepIndex={1}>
            <Box
              display={{
                md: 'block',
                sm: 'none',
                xs: 'none',
              }}
            >
              <AsyncSelectCollection {...collectionSelectorProps} w='240px' />
            </Box>

            <Box
              display={{
                md: 'none',
                sm: 'block',
                xs: 'block',
              }}
              mt='24px'
            >
              <AsyncSelectCollection {...collectionSelectorProps} />
            </Box>
          </Wrapper>

          <Wrapper stepIndex={2}>
            <Box
              display={{
                md: 'block',
                sm: 'none',
                xs: 'none',
              }}
            >
              <Select {...tenorSelectorProps} w='240px' />
            </Box>
            <Box
              display={{
                md: 'none',
                sm: 'block',
                xs: 'block',
              }}
              mt='24px'
            >
              <Select {...tenorSelectorProps} />
            </Box>
          </Wrapper>

          <Wrapper stepIndex={3}>
            <Box
              display={{
                md: 'block',
                sm: 'none',
                xs: 'none',
              }}
            >
              <Select {...collateralSelectorProps} w='240px' />
            </Box>

            <Box
              display={{
                md: 'none',
                sm: 'block',
                xs: 'block',
              }}
              mt='24px'
            >
              <Select {...collateralSelectorProps} />
            </Box>
          </Wrapper>

          <CardWithBg mb={8} bg='gray.5'>
            <StepDescription
              data={{
                step: 4,
                ...STEPS_DESCRIPTIONS[3],
              }}
              isFull
            />
            <BaseRateTable
              defaultValue={
                state?.poolData
                  ? {
                      pool_maximum_interest_rate:
                        state.poolData.pool_maximum_interest_rate,
                      loan_ratio_preferential_flexibility:
                        state.poolData.loan_ratio_preferential_flexibility,
                      loan_time_concession_flexibility:
                        state.poolData.loan_time_concession_flexibility,
                    }
                  : undefined
              }
              selectCollateral={selectCollateral}
              selectTenor={selectTenor}
              onChange={(
                poolMaximumInterestRate,
                loanRatioPreferentialFlexibility,
                loanTimeConcessionFlexibility,
              ) => {
                setRateData((prev) => ({
                  ...prev,
                  poolMaximumInterestRate,
                  loanRatioPreferentialFlexibility,
                  loanTimeConcessionFlexibility,
                }))
              }}
            />
          </CardWithBg>

          <Flex justify={'center'} mb={'40px'}>
            {params.action === 'create' && (
              <CreatePoolButton
                variant={'primary'}
                w='240px'
                h='52px'
                isDisabled={isEmpty(selectCollection)}
                data={{
                  poolMaximumPercentage: selectCollateral,
                  poolMaximumDays: selectTenor,
                  allowCollateralContract: selectCollection?.contractAddress,
                  floorPrice:
                    selectCollection?.nftCollection?.nftCollectionStat
                      ?.floorPrice,
                  ...rateData,
                }}
              >
                Confirm
              </CreatePoolButton>
            )}
            {params.action === 'edit' && (
              <UpdatePoolItemsButton
                data={{
                  ...rateData,
                  selectCollateral,
                  selectTenor,
                }}
              >
                Confirm
              </UpdatePoolItemsButton>
            )}
          </Flex>
        </Box>
      </Flex>
    </Container>
  )
}

export default Create
