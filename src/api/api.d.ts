interface PoolsListItemType {
  id: number
  pool_id: number
  owner_address: string
  allow_collateral_contract: string
  support_erc20_denomination: string
  pool_amount: number
  pool_used_amount: number
  loan_count: number
  pool_maximum_percentage: number
  pool_maximum_days: number
  pool_maximum_interest_rate: number
  loan_time_concession_flexibility: number
  loan_ratio_preferential_flexibility: number
  activity: boolean
  collection_info: CollectionListItemType
}

interface CollectionListItemType {
  id: string
  name: string
  image_url: string
  contract_addr: string
  safelist_request_status?: 'not_requested' | 'verified'
  description?: string
}

interface AssetListItemType {
  id: number
  asset_contract_address: string
  token_id: string
  image_url: string
  image_preview_url: string
  image_thumbnail_url: string
  image_original_url: string
  animation_url: string
  animation_original_url: string
  background_color: string
  name: string
  description: string
  external_link: string
  likes: number
  order_chain: string
  order_coin: string
  order_price: string
  created_at: string
  updated_at: string
}

interface LoanOrderDataType {
  // pool id
  pool_id: string
  // 买家地址
  borrower_address: string
  // nft 价格
  commodity_price: string
  // 地板价 传 commodity_price
  oracle_floor_price: string
  // 首付价格
  load_principal_amount: string
  // 贷款金额
  total_repayment: string
  // 利率
  loan_interest_rate: number
  //
  loan_duration: number
  // n 期
  repay_times: number
  // token ID
  nft_collateral_id: string
}

interface LoanListItemType {
  id: number
  loan_id: number
  pool_id: number
  pool_maximum_percentage: number
  pool_maximum_days: number
  pool_interest_rate: number
  loan_time_concession_flexibility: number
  loan_ratio_preferential_flexibility: number
  lender_address: string
  borrower_address: string
  load_principal_amount: string
  total_repayment: string
  repayed_amount: string
  loan_status: 1 | 2 | 3
  loan_interest: string
  loan_interest_rate: number
  loan_start_time: number
  loan_duration: number
  repay_times: number
  commodity_price: string
  oracle_floor_price: string
  nft_collateral_contract: string
  nft_collateral_id: string
  loan_erc20_denomination: string
  activity: boolean
}

interface MyAssetListItemType {
  asset_contract_address: string
  token_id: string
  qty: string
  loan_status: 1 | 0
}

interface ListingDataType {
  platform: string
  contract_address: string
  token_id: string
  network: string
  currency: string
  qty: number
  price: string
  expiration_time: number
  borrower_address: string
}

interface AssetPriceType {
  data: {
    marketplace: string
    blur_price?: {
      amount: number
      unit: string
    }
    opensea_price?: {
      amount: number
      unit: string
      hash: string
      chain: string
      protocol_address: string
    }
  }[]
}
