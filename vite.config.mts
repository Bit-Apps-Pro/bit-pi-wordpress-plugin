/// <reference types="vite/client" />
import commonjs from '@rollup/plugin-commonjs'
import react from '@vitejs/plugin-react'
// import incstr from 'incstr'
import path from 'path'
import csso from 'postcss-csso'
import { Alias, defineConfig, normalizePath } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

import * as tsconfig from './tsconfig.json'

// const nextId = incstr.idGenerator()
let chunkCount = 0
function hash() {
  return Math.round(Math.random() * (999 - 1) + 1)
}

function readAliasFromTsConfig(): Alias[] {
  // eslint-disable-next-line prefer-regex-literals
  const pathReplaceRegex = new RegExp(/\/\*$/, '')
  return Object.entries(tsconfig.compilerOptions.paths).reduce((aliases, [fromPaths, toPaths]) => {
    const find = fromPaths.replace(pathReplaceRegex, '')
    // @ts-ignore
    const toPath = toPaths[0].replace(pathReplaceRegex, '')
    const replacement = path.resolve(__dirname, toPath)
    aliases.push({ find, replacement })
    return aliases
  }, [] as Alias[])
}

// @ts-ignore
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  const folderName = path.basename(process.cwd())

  return {
    root: 'frontend/src',
    base: isDev ? `/wp-content/plugins/${folderName}/frontend/src/` : '',
    // base: '',
    assetsDir: 'assets',
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin']
        },
        jsxRuntime: 'automatic'
        // @ts-ignore
        // fastRefresh: true,
      }),
      commonjs(),
      // babel()
      // TODO: PWA not working
      // for PWA resources genarate icon from this link https://realfavicongenerator.net/ and FULL DOCS https://vite-plugin-pwa.netlify.app/
      // VitePWA({
      //   ...PwaConfig(),
      // }),
      // css: {
      //   preprocessorOptions: {
      //     modules:{

      //     }
      //   }
      // }
      !isDev && (
        viteStaticCopy({
          // structured: true,
          targets: [
            {
              src: normalizePath(path.resolve(__dirname, 'frontend/src/main.tsx')),
              dest: 'src'
            },
            {
              src: normalizePath(path.resolve(__dirname, 'frontend/src/icons')),
              dest: 'src'
            },
            {
              src: normalizePath(path.resolve(__dirname, 'frontend/src/components/utilities')),
              dest: 'src'
            },
            {
              src: normalizePath(path.resolve(__dirname, 'frontend/src/common/hooks')),
              dest: 'src'
            }
          ]
        })
      )
    ],
    css: {
      //   modules: {
      //     // root: '.',
      //     generateScopedName: (name) => {
      //       let compressedClassName = nextId()
      //       if (Number.isInteger(Number(compressedClassName[0]))) {
      //         compressedClassName = `_${compressedClassName}`
      //       }
      //       return isProd ? compressedClassName : `${name}_${compressedClassName}`
      //     },
      //   },
      postcss: {
        plugins: [csso()]
      }
    },
    resolve: { alias: readAliasFromTsConfig() },

    build: {
      outDir: '../../assets',
      emptyOutDir: true,
      // assetsDir: './',
      rollupOptions: {
        input: path.resolve(__dirname, 'frontend/src/main.tsx'),
        output: {
          entryFileNames: 'main.js',
          entryFileNames: 'main-.js',
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            '@emotion/react': ['@emotion/react'],
            '@tanstack/react-query': ['@tanstack/react-query'],
            '@tanstack/react-query-devtools': ['@tanstack/react-query-devtools'],
            'react-router-dom': ['react-router-dom'],
            antd: ['antd'],
            'bit-flow-pro': ['bit-flow-pro']
          },
          // compact: true,
          // validate: true,
          // generatedCode: {
          // arrowFunctions: true
          // objectShorthand: true
          // },

          chunkFileNames: () => {
            // console.log(fInfo)
            // if (fInfo.name === 'bit-flow-pro') {
            //   return path.resolve(__dirname, '../bf-pro/[name]-[hash].js')
            // }
            return '[name]-[hash].js'
          },

          assetFileNames: fInfo => {
            const pathArr = fInfo?.name?.split('/')
            const fileName = pathArr?.[pathArr.length - 1]

            // console.log(fInfo.name, fileName)

            if (fileName === 'main.css') {
              return 'main.css'
              return 'main-.css'
            }
            if (fileName === 'logo.svg') {
              return 'logo.svg'
            }

            return `bf-${hash()}-${chunkCount++}.[ext]`
          }
        }
      }
    },
    test: {
      // globals: true,
      environment: 'jsdom',
      setupFiles: './config/test.setup.ts'
      // since parsing CSS is slow
      // css: true,
    },
    server: {
      // origin: 'http://localhost:3000',
      cors: true, // required to load scripts from custom host
      strictPort: true, // strict port to match on PHP side
      port: 3000,
      hmr: { host: 'localhost' }
      // commonjsOptions: { transformMixedEsModules: true },
    }
  }
})
