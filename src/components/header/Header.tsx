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
} from '@chakra-ui/react'
import kebabCase from 'lodash-es/kebabCase'
import { useCallback, useMemo } from 'react'
import Jazzicon from 'react-jazzicon'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import Icon from '@/assets/logo.png'
import { RESPONSIVE_MAX_W } from '@/constants'
import { useWallet } from '@/hooks'
import { createXBankContract } from '@/utils/createContract'

import { ConnectWalletModal, SvgComponent } from '..'

const Header = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const { isOpen, onClose, onOpen, currentAccount } = useWallet()

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

  const testClick = useCallback(async () => {
    if (!currentAccount) return
    const transactionsContract = createXBankContract()
    const listPool = await transactionsContract.listPool()
    const listLoan = await transactionsContract.listLoan()
    // const wethContract = createWethContract()
    // const res = await wethContract.name()
    console.log('transactionsContract', transactionsContract)
    console.log('listPool', listPool)
    console.log('listLoan', listLoan)
  }, [currentAccount])

  return (
    <Box position={'sticky'} top={0} zIndex={21}>
      <Box
        bg='linear-gradient(270deg, #E404E6 0%, #5843F4 53.65%, #1EF6F0
      100%)'
        h={1}
      />
      <Container bg='white' maxW={RESPONSIVE_MAX_W}>
        <Flex justify={'space-between'} h={74} alignItems='center'>
          <Flex
            alignItems={'center'}
            onClick={() => {
              navigate('/lend/my-pools')
            }}
            cursor='pointer'
          >
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
                    <Link to={`/lend/${kebabCase(item)}`} key={item}>
                      <Flex
                        borderBottomColor='gray.5'
                        gap={1}
                        px={3}
                        py={2}
                        flexDir='column'
                      >
                        <Text
                          fontSize='md'
                          _hover={{
                            color: `blue.1`,
                          }}
                          color='black.1'
                        >
                          {item}
                        </Text>
                      </Flex>
                    </Link>
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
                    <Link to={`/buy-nfts/${kebabCase(item)}`} key={item}>
                      <Flex
                        borderBottomColor={`gray.5`}
                        px={3}
                        py={2}
                        gap={1}
                        flexDir='column'
                      >
                        <Text
                          fontSize='md'
                          _hover={{
                            color: `blue.1`,
                          }}
                          color={`black.1`}
                        >
                          {item}
                        </Text>
                      </Flex>
                    </Link>
                  ))}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>

          <Flex gap={6} alignItems='center' onClick={testClick}>
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
                isDisabled={!!currentAccount}
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
