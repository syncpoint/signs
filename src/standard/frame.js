import * as R from 'ramda'
import * as BBox from '../bbox.js'
import FRAME from './frame.json' with { type: "json" }
import DECORATIONS from './decorations.json' with { type: "json" }
import * as Layout from '../layout.js'
import { stacks } from './stack.js'

FRAME['SPACE+UNKNOWN'] = FRAME['AIR+UNKNOWN']
FRAME['SPACE+FRIEND'] = FRAME['AIR+FRIEND']
FRAME['SPACE+NEUTRAL'] = FRAME['AIR+NEUTRAL']
FRAME['SPACE+HOSTILE'] = FRAME['AIR+HOSTILE']
FRAME['ACTIVITY+UNKNOWN'] = FRAME['UNIT+UNKNOWN']
FRAME['ACTIVITY+FRIEND'] = FRAME['UNIT+FRIEND']
FRAME['ACTIVITY+NEUTRAL'] = FRAME['UNIT+NEUTRAL']
FRAME['ACTIVITY+HOSTILE'] = FRAME['UNIT+HOSTILE']

const frames = Object.entries(FRAME).reduce((acc, [key, frame]) => {
  const { open, ...graphics } = frame
  acc[key] = acc[key] || {}
  acc[key].open = graphics
  acc[key].closed = { ...graphics, d: graphics.d + ' z' }
  acc[key].bbox = BBox.of(graphics)
  return acc
}, {})

const translate = (frame, offset) =>
  offset[0] === 0 && offset[1] === 0
    ? frame // nothing to do; don't add unnecessary translate(0 0)
    : {
      open: { ...frame.open, transform: `translate(${offset[0]} ${offset[1]})` },
      closed: { ...frame.closed, transform: `translate( ${offset[0]} ${offset[1]})` },
      bbox: [frame.bbox[0], frame.bbox[1], frame.bbox[2] + offset[0], frame.bbox[3] + offset[1]]
    }

const instruction =
  (options, typeHint, style, offset) => {
    // Outline frame must not be closed for monochrome color:
    const type = options.monoColor ? 'open' : typeHint
    const key = `${options.dimension}+${options.affiliation}`
    const frame = translate(frames[key], offset)
    const instructions = [{ ...frame[type], ...options[style] }]
    const decoration = DECORATIONS[key]
    if (decoration) instructions.push({ ...decoration, ...options['style:frame/decoration']})
    return () => [frame.bbox, instructions]
  }

export const frame = options => {
  if (!options.frame) return bbox => [bbox, []] // TODO: set bbox to frame bbox
  else {
    const xs = stacks[options.stack].flatMap(offset => [
      options.dimension !== 'CONTROL' && instruction(options, 'open', 'style:frame/shape', offset),
      (!options.present || options.pending) && instruction(options, 'open', 'style:frame/overlay', offset),
      (options.outline) && instruction(options, 'closed', 'style:outline', offset)
    ])
    return Layout.compose(...xs)
  }
}

export const context = options => {
  const text = R.cond([
    [R.propEq(true, 'joker'), R.always('J')],
    [R.propEq(true, 'faker'), R.always('K')],
    [R.propEq('EXERCISE', 'context'), R.always('X')],
    [R.propEq('SIMULATION', 'context'), R.always('S')],
    [R.T, R.always(undefined)]
  ])(options)

  if (!text) return box => [box, []]

  const key = `${options.dimension}:${options.affiliation}`
  const spacing = key.match(/(UNKNOWN$)|(SUBSURFACE:HOSTILE)/) ? -10 : 10

  return box => {
    const instructions = []
    const instruction = { type: 'text', text, x: box[2] + spacing, y: 60, ...options['style:frame/context'] }
    const bbox = [box[0], 60 - 25, box[2] + spacing + 22, box[3]]
    instructions.push(instruction)
    if (options.outline) instructions.push({ ...instruction, ...options['style:outline'] })
    return [bbox, instructions]
  }
}
