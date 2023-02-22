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
