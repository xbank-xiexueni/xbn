import axios from 'axios'
// import { type Request } from 'aws4'
// import { decrypt } from './decrypt'
// import { PWD } from '@consts/crypt'

const request = axios.create({
  baseURL: '',
  headers: {
    appKey: '',
    appversion: '',
  },
})

request.interceptors.request.use(
  async (config) => {
    return {
      ...config,
    }
  },
  (error) => {
    console.log('this is request error', error, error.response)
  },
)

request.interceptors.response.use((resp) => {
  return resp
})

export default request
