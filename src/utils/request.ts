import { createStandaloneToast } from '@chakra-ui/react'
import axios from 'axios'

import { TOAST_OPTION_CONFIG } from '@/constants'
// import { type Request } from 'aws4'
// import { decrypt } from './decrypt'
// import { PWD } from '@consts/crypt'

const { MODE, VITE_BASE_URL } = import.meta.env

const { toast } = createStandaloneToast({
  defaultOptions: {
    ...TOAST_OPTION_CONFIG,
  },
})

const request = axios.create({
  baseURL: '',
  // headers: {
  //   appKey: '',
  //   appversion: '',
  // },
  // timeout: 10000,
})

request.interceptors.request.use(async ({ url, baseURL, ...config }) => {
  let _baseURL = baseURL
  if (MODE !== 'development') {
    if (url === '/api/ver2/exchange/xcurrency/latest') {
      _baseURL = 'https://xcr.tratao.com/'
    } else {
      _baseURL = VITE_BASE_URL
    }
  }
  return {
    ...config,
    url,
    baseURL: _baseURL,
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
    if (window.location.pathname === '/xlending/demo') {
      throw error
    }
    if (status >= 500) {
      toast({
        title: 'Oops, network error...',
        status: 'error',
        isClosable: true,
        id: 'request-error-toast',
      })
      throw error
    }
    if (status < 500 && status >= 400) {
      const { code, message } = data
      console.log('🚀 ~ file: request.ts:57 ~ code:', code)
      toast({
        title: message || 'Oops, network error...',
        status: 'error',
        isClosable: true,
        id: 'request-error-toast',
      })
    }
    throw error
  },
)

export default request
