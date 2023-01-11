/// <reference types="vite/client" />
interface ImportMeta {
  readonly env: ImportMetaEnv
}
interface ImportMetaEnv {
	readonly VITE_APP_BASE_API: string
}

