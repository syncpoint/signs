import { legacy, modern } from './standard/index.js'
import { AMPLIFIERS } from './amplifiers.js'

const factories = [
  legacy,
  modern
]

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
