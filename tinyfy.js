import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import tinify from 'tinify'

tinify.key = 'NSFVHSDGhpgdGlTKVp7jVyRqXq6KXnTH'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const UNFORMATTED_ASSETS_PATH = path.join(
  __dirname,
  './src/assets/uncompressed',
)
const ASSETS_PATH = path.join(__dirname, './src/assets')

// 压缩图片
const main = () => {
  fs.readdirSync(UNFORMATTED_ASSETS_PATH, { withFileTypes: true }).forEach(
    function (dirent) {
      const unformattedFilePath = path.join(
        UNFORMATTED_ASSETS_PATH,
        dirent.name,
      )
      const formattedFilePath = path.join(ASSETS_PATH, dirent.name)
      if (dirent.isFile()) {
        const { name } = dirent
        if (name.endsWith('.png')) {
          const source = tinify.fromFile(unformattedFilePath)
          source.toFile(formattedFilePath)
        }
      }
    },
  )
}
main()
