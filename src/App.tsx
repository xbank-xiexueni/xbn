import { lazy, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'

// Lend
const Lend = lazy(() => import('./pages/Lend/Lend'))
const PoolCreate = lazy(() => import('./pages/Lend/Create'))
const PoolEdit = lazy(() => import('./pages/Lend/Edit'))

// buy nfts
const Market = lazy(() => import('./pages/buy-nfts/Market'))
const MyAssets = lazy(() => import('./pages/buy-nfts/MyAssets'))

// nft detail
const NftAssetDetail = lazy(() => import('./pages/nft-asset/NftAssetDetail'))

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate replace to='/lend/pools' />} />
        <Route path='lend' element={<Navigate replace to='/lend/pools' />} />
        <Route
          path='lend/pools'
          element={
            <Suspense fallback={<>...</>}>
              <Lend />
            </Suspense>
          }
        />
        <Route
          path='lend/pools/create'
          element={
            <Suspense fallback={<>...</>}>
              <PoolCreate />
            </Suspense>
          }
        />
        <Route
          path='lend/pools/edit/:collectionId?'
          element={
            <Suspense fallback={<>...</>}>
              <PoolEdit />
            </Suspense>
          }
        />
        <Route
          path='lend/my-pools'
          element={
            <Suspense fallback={<>...</>}>
              <Lend />
            </Suspense>
          }
        />

        <Route
          path='lend/loans'
          element={
            <Suspense fallback={<>...</>}>
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
            <Suspense fallback={<>...</>}>
              <Market />
            </Suspense>
          }
        />

        {/* asset */}
        <Route
          path='/asset/:id'
          element={
            <Suspense fallback={<>...</>}>
              <NftAssetDetail />
            </Suspense>
          }
        />
        <Route
          path='/buy-nfts/my-assets'
          element={
            <Suspense fallback={<>...</>}>
              <MyAssets />
            </Suspense>
          }
        />

        {/* <Route path='lend'>
          <Route
            path='pools'
            element={
              <React.Suspense fallback={<>...</>}>
                <Lend />
              </React.Suspense>
            }
          />
          <Route
            path='my-pools'
            element={
              <React.Suspense fallback={<>...</>}>
                <Lend />
              </React.Suspense>
            }
          />
          <Route
            path='loans'
            element={
              <React.Suspense fallback={<>...</>}>
                <Lend />
              </React.Suspense>
            }
          />
        </Route> */}
      </Routes>
    </>
  )
}

export default App
