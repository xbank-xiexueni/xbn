import { Box, Button, Container, Flex, Heading, Text } from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { LpBaseRateTable, Select, SvgComponent } from '@/components'
import AsyncSelectCollection from '@/components/async-select/AsyncSelectCollection'
import COLORS from '@/utils/Colors'
import {
  SUB_RESPONSIVE_MAX_W,
  TENORS,
  COLLATERALS,
  INITIAL_COLLATERAL,
  INITIAL_TENOR,
  STEPS_DESCRIPTIONS,
} from '@/utils/constants'

import ApproveEthButton from './components/ApproveEthButton'
import CardWithBg from './components/CardWithBg'
import StepDescription from './components/StepDescription'

const Create = () => {
  const navigate = useNavigate()
  // const params = useParams()
  const { state } = useLocation()
  const [selectCollateral, setSelectCollateral] = useState(INITIAL_COLLATERAL)
  const [selectTenor, setSelectTenor] = useState(INITIAL_TENOR)
  const [selectCollection, setSelectCollection] = useState({ ...state })

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
            <Text color={COLORS.secondaryTextColor}>
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
                onChange={(e) => setSelectCollection(e)}
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
                img={<SvgComponent svgId='icon-calendar' ml={3} />}
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
                img={<SvgComponent svgId='icon-intersect' ml={3} />}
                defaultValue={{
                  label: `${INITIAL_COLLATERAL} %`,
                  value: INITIAL_COLLATERAL,
                }}
                onChange={(e) => setSelectCollateral(e?.value as number)}
                options={COLLATERALS?.map((item) => ({
                  label: `${item} %`,
                  value: item,
                }))}
                // options={[]}
              />
            </Flex>
          </CardWithBg>
          <Box mb={4}>
            <LpBaseRateTable
              selectCollateral={selectCollateral}
              selectTenor={selectTenor}
              description={{
                title: 'Set the interest rate for each loan condition',
                text: `According to the limit value of the loan conditions set in steps 1 and 2, the system refers to the historical order data to generate a suggested loan interest rate for you, and the funds approved by you under this interest rate are expected to generate income soon.
If the current loan conditions and suggested interest rates do not meet your expectations, you can adjust the loan interest rate through the big slider below, and all interest rate values in the table will increase or decrease
You can also use the small sliders on the right and bottom of the table to adjust the impact of changes in the two factors of COLLATERALS fat and loan duration on the interest rate.`,
              }}
            />
          </Box>
          <Flex justify={'center'} mb={10}>
            <ApproveEthButton
              variant={'primary'}
              w='240px'
              h='52px'
              isDisabled={isEmpty(selectCollection)}
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
