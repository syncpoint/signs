import * as BBox from '../bbox.js'
import ECHELON from './echelon.json' with { type: "json" }

const echelons = Object.entries(ECHELON)
  .reduce((acc, [key, children]) => {
    acc[key] = [BBox.of(children), children]
    return acc
  }, {})

const instruction =
  style =>
    options =>
      box => {
        const [bbox, children] = echelons[options.echelon]
        const translation = BBox.translate([0, box[1]], bbox)
        const transform = `translate(0, ${box[1]})`
        const group = { type: 'g', children, ...options[style], transform }
        return [translation, group]
      }

export const echelon = instruction('style:echelon')
export const outline = instruction('style:outline')
