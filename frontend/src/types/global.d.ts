// eslint-disable-next-line import/no-extraneous-dependencies

// interface cls { [key: string]: string; }
// declare module '*.module.css' {
//   const classes: { [key: string]: string }
//   export = classes
// }

declare module 'i18nwrap'
declare module 'incstr'
declare module 'postcss-csso'
declare module '*.module.css'
declare module '*.module.scss'
declare module '*.module.sass'
declare module '*.svg'
declare module '*.png'
declare module '*.json'
declare module 'deepmerge-alt'

declare const SERVER_VARIABLES: {
  nonce: string
  rootURL: string
  assetsURL: string
  baseURL: string
  ajaxURL: string
  apiURL: {
    base: string
    separator: string
  }
  routePrefix: string
  settings: string
  dateFormat: string
  timeFormat: string
  timeZone: string
  pluginSlug: string
  proPluginVersion: string
  isPro: string
}

// export type Prettify<T> = {
//   [K in keyof T]: T[K]
//   // eslint-disable-next-line @typescript-eslint/ban-types
// } & {}
