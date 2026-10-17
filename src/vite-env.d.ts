/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_HOST?: string
  }
  
  interface AppRuntimeConfig {
    VITE_HOST?: string
  }
  
  interface Window {
    __APP_CONFIG__?: AppRuntimeConfig
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  