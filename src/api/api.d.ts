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
