import fs from 'fs'
import path from 'path'

const assetsDir = 'assets'
const proFiles = fs.readdirSync(path.join(assetsDir, 'pro'))
// console.log('proFiles', proFiles)
const files = fs.readdirSync(path.join(assetsDir))

files.forEach(file => {
  const filePath = path.join(path.join(assetsDir), file)
  const stats = fs.statSync(filePath)
  const isJs = file.endsWith('.js')

  if (isJs && stats.isFile()) {
    // console.log(file) // This logs only files, not directories
    // read file content sss
    const content = fs.readFileSync(filePath, 'utf8')
    if (content.includes('./pro/pro-chunk')) {
      proFiles.forEach(proFile => {
        console.log({ filePath, proFile })
        if(content.includes(`./pro/${proFile}`)) {
          const fileRegex = new RegExp(`./pro/${proFile}`, 'g')
          const newContent = content.replace(fileRegex, `../../__pro__/${proFile}`)
          // show first 200 characters of the new content
          console.log(newContent.slice(0, 400))
          fs.writeFileSync(filePath, newContent)
        }
      })
      // content.replace('./pro/pro-chunk', './pro/pro-chunk.js')
      // console.log(content)
      // console.log({ file })
    }
  }
})

console.log('-------- renamed files --------')
files.forEach(file => {
  const filePath = path.join(path.join(assetsDir), file)
  const stats = fs.statSync(filePath)
  const isJs = file.endsWith('.js')

  if (isJs && stats.isFile()) {
    // console.log(file) // This logs only files, not directories
    // read file content
    const content = fs.readFileSync(filePath, 'utf8')
    if (content.includes('../../__pro__')) {
      // proFiles.forEach(proFile => {
      //   content.replace(`'./pro/${proFile}'`, `'../../__pro__/${proFile}'`)
      // })
      // content.replace('./pro/pro-chunk', './pro/pro-chunk.js')
      console.log({ filePath })
    }
  }
})
