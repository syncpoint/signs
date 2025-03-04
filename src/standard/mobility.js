import * as BBox from '../bbox.js'
import MOBILITY from './mobility.json' with { type: "json" }

const OFFSET = {
  TOWED: 8,
  OVER_SNOW: 13,
  HALF_TRACK: 8,
  SLED: 17,
  TOWED_ARRAY_SHORT: 8,
  TOWED_ARRAY_LONG: 8
}

// Optional vertical offset for NEUTRAL affiliation.
const offsets = Object.entries(MOBILITY).reduce((acc, [key, children]) => {
  acc[key] = {
    type: 'g',
    children,
    bbox: BBox.of(children),
    offset: OFFSET[key] || 0
  }
  return acc
}, {})

export const mobility = options => {
  const { bbox, offset, ...group } = offsets[options.mobility]

  return box => {
    const dy = options.affiliation === 'NEUTRAL' ? box[3] + offset : box[3]
    const instructions = [{ ...group, transform: `translate(0, ${dy})` }]
    if (options.outline) instructions.push({ ...group, transform: `translate(0, ${dy})`, ...options['style:outline'] })
    return [BBox.translate([0, dy], bbox), instructions]
  }
}
