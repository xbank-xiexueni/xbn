import { createStandaloneToast } from '@chakra-ui/react'
import axios from 'axios'
// import { type Request } from 'aws4'
// import { decrypt } from './decrypt'
// import { PWD } from '@consts/crypt'

const { toast } = createStandaloneToast()

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
    toast({
      title: JSON.stringify(error.response.data),
      status: 'error',
      isClosable: true,
      id: 'error-toast',
    })
    console.log('this is request error', error, error.response)
  },
)

request.interceptors.response.use((resp) => {
  return resp
})

export default request
