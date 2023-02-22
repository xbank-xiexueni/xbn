/// <reference types="vite/client" />
interface Window {
  // ethereum?: any
  ethereum: any
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly CURRENT_ENV: string
  readonly VITE_XBANK_CONTRACT_ADDRESS: string
  readonly VITE_WETH_CONTRACT_ADDRESS: string
  readonly VITE_BASE_URL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
