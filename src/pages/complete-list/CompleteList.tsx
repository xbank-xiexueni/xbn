import { useLocation, useNavigate } from 'react-router-dom'

import { MiddleStatus } from '@/components'

const CompleteList = () => {
  const {
    state: { imageUrl },
  } = useLocation()
  const navigate = useNavigate()
  return (
    <MiddleStatus
      step='success'
      imagePreviewUrl={imageUrl}
      onSuccessBack={() => {
        navigate(-1)
      }}
      successDescription='You need to repay the outstanding loan unless your NFT has been sold'
      successTitle='Listing Completed'
    />
  )
}

export default CompleteList
