import {
  Box,
  Image,
  Flex,
  Text,
  Button,
  Container,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
} from '@chakra-ui/react'
import kebabCase from 'lodash/kebabCase'
import { useContext, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'

import Icon from '@/assets/logo.png'
import { TransactionContext } from '@/context/TransactionContext'
import COLORS from '@/utils/Colors'
import { RESPONSIVE_MAX_W } from '@/utils/constants'

import IconArrowActive from '@/assets/icon/icon-arrow-down-active.svg'
import IconArrow from '@/assets/icon/icon-arrow-down.svg'

const Header = () => {
  const { currentAccount, connectWallet } = useContext(TransactionContext)
  const { pathname } = useLocation()

  const activePath = useMemo((): 'LEND' | 'BUY_NFTS' | 'SELL_NFTS' | '' => {
    if (pathname.startsWith('/lend')) {
      return 'LEND'
    }
    if (pathname.startsWith('/buy-nfts')) {
      return 'BUY_NFTS'
    }
    if (pathname.startsWith('/sell-nfts')) {
      return 'SELL_NFTS'
    }
    return ''
  }, [pathname])

  return (
    <Box position={'sticky'} top={0} zIndex={21}>
      <Box
        bg='linear-gradient(270deg, #E404E6 0%, #5843F4 53.65%, #1EF6F0
      100%)'
        h={1}
      />
      <Container bg='#FFFFFF' maxW={RESPONSIVE_MAX_W}>
        <Flex justify={'space-between'} h={74} alignItems='center'>
          <Flex alignItems={'center'}>
            <Flex gap={2} onClick={() => {}} alignItems='center'>
              <Image src={Icon} h={25} alt='icon' loading='lazy' />
            </Flex>
          </Flex>

          <Flex
            display={{
              sm: 'none',
              md: 'none',
              lg: 'flex',
            }}
            gap={10}
          >
            <Popover isLazy trigger='hover' placement='bottom-start'>
              <PopoverTrigger>
                <Button
                  variant={'ghost'}
                  fontSize={'md'}
                  px={0}
                  rightIcon={
                    <Image
                      src={activePath === 'LEND' ? IconArrowActive : IconArrow}
                    />
                  }
                  _focus={{ bg: 'transparent' }}
                  _hover={{ bg: 'transparent' }}
                  color={
                    activePath === 'LEND'
                      ? COLORS.primaryColor
                      : COLORS.textColor
                  }
                >
                  Lend
                </Button>
              </PopoverTrigger>
              <PopoverContent w={48}>
                <PopoverBody p={0}>
                  {['Pools', 'My Pools', 'Loans'].map((item, index) => (
                    <Box
                      key={item}
                      borderBottomColor={COLORS.secondaryBgc}
                      borderBottomWidth={index === 2 ? 0 : 1}
                      px={2}
                      py={2}
                    >
                      <Link to={`/lend/${kebabCase(item)}`}>
                        <Text
                          fontSize='md'
                          _hover={{
                            color: COLORS.primaryColor,
                          }}
                          color={COLORS.textColor}
                        >
                          {item}
                        </Text>
                      </Link>
                    </Box>
                  ))}
                </PopoverBody>
              </PopoverContent>
            </Popover>

            <Popover isLazy trigger='hover' placement='bottom-start'>
              <PopoverTrigger>
                <Button
                  px={0}
                  variant={'ghost'}
                  fontSize={'md'}
                  rightIcon={
                    <Image
                      src={
                        activePath === 'BUY_NFTS' ? IconArrowActive : IconArrow
                      }
                    />
                  }
                  _focus={{ bg: 'transparent' }}
                  _hover={{ bg: 'transparent' }}
                  color={
                    activePath === 'BUY_NFTS'
                      ? COLORS.primaryColor
                      : COLORS.textColor
                  }
                >
                  Buy NFTs
                </Button>
              </PopoverTrigger>
              <PopoverContent w={48}>
                <PopoverBody>
                  <PopoverBody p={0}>
                    {['Market', 'My assets', 'Loans'].map((item, index) => (
                      <Box
                        key={item}
                        borderBottomColor={COLORS.secondaryBgc}
                        borderBottomWidth={index === 2 ? 0 : 1}
                        px={2}
                        py={2}
                      >
                        <Link to={`/buy-nfts/${kebabCase(item)}`}>
                          <Text
                            fontSize='md'
                            _hover={{
                              color: COLORS.primaryColor,
                            }}
                            color={COLORS.textColor}
                          >
                            {item}
                          </Text>
                        </Link>
                      </Box>
                    ))}
                  </PopoverBody>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>

          <Button
            onClick={connectWallet}
            disabled={!!currentAccount}
            display={{
              sm: 'none',
              md: 'none',
              lg: 'block',
            }}
          >
            {currentAccount
              ? `${currentAccount.substring(0, 5)}...`
              : 'Connect'}
          </Button>

          <Popover isLazy trigger='click' placement='bottom-end'>
            <PopoverTrigger>
              <Button
                variant={'ghost'}
                fontSize={'xl'}
                display={{
                  md: 'block',
                  lg: 'none',
                }}
              >
                三
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader fontWeight='semibold'>
                Popover placement
              </PopoverHeader>
              <PopoverBody>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore.
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>
      </Container>
    </Box>
  )
}

export default Header
