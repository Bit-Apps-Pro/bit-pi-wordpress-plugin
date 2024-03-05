import fs from 'fs'
import path from 'path'

import { copyDir, createDir, deleteDirectory } from './build-helpers.mjs'

export default function updateChunkPathsPlugin(params) {
  return {
    name: 'update-chunk-paths',
    apply: 'build',
    closeBundle() {
      replaceAndMoveFilesImports(params)
    }
  }
}

// function replaceAndMoveFilesImports({ dirToReplace, dirToReplaceWith, assetsDir, match }) {
//   const targetDirPath = path.resolve(path.join(assetsDir, dirToReplace))
//   const newDirPath = path.resolve(path.join(assetsDir, dirToReplaceWith))
//   const assetDirPath = path.resolve(assetsDir)

//   const targetedFiles = fs.readdirSync(targetDirPath)
//   const assetFiles = fs.readdirSync(assetDirPath)

//   assetFiles.forEach(assetFile => {
//     const filePath = path.resolve(path.join(assetsDir, assetFile))
//     const stats = fs.statSync(filePath)
//     const isJs = assetFile.endsWith('.js')

//     if (isJs && stats.isFile()) {
//       let content = fs.readFileSync(filePath, 'utf8')
//       if (content.includes(match)) {
//         targetedFiles.forEach(targetFile => {
//           if (content.includes(`${dirToReplace}${targetFile}`)) {
//             const fileRegex = new RegExp(`${dirToReplace}${targetFile}`, 'gmi')
//             content = content.replace(fileRegex, `${dirToReplaceWith}${targetFile}`)
//             fs.writeFileSync(filePath, content)
//           }
//         })
//       }
//     }
//   })

//   if (fs.existsSync(newDirPath)) deleteDirectory(newDirPath)

//   createDir(newDirPath)

//   copyDir(targetDirPath, newDirPath)
//   deleteDirectory(targetDirPath)
// }

// replaceAndMoveFilesImports({
//   dirReplace: [
//     {
//       from: '"./js/pro-chunks/',
//       to: '"../../__pro-chunk__/'
//     },
//     {
//       from: '"../pro-chunks/',
//       to: '"../../../__pro-chunk__/'
//     },
//     {
//       from: '"../../pro-chunks/',
//       to: '"../../../../__pro-chunk__/'
//     }
//   ],
//   assetsDir: 'assets',
//   match: './pro-chunks/pro-chunk',
//   newDir: '../../__pro-chunk__',
//   scanDir: 'js/pro-chunks'
// })

function replaceAndMoveFilesImports({ dirReplace, assetsDir, match, newDir, scanDir }) {
  const targetDirPath = path.resolve(path.join(assetsDir, scanDir))
  const newDirPath = path.resolve(newDir)

  traverseDirectoryAndReplace({ dirPath: assetsDir, match, targetDirPath, dirReplace })

  if (fs.existsSync(newDirPath)) deleteDirectory(newDirPath)

  createDir(newDirPath)

  copyDir(targetDirPath, newDirPath)
  deleteDirectory(targetDirPath)
}

function traverseDirectoryAndReplace({ dirPath, match, targetDirPath, dirReplace }) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  entries.forEach(entry => {
    const entryPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      traverseDirectoryAndReplace({
        dirPath: entryPath,
        match,
        targetDirPath,
        dirReplace
      })
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      replaceInFile({ filePath: entryPath, match, targetDirPath, dirReplace })
    }
  })
}

function replaceInFile({ filePath, match, targetDirPath, dirReplace }) {
  let content = fs.readFileSync(filePath, 'utf8')
  if (content.includes(match)) {
    const targetedFiles = fs.readdirSync(targetDirPath)
    targetedFiles.forEach(targetFile => {
      dirReplace.forEach(dir => {
        if (content.includes(`${dir.from}${targetFile}`)) {
          const fileRegex = new RegExp(`${dir.from}${targetFile}`, 'gmi')
          content = content.replace(fileRegex, `${dir.to}${targetFile}`)
          fs.writeFileSync(filePath, content)
        }
      })
    })
  }
}

// replaceAndMoveFilesImports({
//   dirToReplace: './pro/',
//   dirToReplaceWith: '../../__pro__/',
//   assetsDir: 'assets',
//   match: './pro/pro-chunk',
//   scanDir: 'js/pro'
// })

// console.log('-------- renamed files --------')
// const assetsDir = 'assets'
// const files = fs.readdirSync('assets')
// files.forEach(file => {
//   let filePath = path.join(path.join(assetsDir), file)
//   let stats = fs.statSync(filePath)
//   const isJs = file.endsWith('.js')

//   if (isJs && stats.isFile()) {
//     const content = fs.readFileSync(filePath, 'utf8')
//     if (content.includes('../../__pro__')) {
//       console.log({ filePath })
//     }
//   }
// })
