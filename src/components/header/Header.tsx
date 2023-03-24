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
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionIcon,
  AccordionButton,
  AccordionPanel,
} from '@chakra-ui/react'
import kebabCase from 'lodash-es/kebabCase'
import { useCallback, useMemo, useRef } from 'react'
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
  const {
    isOpen: drawVisible,
    onOpen: openDraw,
    onClose: closeDraw,
  } = useDisclosure()
  const btnRef = useRef<HTMLButtonElement>(null)
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

  const ConnectedIconWallet = useMemo(
    () => (
      <Popover isLazy trigger='click' placement='bottom-end'>
        <PopoverTrigger>
          <IconButton
            justifyContent={'center'}
            aria-label=''
            bg='white'
            icon={<SvgComponent svgId='icon-wallet-outline' svgSize='30px' />}
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
    ),
    [handleOpenEtherscan, handleDisconnect, currentAccount],
  )

  return (
    <Box
      position={'sticky'}
      top={0}
      zIndex={21}
      borderBottomColor='rgba(0, 0, 0, 0.05)'
      borderBottomWidth={1}
    >
      <Box
        bg='linear-gradient(270deg, #E404E6 0%, #5843F4 53.65%, #1EF6F0
      100%)'
        h={{ md: 1, sm: '1px', xs: '1px' }}
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
            <Flex gap={'8px'} onClick={() => {}} alignItems='center'>
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
            gap='40px'
            hidden={pathname === '/xlending/demo'}
          >
            <Popover isLazy trigger='hover' placement='bottom-start'>
              <PopoverTrigger>
                {/* <Link to='/lending/my-pools'> */}
                <Flex
                  fontSize='16px'
                  px={0}
                  gap={'4px'}
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
                <PopoverBody px={0} py={'4px'}>
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
                        gap={'4px'}
                        px='12px'
                        py={'4px'}
                        flexDir='column'
                      >
                        <Text
                          fontSize='16px'
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
                  fontSize='16px'
                  px={0}
                  _focus={{ bg: 'transparent' }}
                  _hover={{ bg: 'transparent' }}
                  color={activePath === 'BUY_NFTS' ? `blue.1` : `black.1`}
                  fontWeight='700'
                  alignItems={'center'}
                  gap={'4px'}
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
                <PopoverBody px={0} py={'4px'}>
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
                        px='12px'
                        py={'4px'}
                        gap={'4px'}
                        flexDir='column'
                      >
                        <Text
                          fontSize='16px'
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
            gap='24px'
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
            {ConnectedIconWallet}
          </Flex>

          {/*  移动端 */}
          <Flex
            gap={'20px'}
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
            {ConnectedIconWallet}
            <IconButton
              icon={<SvgComponent svgId='icon-expand1' svgSize={'24px'} />}
              ref={btnRef}
              aria-label=''
              onClick={openDraw}
              bg='white'
            />

            <Drawer
              isOpen={drawVisible}
              placement='right'
              onClose={closeDraw}
              finalFocusRef={btnRef}
            >
              <DrawerOverlay bg='transparent' top={'4px'} />
              <DrawerContent maxW='100%'>
                <Box
                  bg='linear-gradient(270deg, #E404E6 0%, #5843F4 53.65%, #1EF6F0 100%)'
                  h={'1px'}
                />
                <DrawerCloseButton pt='30px' size={'24px'} mr='24px' />
                <DrawerHeader />

                <DrawerBody mt='40px'>
                  <Accordion
                    allowMultiple
                    defaultIndex={
                      activePath === 'LEND'
                        ? 0
                        : activePath === 'BUY_NFTS'
                        ? 1
                        : 0
                    }
                  >
                    <AccordionItem border={'none'}>
                      <Text>
                        <AccordionButton>
                          <Box
                            as='span'
                            flex='1'
                            textAlign='left'
                            fontSize={'24px'}
                            fontWeight='700'
                          >
                            Lend
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </Text>
                      <AccordionPanel px={8} py={'28px'}>
                        <Flex flexDir={'column'} gap={8} onClick={closeDraw}>
                          {[
                            // 'Pools',
                            'My Pools',
                            'Loans',
                          ].map((item) => (
                            <Link
                              to={`/xlending/lending/${kebabCase(item)}`}
                              key={item}
                            >
                              <Flex fontSize='16px' color='gray.3'>
                                {item}
                              </Flex>
                            </Link>
                          ))}
                        </Flex>
                      </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem border={'none'}>
                      <Text>
                        <AccordionButton>
                          <Box
                            as='span'
                            flex='1'
                            textAlign='left'
                            fontSize={'24px'}
                            fontWeight='700'
                          >
                            Buy NFTs
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </Text>
                      <AccordionPanel px={8} py={'28px'}>
                        <Flex flexDir={'column'} gap={8} onClick={closeDraw}>
                          {[
                            'Market',

                            // 'My assets',
                            'Loans',
                          ].map((item) => (
                            <Link
                              to={`/xlending/buy-nfts/${kebabCase(item)}`}
                              key={item}
                            >
                              <Flex fontSize='16px' color='gray.3'>
                                {item}
                              </Flex>
                            </Link>
                          ))}
                        </Flex>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </Flex>
        </Flex>
      </Container>

      <ConnectWalletModal visible={isOpen} handleClose={onClose} />
    </Box>
  )
}

export default Header
