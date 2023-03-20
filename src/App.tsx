import { Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'

import { Fallback } from '@/components'

import lazyWithRetries from './utils/lazyWithRetries'

// import NotFound from './pages/404'
// import PoolCreate from './pages/Lend/Create'
// import Lend from './pages/Lend/Lend'
// import LoansForBuyer from './pages/buy-nfts//Loans'
// import Market from './pages/buy-nfts/Market'
// import MyAssets from './pages/buy-nfts/MyAssets'
// import NftAssetDetail from './pages/buy-nfts/NftAssetDetail'

// Lend
const Lend = lazyWithRetries(() => import('./pages/Lend/Lend'))
const PoolCreate = lazyWithRetries(() => import('./pages/Lend/Create'))
// const PoolEdit = lazy(() => import('./pages/Lend/Edit'))

// buy nfts
const Market = lazyWithRetries(() => import('./pages/buy-nfts/Market'))
const MyAssets = lazyWithRetries(() => import('./pages/buy-nfts/MyAssets'))
const LoansForBuyer = lazyWithRetries(() => import('./pages/buy-nfts/Loans'))

// nft detail
const NftAssetDetail = lazyWithRetries(
  () => import('./pages/buy-nfts/NftAssetDetail'),
)

// nft detail
const H5Demo = lazyWithRetries(() => import('./pages/h5-demo/H5Demo'))
const NotFound = lazyWithRetries(() => import('./pages/404'))

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate replace to='/lending/my-pools' />} />
        <Route
          path='lending'
          element={<Navigate replace to='/lending/my-pools' />}
        />
        {/* <Route
          path='lending/pools'
          element={
            <Suspense fallback={<Fallback />}>
              <Lend />
            </Suspense>
          }
        /> */}
        <Route
          path='lending/my-pools/create'
          element={
            <Suspense fallback={<Fallback />}>
              <PoolCreate />
            </Suspense>
          }
        />
        {/* <Route
          path='lending/pools/edit/:collectionId?'
          element={
            <Suspense fallback={<Fallback />}>
              <PoolEdit />
            </Suspense>
          }
        /> */}
        <Route
          path='lending/my-pools'
          element={
            <Suspense fallback={<Fallback />}>
              <Lend />
            </Suspense>
          }
        />

        <Route
          path='lending/loans'
          element={
            <Suspense fallback={<Fallback />}>
              <Lend />
            </Suspense>
          }
        />

        {/* buy nfts */}
        <Route
          path='buy-nfts'
          element={<Navigate replace to='/buy-nfts/market' />}
        />
        <Route
          path='/buy-nfts/market'
          element={
            <Suspense fallback={<Fallback />}>
              <Market />
            </Suspense>
          }
        />

        {/* asset */}
        <Route
          path='/asset/detail'
          // path='/asset/:asset_contract_address'
          element={
            <Suspense fallback={<Fallback />}>
              <NftAssetDetail />
            </Suspense>
          }
        />
        <Route
          path='/buy-nfts/my-assets'
          element={
            <Suspense fallback={<Fallback />}>
              <MyAssets />
            </Suspense>
          }
        />
        <Route
          path='/buy-nfts/loans'
          element={
            <Suspense fallback={<Fallback />}>
              <LoansForBuyer />
            </Suspense>
          }
        />

        {/* <Route path='lending'>
          <Route
            path='pools'
            element={
              <React.Suspense fallback={<Fallback />}>
                <Lend />
              </React.Suspense>
            }
          />
          <Route
            path='my-pools'
            element={
              <React.Suspense fallback={<Fallback />}>
                <Lend />
              </React.Suspense>
            }
          />
          <Route
            path='loans'
            element={
              <React.Suspense fallback={<Fallback />}>
                <Lend />
              </React.Suspense>
            }
          />
        </Route> */}
        <Route
          path='/demo'
          element={
            <Suspense fallback={<Fallback />}>
              <H5Demo />
            </Suspense>
          }
        />

        <Route
          element={
            <Suspense fallback={<Fallback />}>
              <NotFound />
            </Suspense>
          }
          path='*'
        />
      </Routes>
    </>
  )
}

export default App
