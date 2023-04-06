import { Button } from '@chakra-ui/button'
import { useToast } from '@chakra-ui/toast'

import type { ButtonProps } from '@chakra-ui/button'
import type { FunctionComponent } from 'react'

const UpdatePoolItemsButton: FunctionComponent<
  ButtonProps & {
    data: {
      poolMaximumInterestRate: number
      loanRatioPreferentialFlexibility: number
      loanTimeConcessionFlexibility: number
      selectCollateral: number
      selectTenor: number
    }
  }
> = ({ data, ...rest }) => {
  const toast = useToast()
  return (
    <Button
      variant={'primary'}
      w='240px'
      h='52px'
      onClick={() => {
        console.log(data)
        toast({
          status: 'loading',
          title: 'This feature is under development...',
        })
      }}
      {...rest}
    >
      Confirm
    </Button>
  )
}

export default UpdatePoolItemsButton
