import request from '@/utils/request'

export const apiGetBuyerLoans = async (params: any) => {
  return await request.get('/api/lp/loans', {
    params,
  })
}

export const apiGetCollectionDetail = async (id: string | number) => {
  return await request.get(`/api/collection/${id}`)
}

export const apiGetAssetDetail = async ({ id }: { id: string | number }) => {
  return await request.get(`/api/asset/${id}`)
}

export const apiGetPoolsByAssets = async ({ id }: { id: string | number }) => {
  return await request.get(`/api/pools/asset/${id}`)
}
