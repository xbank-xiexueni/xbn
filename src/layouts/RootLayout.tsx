import { Container } from '@chakra-ui/react'

import { Footer, Header } from '@/components'
import { RESPONSIVE_MAX_W } from '@/constants'

const RootLayout: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  return (
    <>
      <Header />
      <Container maxW={RESPONSIVE_MAX_W}>{children}</Container>
      <Footer />
    </>
  )
}

export default RootLayout
