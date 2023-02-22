import request from '@/utils/request'

import type { CollectionListItemType, PoolsListItemType } from '.'
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

export const apiGetLpLoans = async (params: any) => {
  return await request.get('/api/lp/loans', {
    params,
  })
}
