import { Box, Button, Container, Flex, Heading, Text } from '@chakra-ui/react'
import isEmpty from 'lodash-es/isEmpty'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { BaseRateTable, Select, SvgComponent } from '@/components'
import AsyncSelectCollection from '@/components/async-select/AsyncSelectCollection'
import {
  SUB_RESPONSIVE_MAX_W,
  TENORS,
  COLLATERALS,
  INITIAL_COLLATERAL,
  INITIAL_TENOR,
  STEPS_DESCRIPTIONS,
  LP_BASE_RATE,
} from '@/constants'
import type { NftCollection } from '@/hooks'

import ApproveEthButton from './components/ApproveEthButton'
import CardWithBg from './components/CardWithBg'
import StepDescription from './components/StepDescription'

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
  return (
    <Container maxW={SUB_RESPONSIVE_MAX_W}>
      <Flex
        justify={{
          lg: 'space-between',
          md: 'flex-start',
        }}
        wrap='wrap'
        mt={10}
      >
        <Button
          leftIcon={<SvgComponent svgId='icon-arrow-left' />}
          onClick={() => {
            navigate(-1)
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
            <Heading size={'lg'} mb={2}>
              Create New Pool
            </Heading>
            <Text color='gray.3'>
              Determine the Tenor length for which potential borrowers can open
              a loan against. We commonly see a 14-days Tenor.
            </Text>
          </Box>

          <CardWithBg mb={8}>
            <Flex justify={'space-between'} alignItems='start'>
              <StepDescription
                data={{
                  step: 1,
                  ...STEPS_DESCRIPTIONS[0],
                }}
              />
              <AsyncSelectCollection
                placeholder='Please select'
                onChange={(e: {
                  contractAddress: string
                  nftCollection: NftCollection
                }) => {
                  setSelectCollection(e)
                }}
                defaultValue={state}
              />
              {/* {isEmpty(params) ? <InputSearch /> : params.collectionId} */}
            </Flex>
          </CardWithBg>

          <CardWithBg mb={8}>
            <Flex justify={'space-between'} alignItems='start'>
              <StepDescription
                w={{
                  lg: '50%',
                  md: '100%',
                }}
                data={{
                  step: 2,
                  ...STEPS_DESCRIPTIONS[1],
                }}
              />

              <Select
                placeholder='Please select'
                defaultValue={{
                  label: `${INITIAL_TENOR} Days`,
                  value: INITIAL_TENOR,
                }}
                img={
                  <SvgComponent svgId='icon-calendar' ml={3} svgSize={'20px'} />
                }
                onChange={(e) => setSelectTenor(e?.value as number)}
                options={TENORS?.map((item) => ({
                  label: `${item} Days`,
                  value: item,
                }))}
                // options={[]}
              />
            </Flex>
          </CardWithBg>
          <CardWithBg mb={8}>
            <Flex justify={'space-between'} alignItems='start'>
              <StepDescription
                w={{
                  lg: '50%',
                  md: '100%',
                }}
                data={{
                  step: 3,
                  ...STEPS_DESCRIPTIONS[2],
                }}
              />
              <Select
                placeholder='Please select'
                // w={'240px'}
                img={
                  <SvgComponent
                    svgId='icon-intersect'
                    ml={3}
                    svgSize={'20px'}
                  />
                }
                defaultValue={{
                  label: `${INITIAL_COLLATERAL / 100} %`,
                  value: INITIAL_COLLATERAL,
                }}
                onChange={(e) => setSelectCollateral(e?.value as number)}
                options={COLLATERALS?.map((item) => ({
                  label: `${item / 100} %`,
                  value: item,
                }))}
                // options={[]}
              />
            </Flex>
          </CardWithBg>
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

          <Flex justify={'center'} mb={10}>
            <ApproveEthButton
              variant={'primary'}
              w='240px'
              h='52px'
              isDisabled={isEmpty(selectCollection)}
              data={{
                poolMaximumPercentage: selectCollateral,
                poolMaximumDays: selectTenor,
                allowCollateralContract: selectCollection.contractAddress,
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
