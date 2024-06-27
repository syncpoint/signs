import assert from 'assert'
import { Symbol } from '../src/index.js'

describe('issues', function () {
  it('unknown SIDC', function() {
    const symbol = Symbol.of({ sidc: 'MUZP------' })
    assert(symbol)
    assert(!symbol.isValid())
  })
})
