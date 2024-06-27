import { instructions } from './instructions.js'

export const accept = () => true

export const document = options => {
  return instructions(options, meta(options))
}

const meta = () => {
  const meta = { invalid: true }
  meta.present = true
  meta.affiliation = 'UNKNOWN'
  meta.dimension = 'UNIT'
  return meta
}