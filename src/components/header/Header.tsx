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
  Menu,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
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

  const { isOpen, onClose, currentAccount, interceptFn, handleDisconnect } =
    useWallet()

  const activePath = useMemo((): 'LEND' | 'BUY_NFTS' | 'SELL_NFTS' | '' => {
    if (pathname.startsWith('/xlending/lending')) {
      return 'LEND'
    }
    if (pathname.startsWith('/xlending/buy-nfts')) {
      return 'BUY_NFTS'
    }
    if (pathname.startsWith('/xlending/sell-nfts')) {
      return 'SELL_NFTS'
    }
    return ''
  }, [pathname])

  const handleOpenEtherscan = useCallback(() => {
    interceptFn(() => {
      window.open(
        `${
          import.meta.env.VITE_TARGET_CHAIN_BASE_URL
        }/address/${currentAccount}`,
      )
    })
  }, [interceptFn, currentAccount])

  const handleClickWallet = useCallback(async () => {
    interceptFn(async () => {
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
  }, [interceptFn])

  console.log(pathname)

  return (
    <Box position={'sticky'} top={0} zIndex={21}>
      <Box
        bg='linear-gradient(270deg, #E404E6 0%, #5843F4 53.65%, #1EF6F0
      100%)'
        h={1}
      />
      <Container
        bg='white'
        maxW={RESPONSIVE_MAX_W}
        boxShadow='0px 1px 0px rgba(0, 0, 0, 0.08)'
      >
        <Flex
          justify={'space-between'}
          h={{
            md: 74,
            sm: '56px',
            xs: '56px',
          }}
          alignItems='center'
        >
          <Flex
            alignItems={'center'}
            onClick={() => {
              if (pathname === '/xlending/demo') return
              navigate('/xlending/lending/my-pools')
            }}
            cursor='pointer'
          >
            <Flex gap={2} onClick={() => {}} alignItems='center'>
              <Image
                src={Icon}
                h={{
                  md: 25,
                  xs: '20px',
                  sm: '20px',
                }}
                alt='icon'
                loading='lazy'
              />
            </Flex>
          </Flex>

          <Flex
            display={{
              xs: 'none',
              sm: 'none',
              md: 'none',
              lg: 'flex',
            }}
            gap={10}
            hidden={pathname === '/xlending/demo'}
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
                    <Link
                      to={`/xlending/lending/${kebabCase(item)}`}
                      key={item}
                    >
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
                    <Link
                      to={`/xlending/buy-nfts/${kebabCase(item)}`}
                      key={item}
                    >
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
            display={{
              xs: 'none',
              sm: 'none',
              md: 'none',
              lg: 'flex',
            }}
            cursor='pointer'
          >
            {currentAccount ? (
              <IconButton
                onClick={handleOpenEtherscan}
                justifyContent={'center'}
                aria-label=''
                bg='white'
                icon={
                  <Jazzicon
                    diameter={30}
                    seed={parseInt(currentAccount.slice(2, 10), 16)}
                  />
                }
              />
            ) : (
              <IconButton
                onClick={handleClickWallet}
                justifyContent={'center'}
                aria-label=''
                bg='white'
                icon={
                  <SvgComponent svgId='icon-wallet-outline' svgSize='30px' />
                }
              />
            )}

            <Popover isLazy trigger='hover' placement='bottom-start'>
              <PopoverTrigger>
                <IconButton
                  justifyContent={'center'}
                  aria-label=''
                  bg='white'
                  icon={
                    <SvgComponent svgId='icon-wallet-outline' svgSize='30px' />
                  }
                  hidden={!currentAccount}
                />
              </PopoverTrigger>
              <PopoverContent w='160px'>
                <PopoverBody p={'10px'}>
                  <Button
                    variant={'link'}
                    color='black.1'
                    p={'10px'}
                    onClick={handleOpenEtherscan}
                  >
                    {formatAddress(currentAccount)}
                  </Button>
                  <Button
                    variant={'link'}
                    color='black.1'
                    p={'10px'}
                    _hover={{
                      textDecoration: 'none',
                    }}
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>

          <Flex
            gap={5}
            display={{
              xs: 'flex',
              sm: 'flex',
              md: 'flex',
              lg: 'none',
            }}
          >
            <IconButton
              onClick={handleOpenEtherscan}
              justifyContent={'center'}
              aria-label=''
              bg='white'
              icon={
                <Jazzicon
                  diameter={30}
                  seed={parseInt(currentAccount.slice(2, 10), 16)}
                />
              }
              hidden={!currentAccount}
            />
            <IconButton
              justifyContent={'center'}
              aria-label=''
              bg='white'
              icon={<SvgComponent svgId='icon-wallet-outline' svgSize='32px' />}
            />
            <Menu>
              <MenuButton aria-label='Options'>
                <SvgComponent svgId='icon-expand1' svgSize={'24px'} />
              </MenuButton>
              <MenuList minWidth='240px' hidden={pathname === '/xlending/demo'}>
                <MenuOptionGroup title='Lend' type='radio'>
                  <Link to='/xlending/lending/my-pools'>
                    <MenuItemOption as='span' color={'black.1'}>
                      My pools
                    </MenuItemOption>
                  </Link>
                  <Link to='/xlending/lending/loans'>
                    <MenuItemOption as='span' color={'black.1'}>
                      Loans
                    </MenuItemOption>
                  </Link>
                </MenuOptionGroup>
                <MenuDivider />
                <MenuOptionGroup title='Buy nfts'>
                  <Link to='/xlending/buy-nfts/market'>
                    <MenuItemOption as='span' color={'black.1'}>
                      Market
                    </MenuItemOption>
                  </Link>
                  <Link to='/xlending/buy-nfts/loans'>
                    <MenuItemOption as='span' color={'black.1'}>
                      Loans
                    </MenuItemOption>
                  </Link>
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Container>

      <ConnectWalletModal visible={isOpen} handleClose={onClose} />
    </Box>
  )
}

export default Header
