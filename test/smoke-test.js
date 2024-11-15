import fs from 'fs'
import assert from 'assert'
import xmlFormat from 'xml-formatter'
import { optimize } from 'svgo'
import * as R from 'ramda'
import { Symbol } from '../src/index.js'

const snapshot = 'current'

describe('generate snapshot', function () {
  Symbol.data().forEach((options, i) => {
    it(`${options.sidc} [${i}]`, function () {
      const svg = xmlFormat(Symbol.of(options).asSVG())
      fs.writeFileSync(`./snapshots/${snapshot}/${i}-${options.sidc}.svg`, svg)
    })
  })
})

describe('generate optimized', function () {
  const reductions = []
  Symbol.data().map((options, i) => {
    it(`${options.sidc} [${i}]`, function () {
      const svg = xmlFormat(Symbol.of(options).asSVG())
      const optimized = optimize(svg).data
      fs.writeFileSync(`./snapshots/optimized/${i}-${options.sidc}.svg`, optimized)
      const reduction = Math.round(100 * (svg.length - optimized.length) / svg.length) // [%]
      reductions.push(reduction)
      console.log(Math.min(...reductions), Math.max(...reductions))
    })
  })
})

describe('500 passes', function () {
  R.range(0, 500).forEach(() => {
    Symbol.data().map((options, i) => {
      it(`${options.sidc} [${i}]`, function () {
        // Optimization roughly doubles time for symbol creation:
        // Symbol.of() => 100%
        // optimize()  => 100%
        // total       => 200%
        const svg = xmlFormat(Symbol.of(options).asSVG())
        const optimized = optimize(svg).data
        assert(optimized)
      })
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
