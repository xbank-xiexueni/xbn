import request from '@/utils/request'

export const apiGetActiveCollection = async (params?: any) => {
  return await request.get('/api/active-collection', {
    params,
  })
}

export const apiGetMyPools = async (params?: any) => {
  return await request.get('/api/my-pools', {
    params,
  })
}
