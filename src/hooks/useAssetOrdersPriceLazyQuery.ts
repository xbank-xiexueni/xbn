import { gql } from '@apollo/client'
import { useLazyQuery } from '@apollo/client/react/hooks/useLazyQuery'

import type { LazyQueryHookOptions } from '@apollo/client/react/types/types'

const defaultOptions = {} as const
export type AssetOrdersPriceQuery = {
  __typename?: 'Query'
  assetOrders: {
    __typename?: 'NFTAssetOrderConnection'
    edges?:
      | ({
          __typename?: 'NFTAssetOrderEdge'
          node?: {
            __typename?: 'NFTOrder'
            assetContractAddress: string
            updatedAt: any
            price: any
            tokenId: string
            orderType: string
            nftPaymentToken: {
              __typename?: 'NFTPaymentToken'
              decimals: number
            }
          } | null
        } | null)[]
      | null
  }
}
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Cursor: any
  Decimal: any
  Time: any
}
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K]
}

export type AssetOrdersPriceQueryVariables = Exact<{
  assetContractAddress?: InputMaybe<Scalars['String']>
  assetTokenId?: InputMaybe<Scalars['String']>
  withUpdate?: InputMaybe<Scalars['Boolean']>
}>
export const AssetOrdersPriceDocument = gql`
  query AssetOrdersPrice(
    $assetContractAddress: String
    $assetTokenId: String
    $withUpdate: Boolean
  ) {
    assetOrders(
      assetContractAddress: $assetContractAddress
      assetTokenID: $assetTokenId
      withUpdate: $withUpdate
    ) {
      edges {
        node {
          assetContractAddress
          updatedAt
          price
          tokenId
          orderType
          nftPaymentToken {
            decimals
          }
        }
      }
    }
  }
`

function useAssetOrdersPriceLazyQuery(
  baseOptions?: LazyQueryHookOptions<
    AssetOrdersPriceQuery,
    AssetOrdersPriceQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return useLazyQuery<AssetOrdersPriceQuery, AssetOrdersPriceQueryVariables>(
    AssetOrdersPriceDocument,
    options,
  )
}

export default useAssetOrdersPriceLazyQuery
