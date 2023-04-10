import request from '@/utils/request'

import type { AxiosResponse } from 'axios'

export const apiGetAssetsByCollection: (query: {
  asset_contract_address?: string
}) => Promise<AxiosResponse<AssetListItemType[]>> = async (params) => {
  return await request.get(`/lending/api/v1/nft/assets`, {
    params,
  })
}

export const apiGetAssetDetail: (query: {
  asset_contract_address?: string
}) => Promise<AxiosResponse<any>> = async (params) => {
  return await request.get(`/lending/api/v1/nft/assets`, {
    params,
  })
}

export const apiPostLoanOrder: (
  data: LoanOrderDataType,
) => Promise<AxiosResponse<any>> = async (data) => {
  return await request.post(`/lending/api/v1/loan-order`, data)
}

export const apiGetMyAssets: (query: {
  wallet_address?: string
}) => Promise<AxiosResponse<MyAssetListItemType[]>> = async (params) => {
  return await request.get(`/lending/api/v1/assets/nfts`, {
    params,
  })
}

export const apiGetNftDetail: (variables: {
  assetContractAddress: string
  assetTokenId: string
}) => Promise<AxiosResponse<any>> = async (variables) => {
  return await request.post(`/lending/query`, {
    operationName: 'AssetWithoutId',
    variables,
    query:
      'query AssetWithoutId($assetContractAddress: String, $assetTokenId: String) {\n  asset(assetContractAddress: $assetContractAddress, assetTokenID: $assetTokenId) {\n    id\n    createdAt\n    updatedAt\n    assetContractAddress\n    tokenID\n    imageUrl\n    imagePreviewUrl\n    imageThumbnailUrl\n    imageOriginalUrl\n    animationUrl\n    animationOriginalUrl\n    backgroundColor\n    name\n    description\n    externalLink\n    creator\n    owner\n    transferFee\n    transferFeePaymentToken\n    orderChain\n    orderCoin\n    orderPrice\n    rarity\n    rarityRank\n    rarityLevel\n    chain\n    nftAssetContract {\n      id\n      createdAt\n      updatedAt\n      address\n      assetContractType\n      createdDate\n      name\n      nftVersion\n      openseaVersion\n      schemaName\n      symbol\n      totalSupply\n      description\n      externalLink\n      imageUrl\n      openseaBuyerFeeBasisPoints\n      openseaSellerFeeBasisPoints\n      buyerFeeBasisPoints\n      sellerFeeBasisPoints\n      payoutAddress\n      __typename\n    }\n    nftAssetMetaData {\n      like\n      likeCount\n      __typename\n    }\n    __typename\n  }\n}',
  })
}
export const apiTest: (id: string) => Promise<AxiosResponse<any>> = async (
  variables,
) => {
  return await request.post(
    `https://www.fastmock.site/mock/9b1763038152f49675038983b826d34e/api/asset/${variables}`,
  )
}

export const apiGetXCurrency: () => Promise<
  AxiosResponse<{
    resources: {
      resource: {
        fields: {
          name: string
          price: number
        }
      }
    }[]
  }>
> = async () => {
  return await request.get('/api/ver2/exchange/xcurrency/latest', {
    headers: {
      appkey: 'FAceBe8acE1A11e990a19F43a0Dae3f5',
    },
  })
}
