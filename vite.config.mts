/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="vite/client" />
// import alias from '@rollup/plugin-alias'
import MillionLint from '@million/lint'
import commonjs from '@rollup/plugin-commonjs'
import react from '@vitejs/plugin-react'
// import incstr from 'incstr'
import path from 'path'
import csso from 'postcss-csso'
import { defineConfig } from 'vite'

import { createManualChunks, readAliasFromTsConfig } from './scripts/build-helpers.mjs'
import updateChunkPathsPlugin from './scripts/updateChunkPathsPlugin'

// import { viteStaticCopy } from 'vite-plugin-static-copy'

// const nextId = incstr.idGenerator()
let chunkCount = 0
function hash() {
  return Math.round(Math.random() * (999 - 1) + 1)
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  const folderName = path.basename(process.cwd())

  return {
    root: 'frontend/src',
    base: isDev ? `/wp-content/plugins/${folderName}/frontend/src/` : '',
    // base: '',
    assetsDir: 'assets',
    define: {
      SERVER_VARIABLES: 'window.bit_pi_'
    },
    plugins: [
      MillionLint.vite(),
      updateChunkPathsPlugin({
        dirReplace: [
          {
            from: '"./pro-chunks/',
            to: '"../../../bit-pi-pro/assets/'
          },
          {
            from: '"./js/pro-chunks/',
            to: '"../../bit-pi-pro/assets/'
          },
          {
            from: '"../js/pro-chunks/',
            to: '"../../../bit-pi-pro/assets/'
          },
          {
            from: '"../../js/pro-chunks/',
            to: '"../../../../bit-pi-pro/assets/'
          }
        ],
        assetsDir: 'assets',
        match: 'pro-chunks/pro-chunk',
        newDir: '../__pro-chunk__',
        scanDir: 'js/pro-chunks'
      }),
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin']
        },
        jsxRuntime: 'automatic'
      }),
      commonjs()

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
        // makeAbsoluteExternalsRelative: true,
        input: path.resolve(__dirname, 'frontend/src/main.tsx'),
        output: {
          entryFileNames: 'main-.js',
          // manualChunks: {
          //   'react-vendor': ['react', 'react-dom'],
          //   '@emotion/react': ['@emotion/react'],
          //   '@tanstack/react-query': ['@tanstack/react-query'],
          //   '@tanstack/react-query-devtools': ['@tanstack/react-query-devtools'],
          //   'react-router-dom': ['react-router-dom'],
          //   antd: ['antd']
          // },
          manualChunks: createManualChunks,
          // console.log('file', file)
          // if (fiel.includes('node_modules')) {
          //   // Handle external libraries as before
          //   if (id.includes('react') && id.includes('react-dom')) {
          //     return 'react-vendor';
          //   }

          // return
          // return {
          //   'react-vendor': ['react', 'react-dom'],
          //   '@emotion/react': ['@emotion/react'],
          //   '@tanstack/react-query': ['@tanstack/react-query'],
          //   '@tanstack/react-query-devtools': ['@tanstack/react-query-devtools'],
          //   'react-router-dom': ['react-router-dom'],
          //   antd: ['antd']
          // }
          // compact: true,
          // validate: true,
          // generatedCode: {
          // arrowFunctions: true
          // objectShorthand: true
          // },

          chunkFileNames: fInfo => {
            if (fInfo.facadeModuleId?.includes('lucide-react')) {
              return 'icons/[name]-icon.js'
            }
            return 'js/[name]-[hash].js'
          },

          assetFileNames: fInfo => {
            const pathArr = fInfo?.name?.split('/')
            const fileName = pathArr?.at(-1)

            // console.log(fInfo.name, fileName)

            if (fileName === 'main.css') {
              return 'main-.css'
            }
            if (fileName === 'logo.svg') {
              return 'logo.svg'
            }

            // eslint-disable-next-line no-plusplus
            return `bf-${hash()}-${chunkCount++}.[ext]`
          }
        }
      }
    },
    test: {
      // globals: true,
      environment: 'jsdom',
      setupFiles: './config/test.setup.ts'
      // css: true, // since parsing CSS is slow
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
