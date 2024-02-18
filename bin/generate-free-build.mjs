import { commandExistsSync, copyDir } from './build-utils.mjs'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
const isWindows = process.platform === 'win32'

const PLUGIN_SLUG = 'bit-pi'

const filesAndFolders = [
  'assets',
  'bin',
  'backend',
  `${PLUGIN_SLUG}.php`,
  'readme.txt',
  'composer.json',
  'vendor/autoload.php'
]

export async function checkAndCopyFilesAndFolders() {
  const checks = filesAndFolders.map(async item => {
    try {
      await fs.promises.access(item)
      if (fs.lstatSync(item).isDirectory()) {
        await copyDir(item, path.join(PLUGIN_SLUG, item))
      } else {
        console.log('➡️ copying file', item)
        const destination = path.join(PLUGIN_SLUG, item)
        await fs.promises.mkdir(path.dirname(destination), { recursive: true })
        await fs.promises.copyFile(item, destination)
      }
      return null
    } catch (error) {
      return `${item} not found`
    }
  })

  const results = await Promise.all(checks)
  const errors = results.filter(item => item !== null)

  if (errors.length > 0) {
    console.log(errors.join('\n'))
    return
  }
}

async function generateBuild() {
  console.log('🚀🚀🚀 Generating build...')

  if (
    !commandExistsSync('composer --version') ||
    !commandExistsSync('php --version') ||
    !commandExistsSync('zip --version')
  ) {
    return
  }

  if (isWindows) {
    console.log('⛔ Windows detected, try to run from linux, mac or wsl in windows')
    return
  }

  // check folder exists then delete it
  if (fs.existsSync(PLUGIN_SLUG)) {
    fs.rmSync(PLUGIN_SLUG, { recursive: true })
  }
  if(fs.existsSync('bit-pi.zip')) {
    fs.rmSync('bit-pi.zip')
  }

  // create folder in node js
  fs.mkdirSync(PLUGIN_SLUG)

  await checkAndCopyFilesAndFolders()

  // execute command inside bit-pi folder
  execSync('composer install --no-dev', { cwd: PLUGIN_SLUG })
  execSync('composer dump-autoload -o', { cwd: PLUGIN_SLUG })

  // remove bin folder
  fs.rmSync(`${PLUGIN_SLUG}/bin`, { recursive: true })

  // remove composer.json
  fs.rmSync(`${PLUGIN_SLUG}/composer.json`)

  // create zip file
  execSync(`zip -r ${PLUGIN_SLUG}.zip ${PLUGIN_SLUG}`)

  // remove bit-pi folder
  fs.rmSync(PLUGIN_SLUG, { recursive: true })
}

generateBuild()
