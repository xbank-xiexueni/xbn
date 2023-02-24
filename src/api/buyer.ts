import request from '@/utils/request'

import type { AssetListItemType } from '.'
import type { AxiosResponse } from 'axios'

export const apiGetAssetsByCollection: (query: {
  asset_contract_address?: string
}) => Promise<AxiosResponse<AssetListItemType[]>> = async (params) => {
  return await request.get(`/lending/api/v1/nft/assets`, {
    params,
  })
}

export const apiGetAssetDetail: (query: {
  asset_contract_address?: string
}) => Promise<AxiosResponse<any>> = async (params) => {
  return await request.get(`/lending/api/v1/nft/assets`, {
    params,
  })
}
