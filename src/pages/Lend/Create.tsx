import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Image,
  Tag,
  Text,
  type BoxProps,
  type CardProps,
} from '@chakra-ui/react'
import { useState, type FunctionComponent } from 'react'
import { useNavigate } from 'react-router-dom'

import { LpBaseRateTable, Select } from '@/components'
import AsyncSelectCollection from '@/components/async-select/AsyncSelectCollection'
import COLORS from '@/utils/Colors'
import {
  SUB_RESPONSIVE_MAX_W,
  TENORS,
  COLLATERALS,
  INITIAL_COLLATERAL,
  INITIAL_TENOR,
} from '@/utils/constants'

import IconArrowLeft from '@/assets/icon/icon-arrow-left.svg'
import IconTime from '@/assets/icon/icon-calendar.svg'
import IconIntersect from '@/assets/icon/icon-intersect.svg'

const CardWithBg: FunctionComponent<CardProps> = (props) => {
  return (
    <Card bg={COLORS.secondaryBgc} borderRadius={'16px'} p={8} {...props} />
  )
}

export const DescriptionComponent: FunctionComponent<
  {
    data: {
      step: number
      title: string
      text: string
    }
  } & BoxProps
> = ({ data: { step, title, text }, ...rest }) => {
  return (
    <Box {...rest}>
      <Flex mb={5} alignItems='center'>
        <Tag
          bg={COLORS.primaryColor}
          color='white'
          borderRadius={'50%'}
          mr={4}
          w={8}
          h={8}
          justifyContent='center'
        >
          {step}
        </Tag>
        <Heading size={'md'}>{title}</Heading>
      </Flex>
      <Text color={COLORS.secondaryTextColor}>{text}</Text>
    </Box>
  )
}

const STEPS_DESCRIPTIONS = [
  {
    title: 'Select Collection',
    text: 'In order to open a new pool we will first Have to determine which FT Collection you will want this pool to represent. You can start searching for any collection currently listed on OpenSea, X2Y2 and LooksRare.',
  },
  {
    title: 'Select Tenor',
    text: 'Determine the Tenor length for which potential borrowers can open a loan against. We commonly see a 60-days Tenor.',
  },
  {
    title: 'Select COLLATERALS Factor',
    text: 'Indicate the Colleteral Factor % which will help determine how much liquidity (Ethereum) borrowers can receive against the desired NFT collection. The higher the %, the more liquidity they can pull out of the pool. We typically recommend a 50% COLLATERALS Factor.',
  },
  {
    title: 'Set the interest rate for each loan condition',
    text: `According to the limit value of the loan conditions set in steps 1 and 2, the system refers to the historical order data to generate a suggested loan interest rate for you, and the funds approved by you under this interest rate are expected to generate income soon.
If the current loan conditions and suggested interest rates do not meet your expectations, you can adjust the loan interest rate through the big slider below, and all interest rate values in the table will increase or decrease
You can also use the small sliders on the right and bottom of the table to adjust the impact of changes in the two factors of COLLATERALS fat and loan duration on the interest rate.`,
  },
]

const Create = () => {
  const navigate = useNavigate()
  // const params = useParams()
  const [selectCollateral, setSelectCollateral] = useState(INITIAL_COLLATERAL)
  const [selectTenor, setSelectTenor] = useState(INITIAL_TENOR)

  return (
    <Container maxW={SUB_RESPONSIVE_MAX_W}>
      <Flex
        justify={{
          lg: 'space-between',
          md: 'flex-start',
        }}
        wrap='wrap'
      >
        <Button
          leftIcon={<Image src={IconArrowLeft} />}
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
              <DescriptionComponent
                data={{
                  step: 1,
                  ...STEPS_DESCRIPTIONS[0],
                }}
              />
              <AsyncSelectCollection placeholder='Please select' />
              {/* {isEmpty(params) ? <InputSearch /> : params.collectionId} */}
            </Flex>
          </CardWithBg>

          <CardWithBg mb={8}>
            <Flex justify={'space-between'} alignItems='start'>
              <DescriptionComponent
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
                img={IconTime}
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
              <DescriptionComponent
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
                img={IconIntersect}
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
            <Button
              variant={'primary'}
              // onClick={() => navigate('/lend/pools/create/preview')}
            >
              Deposit ETH
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Container>
  )
}

export default Create
