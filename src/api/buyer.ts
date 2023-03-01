import request from '@/utils/request'

import type { AssetListItemType, LoanOrderDataType } from '.'
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

export const apiPostLoanOrder: (
  data: LoanOrderDataType,
) => Promise<AxiosResponse<any>> = async (data) => {
  return await request.post(`/lending/api/v1/loan-order`, data)
}

export const apiGetXCurrency: () => Promise<
  AxiosResponse<{
    resources: {
      resource: {
        fields: {
          name: string
          price: number
        }
      }
    }[]
  }>
> = async () => {
  return await request.get('/api/ver2/exchange/xcurrency/latest', {
    headers: {
      appkey: 'FAceBe8acE1A11e990a19F43a0Dae3f5',
    },
  })
}
