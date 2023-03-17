import request from '@/utils/request'

import type { AxiosResponse } from 'axios'

export const apiGetActiveCollection: () => Promise<
  AxiosResponse<CollectionListItemType[]>
> = async (params?: any) => {
  return await request.get('/lending/api/v1/nft/collections ', {
    params,
  })
}

export const apiGetPools: (
  query: Record<string, string>,
) => Promise<AxiosResponse<PoolsListItemType[]>> = async (query) => {
  return await request.get(`/lending/api/v1/nft/pools`, {
    params: query,
  })
}

export const apiGetLoans: (query: {
  pool_id?: number
  lender_address?: string
  borrower_address?: string
}) => Promise<AxiosResponse<LoanListItemType[]>> = async (params) => {
  return await request.get('/lending/api/v1/loans', {
    params,
  })
}
