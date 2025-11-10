/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'markdown-it-attrs' {
  import type MarkdownIt from 'markdown-it'
  const markdownItAttrs: MarkdownIt.PluginSimple
  export default markdownItAttrs
}

interface ImportMetaEnv {
  readonly VITE_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
