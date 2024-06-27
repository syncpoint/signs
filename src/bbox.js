import * as R from 'ramda'
import pathbbox from 'svg-path-bbox'
import * as Text from './text.js'

export const resize = R.curry(([dx, dy], bbox) => [
  bbox[0] - dx,
  bbox[1] - dy,
  bbox[2] + dx,
  bbox[3] + dy
])

export const translate = R.curry(([dx, dy], bbox) => [
  bbox[0] + dx,
  bbox[1] + dy,
  bbox[2] + dx,
  bbox[3] + dy
])

export const extent = bbox => [
  bbox[2] - bbox[0],
  bbox[3] - bbox[1]
]

export const merge = (a, b) => [
  Math.min(a[0], b[0]),
  Math.min(a[1], b[1]),
  Math.max(a[2], b[2]),
  Math.max(a[3], b[3])
]

const normalize = bbox => [
  Math.min(bbox[0], bbox[2]),
  Math.min(bbox[1], bbox[3]),
  Math.max(bbox[0], bbox[2]),
  Math.max(bbox[1], bbox[3])
]

export const NULL = [
  Number.POSITIVE_INFINITY,
  Number.POSITIVE_INFINITY,
  Number.NEGATIVE_INFINITY,
  Number.NEGATIVE_INFINITY
]

export const xywh = bbox => ({
  x: bbox[0],
  y: bbox[1],
  width: bbox[2] - bbox[0],
  height: bbox[3] - bbox[1]
})

const transform = (coeff, box) => normalize([
  box[0] * coeff[0] + box[1] * coeff[2] + coeff[4],
  box[0] * coeff[1] + box[1] * coeff[3] + coeff[5],
  box[2] * coeff[0] + box[3] * coeff[2] + coeff[4],
  box[2] * coeff[1] + box[3] * coeff[3] + coeff[5]
])


const path = ({ d }) => pathbbox(d)
const circle = ({ cx, cy, r }) => [cx - r, cy - r, cx + r, cy + r]
const group = group => {
  const box = group.children.map(of).reduce(merge)
  if (!group.transform) return box
  const match = group.transform.match(/matrix\((.*)\)/)
  if (!match) return box
  const coeff = match[1].split(' ').map(Number)
  return transform(coeff, box)
}

const text = ({ x, y, text, ...rest}) => {
  const fontSize = rest['font-size'] || 40
  const textAnchor = rest['text-anchor'] || 'start'
  const factor = fontSize / 30
  const width = Text.width(text) * factor
  return textAnchor === 'start'
    ? [x, y - fontSize, x + width, y]
    : textAnchor === 'end'
      ? [x - width, y - fontSize, x, y]
      : [x - width / 2, y - fontSize, x + width / 2, y] // middle
}

export const of = R.cond([
  [R.is(Array), xs => xs.map(of).reduce(merge)],
  [R.propEq('path', 'type'), path],
  [R.propEq('circle', 'type'), circle],
  [R.propEq('text', 'type'), text],
  [R.propEq('g', 'type'), group]
])
