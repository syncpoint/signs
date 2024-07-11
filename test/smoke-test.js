import fs from 'fs'
import assert from 'assert'
import xmlFormat from 'xml-formatter'
import { Symbol } from '../src/index.js'

// Cover as much code as possible with only a few configutions.
const fixtures = [
  {
    sidc: 'SFGCUCIZ--DH', // 89.08% Statements 1331/1494
    modifiers: {
      AO: 'A:BBB-CC', F: '+/-',     G: 'beer@1600', M: 'B',
      Q: '120',       T: 'TANGO-1', W: 'O/O',       Z: '25 km/h'
    }
  },
  { sidc: 'EFOPBI----H----' }, // 90.82% Statements 1357/1494
  { sidc: 'SFGPES----MO---' }, // 91.43% Statements 1366/1494
  { sidc: '30031007181211020000' }, // 94.84% Statements 1417/1494
  // invalid symbol
  { sidc: 'MUZP------' }, // 95.44% Statements 1425/1493
  {
    sidc: 'SDACMFQR----',
    modifiers: {
      Q: 280, T: 'ALPHA-1', W: 'DTG', G: 'CMT', F: '+/-' }
  } // 96.04% 1432/1491
]



const snapshot = 'current'
describe('generate snapshot', function () {
  fixtures.forEach(options => {
    it(options.sidc, function () {
      const svg = xmlFormat(Symbol.of(options).asSVG())
      fs.writeFileSync(`./snapshots/${snapshot}/${options.sidc}.svg`, svg)
    })
  })
})

describe.only('verify snapshot', function () {
  fixtures.forEach(options => {
    it(options.sidc, function () {
      const actual = xmlFormat(Symbol.of(options).asSVG())
      const expected = fs.readFileSync(`./snapshots/${snapshot}/${options.sidc}.svg`, 'utf8')
      assert.strictEqual(actual, expected)
    })
  })
})
