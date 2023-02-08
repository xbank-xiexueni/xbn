import request from '@/utils/request'

export const apiGetBuyerLoans = async (params: any) => {
  return await request.get('/api/lp/loans', {
    params,
  })
}

export const apiGetCollectionDetail = async (id: string | number) => {
  return await request.get(`/api/collection/${id}`)
}
