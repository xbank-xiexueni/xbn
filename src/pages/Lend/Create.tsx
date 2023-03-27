import { Box, Button, Container, Flex, Heading, Text } from '@chakra-ui/react'
import isEmpty from 'lodash-es/isEmpty'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  BaseRateTable,
  Select,
  SvgComponent,
  AsyncSelectCollection,
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

import ApproveEthButton from './components/ApproveEthButton'
import CardWithBg from './components/CardWithBg'
import StepDescription from './components/StepDescription'

import type { CardProps } from '@chakra-ui/react'
import type { FunctionComponent } from 'react'

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
  // const params = useParams()
  const { state } = useLocation()
  const [selectCollateral, setSelectCollateral] = useState(INITIAL_COLLATERAL)
  const [selectTenor, setSelectTenor] = useState(INITIAL_TENOR)
  const [selectCollection, setSelectCollection] = useState<{
    contractAddress: string
    nftCollection: NftCollection
  }>({ ...state })

  const [rateData, setRateData] = useState<{
    poolMaximumInterestRate: number
    loanRatioPreferentialFlexibility: number
    loanTimeConcessionFlexibility: number
  }>({
    poolMaximumInterestRate:
      LP_BASE_RATE[`${INITIAL_TENOR}-${INITIAL_COLLATERAL}`],
    loanRatioPreferentialFlexibility: 100,
    loanTimeConcessionFlexibility: 100,
  })

  useEffect(() => {
    setRateData({
      poolMaximumInterestRate:
        LP_BASE_RATE[`${selectTenor}-${selectCollateral}`],
      loanRatioPreferentialFlexibility: 100,
      loanTimeConcessionFlexibility: 100,
    })
  }, [selectCollateral, selectTenor])

  const collectionSelectorProps = useMemo(
    () => ({
      placeholder: 'Please select',
      onChange: (e: {
        contractAddress: string
        nftCollection: NftCollection
      }) => {
        setSelectCollection(e)
      },
      defaultValue: state,
    }),
    [state],
  )

  const tenorSelectorProps = useMemo(
    () => ({
      placeholder: 'Please select',
      defaultValue: {
        label: `${INITIAL_TENOR} Days`,
        value: INITIAL_TENOR,
      },
      img: <SvgComponent svgId='icon-calendar' ml='12px' svgSize={'20px'} />,
      onChange: (e: any) => setSelectTenor(e?.value as number),
      options: TENORS?.map((item) => ({
        label: `${item} Days`,
        value: item,
      })),
    }),
    [],
  )

  const collateralSelectorProps = useMemo(
    () => ({
      placeholder: 'Please select',
      // w={'240px'}
      img: <SvgComponent svgId='icon-intersect' ml={'12px'} svgSize={'20px'} />,
      defaultValue: {
        label: `${INITIAL_COLLATERAL / 100} %`,
        value: INITIAL_COLLATERAL,
      },
      onChange: (e: any) => setSelectCollateral(e?.value as number),
      options: COLLATERALS?.map((item) => ({
        label: `${item / 100} %`,
        value: item,
      })),
    }),
    [],
  )
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
        <Flex
          display={{
            md: 'none',
            sm: 'flex',
            xs: 'flex',
          }}
          onClick={() => {
            navigate(-1)
          }}
          py={'20px'}
        >
          <SvgComponent
            svgId='icon-arrow-down'
            fill={'black.1'}
            transform='rotate(90deg)'
          />
        </Flex>
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
              Create New Pool
            </Heading>
            <Text color='gray.3'>
              Setting up a new pool to lend against borrowers with preferred
              length of duration and collateral factor ratio.
            </Text>
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
            />
            <BaseRateTable
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
            <ApproveEthButton
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
            </ApproveEthButton>
          </Flex>
        </Box>
      </Flex>
    </Container>
  )
}

export default Create
