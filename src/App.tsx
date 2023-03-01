import { lazy, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'

import { Fallback } from '@/components'

// Lend
const Lend = lazy(() => import('./pages/Lend/Lend'))
const PoolCreate = lazy(() => import('./pages/Lend/Create'))
// const PoolEdit = lazy(() => import('./pages/Lend/Edit'))

// buy nfts
const Market = lazy(() => import('./pages/buy-nfts/Market'))
const MyAssets = lazy(() => import('./pages/buy-nfts/MyAssets'))
const LoansForBuyer = lazy(() => import('./pages/buy-nfts/Loans'))

// nft detail
const NftAssetDetail = lazy(() => import('./pages/buy-nfts/NftAssetDetail'))

const NotFound = lazy(() => import('./pages/404'))

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
