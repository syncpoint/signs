import * as R from 'ramda'
import * as BBox from '../bbox.js'
import FRAME from './frame.json' assert { type: "json" }
import DECORATIONS from './decorations.json' assert { type: "json" }
import * as Layout from '../layout.js'

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

const instruction =
  (options, typeHint, style) => {
    // Outline frame must not be closed for monochrome color:
    const type = options.monoColor ? 'open' : typeHint
    const key = `${options.dimension}+${options.affiliation}`
    const frame = frames[key]
    const instructions = [{ ...frame[type], ...options[style] }]
    const decoration = DECORATIONS[key]
    if (decoration) instructions.push({ ...decoration, ...options['style:frame/decoration']})
    return () => [frame.bbox, instructions]
  }

export const frame = options => {
  if (!options.frame) return bbox => [bbox, []] // TODO: set bbox to frame bbox
  else return Layout.compose(
    options.dimension !== 'CONTROL' && instruction(options, 'open', 'style:frame/shape'),
    (!options.present || options.pending) && instruction(options, 'open', 'style:frame/overlay'),
    (options.outline) && instruction(options, 'closed', 'style:outline')
  )
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
