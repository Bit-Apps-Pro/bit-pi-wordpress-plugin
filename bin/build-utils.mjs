import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'


export function commandExistsSync(command) {
  try {
    execSync(command)
    return true
  } catch (error) {
    console.log(`${command} not found`)
    return false
  }
}

export async function copyDir(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true })
  const entries = await fs.promises.readdir(src, { withFileTypes: true })

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    entry.isDirectory()
      ? await copyDir(srcPath, destPath)
      : await fs.promises.copyFile(srcPath, destPath)
  }
}
