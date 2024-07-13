import path from 'path'
import { defineConfig } from 'vite'

const entry = path.resolve(__dirname, 'src/index.js')
const name = 'signs'
const fileName = format =>
  format === 'umd'
    ? `${name}.umd.cjs`
    : `${name}.es.js`

const lib = { entry, name, fileName }
const build = { lib, sourcemap: true }

export default defineConfig({ build })
