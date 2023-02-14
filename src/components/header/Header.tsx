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
  PopoverBody,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react'
import kebabCase from 'lodash-es/kebabCase'
import { useContext, useMemo } from 'react'
import Jazzicon from 'react-jazzicon'
import { Link, useLocation } from 'react-router-dom'

import Icon from '@/assets/logo.png'
import { RESPONSIVE_MAX_W } from '@/constants'
import { TransactionContext } from '@/context/TransactionContext'

import { ConnectWalletModal, SvgComponent } from '..'

const Header = () => {
  const { currentAccount } = useContext(TransactionContext)

  const { pathname } = useLocation()

  const { isOpen, onOpen, onClose } = useDisclosure()

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
      <Container bg='white' maxW={RESPONSIVE_MAX_W}>
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
                    <SvgComponent
                      svgId={
                        activePath === 'LEND'
                          ? 'icon-arrow-down-active'
                          : 'icon-arrow-down'
                      }
                    />
                  }
                  _focus={{ bg: 'transparent' }}
                  _hover={{ bg: 'transparent' }}
                  color={activePath === 'LEND' ? 'blue.1' : 'black.1'}
                >
                  Lend
                </Button>
              </PopoverTrigger>
              <PopoverContent w={48}>
                <PopoverBody px={0} py={2}>
                  {[
                    // 'Pools',
                    'My Pools',
                    'Loans',
                  ].map((item) => (
                    <Flex
                      key={item}
                      borderBottomColor='gray.5'
                      gap={1}
                      px={3}
                      py={2}
                      flexDir='column'
                    >
                      <Link to={`/lend/${kebabCase(item)}`}>
                        <Text
                          fontSize='md'
                          _hover={{
                            color: `blue.1`,
                          }}
                          color='black.1'
                        >
                          {item}
                        </Text>
                      </Link>
                    </Flex>
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
                    <SvgComponent
                      svgId={
                        activePath === 'BUY_NFTS'
                          ? 'icon-arrow-down-active'
                          : 'icon-arrow-down'
                      }
                    />
                  }
                  _focus={{ bg: 'transparent' }}
                  _hover={{ bg: 'transparent' }}
                  color={activePath === 'BUY_NFTS' ? `blue.1` : `black.1`}
                >
                  Buy NFTs
                </Button>
              </PopoverTrigger>
              <PopoverContent w={48}>
                <PopoverBody px={0} py={2}>
                  {[
                    'Market',
                    //  'My assets',
                    'Loans',
                  ].map((item) => (
                    <Flex
                      key={item}
                      borderBottomColor={`gray.5`}
                      px={3}
                      py={2}
                      gap={1}
                      flexDir='column'
                    >
                      <Link to={`/buy-nfts/${kebabCase(item)}`}>
                        <Text
                          fontSize='md'
                          _hover={{
                            color: `blue.1`,
                          }}
                          color={`black.1`}
                        >
                          {item}
                        </Text>
                      </Link>
                    </Flex>
                  ))}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>

          <Flex gap={6} alignItems='center'>
            {!!currentAccount ? (
              <Jazzicon
                diameter={30}
                seed={parseInt(currentAccount.slice(2, 10), 16)}
              />
            ) : (
              <IconButton
                justifyContent={'center'}
                aria-label=''
                onClick={onOpen}
                bg='white'
                disabled={!!currentAccount}
                // display={{
                //   sm: 'none',
                //   md: 'none',
                //   lg: 'inline-flex',
                // }}
                icon={
                  <SvgComponent svgId='icon-wallet-outline' svgSize='24px' />
                }
              />
            )}
          </Flex>

          {/* <Popover isLazy trigger='click' placement='bottom-end'>
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
          </Popover> */}
        </Flex>
      </Container>

      <ConnectWalletModal visible={isOpen} handleClose={onClose} />
    </Box>
  )
}

export default Header
