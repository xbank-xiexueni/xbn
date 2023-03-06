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
  MenuButton,
  MenuList,
  Menu,
  MenuDivider,
  MenuOptionGroup,
  MenuItemOption,
} from '@chakra-ui/react'
import kebabCase from 'lodash-es/kebabCase'
import { useCallback, useMemo } from 'react'
import Jazzicon from 'react-jazzicon'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import Icon from '@/assets/logo.png'
import { RESPONSIVE_MAX_W } from '@/constants'
import { useWallet } from '@/hooks'
import { createXBankContract } from '@/utils/createContract'
import { formatAddress } from '@/utils/format'

import { ConnectWalletModal, SvgComponent } from '..'

const Header = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const { isOpen, onClose, currentAccount, interceptFn } = useWallet()

  const activePath = useMemo((): 'LEND' | 'BUY_NFTS' | 'SELL_NFTS' | '' => {
    if (pathname.startsWith('/lending')) {
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

  const handleClickWallet = useCallback(async () => {
    interceptFn(async () => {
      if (!import.meta.env.DEV) {
        window.open(
          `${import.meta.env.VITE_TARGET_CHAIN_BASE_URL}${currentAccount}`,
        )
        return
      }
      // const wethContract = createWethContract()
      const xBankContract = createXBankContract()
      console.log(
        '🚀 ~ file: Header.tsx:62 ~ handleClickWal ~ xBankContract:',
        xBankContract,
      )
      const listPool = await xBankContract.methods.listPool().call()
      const listLoan = await xBankContract.methods.listLoan().call()
      // const _allowance = await wethContract.methods
      //   .allowance(currentAccount, XBANK_CONTRACT_ADDRESS)
      //   .call()

      // const balanceOf = await wethContract.methods
      //   .balanceOf(currentAccount)
      //   .call()
      // console.log('🚀 ~ file: Header.tsx:61 ~ testClick ~ balanceOf:', balanceOf)

      // const allowanceEth = wei2Eth(_allowance)
      // console.log(
      //   '🚀 ~ file: Header.tsx:59 ~ testClick ~ allowanceEth:',
      //   allowanceEth,
      // )
      console.log('transactionsContract', xBankContract.methods)
      console.log('listLoan', listLoan)
      console.log(
        '🚀 ~ file: Header.tsx:67 ~ handleClickWal ~ listPool:',
        listPool,
      )
    })
  }, [interceptFn, currentAccount])

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
              navigate('/lending/my-pools')
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
                {/* <Link to='/lending/my-pools'> */}
                <Flex
                  fontSize={'md'}
                  px={0}
                  gap={1}
                  _focus={{ bg: 'transparent' }}
                  _hover={{ bg: 'transparent' }}
                  color={activePath === 'LEND' ? 'blue.1' : 'black.1'}
                  fontWeight='700'
                  alignItems={'center'}
                  cursor='pointer'
                >
                  Lend
                  <SvgComponent
                    svgId={
                      activePath === 'LEND'
                        ? 'icon-arrow-down-active'
                        : 'icon-arrow-down'
                    }
                  />
                </Flex>
                {/* </Link> */}
              </PopoverTrigger>
              <PopoverContent w={48}>
                <PopoverBody px={0} py={2}>
                  {[
                    // 'Pools',
                    'My Pools',
                    'Loans',
                  ].map((item) => (
                    <Link to={`/lending/${kebabCase(item)}`} key={item}>
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
                {/* <Link to='/buy-nfts/market'> */}
                <Flex
                  fontSize={'md'}
                  px={0}
                  _focus={{ bg: 'transparent' }}
                  _hover={{ bg: 'transparent' }}
                  color={activePath === 'BUY_NFTS' ? `blue.1` : `black.1`}
                  fontWeight='700'
                  alignItems={'center'}
                  gap={1}
                  cursor='pointer'
                >
                  Buy NFTs
                  <SvgComponent
                    svgId={
                      activePath === 'BUY_NFTS'
                        ? 'icon-arrow-down-active'
                        : 'icon-arrow-down'
                    }
                  />
                </Flex>
                {/* </Link> */}
              </PopoverTrigger>
              <PopoverContent w={48}>
                <PopoverBody px={0} py={2}>
                  {[
                    'Market',

                    // 'My assets',
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

          <Flex
            gap={6}
            alignItems='center'
            onClick={handleClickWallet}
            display={{
              sm: 'none',
              md: 'none',
              lg: 'flex',
            }}
            cursor='pointer'
          >
            {!!currentAccount ? (
              <Jazzicon
                diameter={30}
                seed={parseInt(currentAccount.slice(2, 10), 16)}
              />
            ) : (
              <IconButton
                justifyContent={'center'}
                aria-label=''
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

          <Menu>
            <MenuButton
              aria-label='Options'
              display={{
                md: 'flex',
                lg: 'none',
              }}
            >
              <SvgComponent svgId='open' svgSize={'24px'} />
            </MenuButton>
            <MenuList minWidth='240px'>
              <MenuOptionGroup title='Lend' type='radio'>
                <Link to='/lending/my-pools'>
                  <MenuItemOption as='span' color={'black.1'}>
                    My pools
                  </MenuItemOption>
                </Link>
                <Link to='/lending/loans'>
                  <MenuItemOption as='span' color={'black.1'}>
                    Loans
                  </MenuItemOption>
                </Link>
              </MenuOptionGroup>
              <MenuDivider />
              <MenuOptionGroup title='Buy nfts'>
                <Link to='/buy-nfts/market'>
                  <MenuItemOption as='span' color={'black.1'}>
                    Market
                  </MenuItemOption>
                </Link>
                <Link to='/buy-nfts/loans'>
                  <MenuItemOption as='span' color={'black.1'}>
                    Loans
                  </MenuItemOption>
                </Link>
              </MenuOptionGroup>

              <MenuDivider />
              <Flex justify={'center'} py={2} onClick={handleClickWallet}>
                {!!currentAccount ? (
                  <Flex alignItems={'center'} gap={1} color='gray.3'>
                    <Jazzicon
                      diameter={30}
                      seed={parseInt(currentAccount.slice(2, 10), 16)}
                    />
                    &nbsp;{formatAddress(currentAccount)}
                  </Flex>
                ) : (
                  <Button>
                    <SvgComponent svgId='icon-wallet-outline' svgSize='24px' />
                    &nbsp;Connect
                  </Button>
                )}
              </Flex>
            </MenuList>
          </Menu>
        </Flex>
      </Container>

      <ConnectWalletModal visible={isOpen} handleClose={onClose} />
    </Box>
  )
}

export default Header
