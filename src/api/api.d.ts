export type PoolsListItemType = {
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

export type CollectionListItemType = {
  name: string
  image_url: string
  contract_addr: string
  safelist_request_status?: 'not_requested' | 'verified'
  description?: string
}

export type AssetListItemType = {
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

export type LoanOrderDataType = {
  // pool id
  pool_id: number
  // 买家地址
  borrower_address: string
  // nft 价格
  commodity_price: string
  // 地板价 传 commodity_price
  oracle_floor_price: string
  // 首付价格
  load_principal_amount: number
  //
  total_repayment: number
  // 利率
  loan_interest_rate: number
  //
  loan_duration: number
  // n 期
  repay_times: number
  // token ID
  nft_collateral_id: string
}
