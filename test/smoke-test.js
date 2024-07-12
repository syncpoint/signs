import fs from 'fs'
import assert from 'assert'
import xmlFormat from 'xml-formatter'
import { Symbol } from '../src/index.js'

const snapshot = 'current'
describe.only('generate snapshot', function () {
  Symbol.data().forEach((options, i) => {
    it(`${options.sidc} [${i}]`, function () {
      const svg = xmlFormat(Symbol.of(options).asSVG())
      fs.writeFileSync(`./snapshots/${snapshot}/${i}-${options.sidc}.svg`, svg)
    })
  })
})

describe.only('verify snapshot', function () {
  Symbol.data().forEach((options, i) => {
    it(`${options.sidc} [${i}]`, function () {
      const actual = xmlFormat(Symbol.of(options).asSVG())
      const expected = fs.readFileSync(`./snapshots/${snapshot}/${i}-${options.sidc}.svg`, 'utf8')
      assert.strictEqual(actual, expected)
    })
  })
})
