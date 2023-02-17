export { xBankContractAbi, wethContractAbi } from './contractABI'

export const xBankContractAddress = '0x3ed06e155eb4135ecc1591142cce51c90b0d1047'
export const wethContractAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

export const RESPONSIVE_MAX_W = {
  xl: 1408,
  lg: 968,
  md: 768,
  sm: '85%',
}

export const SUB_RESPONSIVE_MAX_W = {
  lg: 1024,
  md: 768,
  sm: '85%',
}

export const UNIT = 'ETH'

export const LP_BASE_RATE: Record<string, number> = {
  '7-10': 11,
  '7-20': 12,
  '7-30': 18,
  '7-40': 20,
  '7-50': 30,
  '7-60': 40,
  '7-70': 50,
  '7-80': 60,
  '7-90': 70,
  '14-10': 12,
  '14-20': 14,
  '14-30': 21,
  '14-40': 25,
  '14-50': 35,
  '14-60': 45,
  '14-70': 55,
  '14-80': 65,
  '14-90': 75,
  '30-10': 13,
  '30-20': 16,
  '30-30': 24,
  '30-40': 30,
  '30-50': 40,
  '30-60': 50,
  '30-70': 60,
  '30-80': 70,
  '30-90': 80,
  '60-10': 14,
  '60-20': 18,
  '60-30': 27,
  '60-40': 35,
  '60-50': 45,
  '60-60': 55,
  '60-70': 65,
  '60-80': 75,
  '60-90': 85,
  '90-10': 15,
  '90-20': 20,
  '90-30': 30,
  '90-40': 40,
  '90-50': 50,
  '90-60': 60,
  '90-70': 70,
  '90-80': 80,
  '90-90': 90,
}

export const TENORS = [7, 14, 30, 60, 90]
export const COLLATERALS = [10, 20, 30, 40, 50, 60, 70, 80, 90]
export const INITIAL_TENOR = TENORS[3]
export const INITIAL_COLLATERAL = COLLATERALS[4]

export const STEPS_DESCRIPTIONS = [
  {
    title: 'Select Collection',
    text: 'In order to open a new pool we will first Have to determine which FT Collection you will want this pool to represent. You can start searching for any collection currently listed on OpenSea, X2Y2 and LooksRare.',
  },
  {
    title: 'Select Tenor',
    text: 'Determine the Tenor length for which potential borrowers can open a loan against. We commonly see a 60-days Tenor.',
  },
  {
    title: 'Select Collateral Factor',
    text: 'Indicate the Colleteral Factor % which will help determine how much liquidity (Ethereum) borrowers can receive against the desired NFT collection. The higher the %, the more liquidity they can pull out of the pool. We typically recommend a 50% Collateral Factor.',
  },
  {
    title: 'Set the interest rate for each loan condition',
    text: `According to the limit value of the loan conditions set in steps 1 and 2, the system refers to the historical order data to generate a suggested loan interest rate for you, and the funds approved by you under this interest rate are expected to generate income soon.
If the current loan conditions and suggested interest rates do not meet your expectations, you can adjust the loan interest rate through the big slider below, and all interest rate values in the table will increase or decrease
You can also use the small sliders on the right and bottom of the table to adjust the impact of changes in the two factors of COLLATERALS fat and loan duration on the interest rate.`,
  },
]
