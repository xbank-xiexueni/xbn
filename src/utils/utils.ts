// a list for saving subscribed event instances
// const subscribedEvents = {}

import { XBANK_CONTRACT_ABI } from '@/constants'

import { createWeb3Provider } from './createContract'

const getEventData = (eventName: string) => {
  const web3 = createWeb3Provider()
  const eventAbi = XBANK_CONTRACT_ABI.find((i) => i.name === eventName)
  if (!eventAbi) {
    return {
      topic: '',
      eventAbi,
    }
  }
  const topicItem = web3.eth.abi.encodeEventSignature({
    ...eventAbi,
  })
  return {
    topic: topicItem,
    eventAbi,
  }
}

export default getEventData

// Subscriber method
// const subscribeLogEvent = (
//   eventName: string,
//   onSuccess?: () => void,
//   onError?: () => void,
// ) => {
//   const web3 = createWeb3Provider()
//   const eventAbi = XBANK_CONTRACT_ABI.find((i) => i.name === eventName)
//   if (!eventAbi) {
//     if (onError) onError()
//     return
//   }
//   const topicItem = web3.eth.abi.encodeEventSignature({
//     ...eventAbi,
//   })
//   console.log(topicItem, eventAbi, onSuccess)

//   web3.eth.subscribe(
//     'logs',
//     {
//       address: import.meta.env.VITE_XBANK_CONTRACT_ADDRESS,
//       topics: [topicItem],
//     },
//     (error: any, result: any) => {
//       console.log('🚀 ~ file: utils.ts:50 ~ error:', error, result)
//       if (!error) {
//         const eventObj = web3.eth.abi.decodeLog(
//           eventAbi.inputs,
//           result.data,
//           result.topics.slice(1),
//         )
//         console.log(eventObj)
//         if (eventObj && !isEmpty(eventObj) && onSuccess) {
//           onSuccess()
//           // const isCleared = web3.eth.clearSubscriptions()
//           console.log('new:', eventObj, 'finish clearSubscriptions')
//         }
//       } else {
//         console.log(error)
//         if (onError) onError()
//         // web3.eth.clearSubscriptions()
//       }
//     },
//   )
//   // subscribedEvents[eventName] = subscription
// }
