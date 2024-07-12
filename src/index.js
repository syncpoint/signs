import { legacy, modern, fallback } from './standard/index.js'
import { AMPLIFIERS } from './amplifiers.js'
import data from './data.js'

const factories = [
  legacy,
  modern,
  fallback
]

/**
 * Translate name-based legacy modifiers to letter-based amplifiers.
 */
const translateModifers = options =>
  Object.entries(options).reduce((acc, [k, v]) => {
    if (AMPLIFIERS[k]) acc[AMPLIFIERS[k]] = v
    return acc
  }, {})

const removeModifiers = options =>
  Object.entries(options).reduce((acc, [k, v]) => {
    if (AMPLIFIERS[k]) delete acc[k]
    return acc
  }, { ...options })

// Legacy constructor.
export const Symbol = function (sidc, options) {
  return Symbol.of({
    sidc,
    modifiers: translateModifers(options),
    ...removeModifiers(options),
  })
}

Symbol.of = options => {
  const factory = factories.find(factory => factory.accept(options))
  if (!factory) return
  return factory.document(options)
}

/**
 * Selected symbol descriptors for story telling and regression testing.
 */
Symbol.data = () => data
