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

request.interceptors.request.use(
  async (config) => {
    return {
      ...config,
      baseURL: MODE === 'development' ? config.baseURL : VITE_BASE_URL,
    }
  },
  (error) => {
    toast({
      title: JSON.stringify(error.response.data),
      status: 'error',
      isClosable: true,
      id: 'error-toast',
    })
    console.log('this is request error', error, error.response)
  },
)

request.interceptors.response.use(
  (resp) => {
    return resp
  },
  (error) => {
    const {
      response: { status },
    } = error
    if (status >= 500) {
      toast({
        title: 'Oops, something went wrong',
        status: 'error',
        isClosable: true,
        id: 'error-toast',
      })
    }
    throw error
  },
)

export default request
