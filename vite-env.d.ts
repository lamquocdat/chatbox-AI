/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AIHUB_API: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
