import fs from 'fs'
import assert from 'assert'
import { Symbol } from '../src/index.js'

// Cover as much code as possible with only a few configutions.
const fixtures = [
  {
    sidc: 'SFGCUCIZ--DH', /* 89.48% Statements 1310/1464 */
    modifiers: {
      AO: 'A:BBB-CC', F: '+/-',     G: 'beer@1600', M: 'B',
      Q: '120',       T: 'TANGO-1', W: 'O/O',       Z: '25 km/h'
    }
  },
  { sidc: 'EFOPBI----H----' /* 91.25% Statements 1336/1464 */ },
  { sidc: 'SFGPES----MO---' /* 91.87% Statements 1345/1464 */ },
  { sidc: '30031007181211020000' /* 95.35% Statements 1396/1464 */ }
]

// FIXME: 30031007181211020000 - wrong symbol border color

const snapshot = 'current'
describe.skip('generate snapshot', function () {
  fixtures.forEach(options => {
    it(options.sidc, function () {
      const svg = Symbol.of(options).asSVG()
      fs.writeFileSync(`./snapshots/${snapshot}/${options.sidc}.svg`, svg)
      console.log(svg)
    })
  })
})

describe('verify snapshot', function () {
  fixtures.forEach(options => {
    it(options.sidc, function () {
      const actual = Symbol.of(options).asSVG()
      const expected = fs.readFileSync(`./snapshots/${snapshot}/${options.sidc}.svg`, 'utf8')
      assert.strictEqual(actual, expected)
    })
  })
})
