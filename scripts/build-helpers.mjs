/* eslint-disable no-restricted-syntax */
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const dirname = path.dirname(new URL(import.meta.url).pathname).slice(1)
const tsconfig = JSON.parse(fs.readFileSync(path.resolve(dirname, '../tsconfig.json'), 'utf-8'))

export function createManualChunks(fileName) {
  const fileNameWithoutExt = fileName.split('/').at(-1).split('.').at(0)

  if (fileName.includes('node_modules')) {
    if (fileName.includes('/react-dom')) {
      return 'react-dom-vendor'
    }
    if (fileName.includes('@ant-design') || fileName.includes('antd') || fileName.includes('rc-')) {
      return 'antd'
    }
    if (fileName.includes('@tanstack/react-query')) {
      return '@tanstack/react-query'
    }
    if (fileName.includes('@tanstack/react-query-devtools')) {
      return '@tanstack/react-query-devtools'
    }
    if (fileName.includes('react-router-dom')) {
      return 'react-router-dom'
    }
    if (fileName.includes('framer-motion')) {
      return 'framer-motion'
    }
  } else if (fileName.includes('frontend-pro')) {
    return `pro-chunks/pro-chunk-${fileNameWithoutExt}`
  }
}

export function readAliasFromTsConfig() {
  const pathReplaceRegex = /\/\*$/
  return Object.entries(tsconfig.compilerOptions.paths).reduce((aliases, [fromPaths, toPaths]) => {
    const find = fromPaths.replace(pathReplaceRegex, '')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const toPath = toPaths[0].replace(pathReplaceRegex, '')
    const replacement = path.resolve(__dirname, '..', toPath)
    aliases.push({ find, replacement })
    return aliases
  }, [])
}

export function commandExistsSync(command) {
  try {
    execSync(command)
    return true
  } catch (error) {
    console.log(`${command} not found`)
    return false
  }
}

export function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

export function deleteDirectory(source) {
  const entries = fs.readdirSync(source, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(source, entry.name)

    if (entry.isDirectory()) {
      deleteDirectory(srcPath)
    } else {
      fs.unlinkSync(srcPath)
    }
  }

  fs.rmdirSync(source)
}

export function createDir(directory) {
  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
      console.log(`Directory created: ${directory}`)
    } else {
      console.log(`Directory already exists: ${directory}`)
    }
  } catch (error) {
    console.error(`Error ensuring directory exists: ${error}`)
  }
}
