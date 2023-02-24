import { createStandaloneToast } from '@chakra-ui/react'
import axios from 'axios'
// import { type Request } from 'aws4'
// import { decrypt } from './decrypt'
// import { PWD } from '@consts/crypt'

const { MODE, VITE_BASE_URL } = import.meta.env

const { toast } = createStandaloneToast()

const request = axios.create({
  baseURL: '',
  // headers: {
  //   appKey: '',
  //   appversion: '',
  // },
  // timeout: 10000,
})

request.interceptors.request.use(async (config) => {
  return {
    ...config,
    baseURL: MODE === 'development' ? config.baseURL : VITE_BASE_URL,
  }
})

request.interceptors.response.use(
  (resp) => {
    return resp
  },
  (error) => {
    const {
      response: { status, data },
    } = error
    if (status >= 500) {
      toast({
        title: 'Oops, something went wrong',
        status: 'error',
        isClosable: true,
        id: '5xx-error-toast',
      })
      return
    }
    if (status < 500 && status >= 400) {
      const { code, message } = data
      console.log('🚀 ~ file: request.ts:57 ~ code:', code)
      toast({
        title: message || 'Oops, something went wrong',
        status: 'error',
        isClosable: true,
        id: '4xx-error-toast',
      })
    }
    throw error
  },
)

export default request
