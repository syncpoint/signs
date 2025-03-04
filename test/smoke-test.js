import fs from 'fs'
import assert from 'assert'
import xmlFormat from 'xml-formatter'
import { Symbol } from '../src/index.js'

const snapshot = 'current'
const filename = options =>
    `./snapshots/${snapshot}/${options.id}#${options.sidc}.svg`

describe.skip('generate snapshot', function () {
  Symbol.data().forEach((options, i) => {
    it(`${options.id} [${options.sidc}]`, function () {
      const svg = xmlFormat(Symbol.of(options).asSVG())
      fs.writeFileSync(filename(options), svg)
    })
  })
})

describe('verify snapshot', function () {
  Symbol.data().forEach((options, i) => {
    it(`${options.id} [${options.sidc}]`, function () {
      const actual = xmlFormat(Symbol.of(options).asSVG())
      const expected = fs.readFileSync(filename(options), 'utf8')
      assert.strictEqual(actual, expected)
    })
  })
})
