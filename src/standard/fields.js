import * as BBox from '../bbox.js'
import * as Text from '../text.js'

// Currently all templates have exactly five slots to the left and/or to the right.
import templates from './templates.json' assert { type: "json" }
import fields from './fields.json' assert { type: "json" }


const fromTemplate = (template, options) => box => {
  const gap = 16
  const [, height] = BBox.extent(box)

  const boxes = {
    top: extent => {
      const left = 100 - extent[0] / 2
      const right = left + extent[0]
      const top = box[1] - extent[1]
      const bottom = top + extent[1]
      return [left, top, right, bottom]
    },
    bottom: extent => {
      const left = 100 - extent[0] / 2
      const right = left + extent[0]
      const top = box[3] + gap / 2
      const bottom = top + extent[1] - gap / 2
      return [left, top, right, bottom]
    },
    center: extent => {
      const left = 100 - extent[0] / 2
      const right = left + extent[0]
      const top = 100 - extent[1] / 2.5
      const bottom = top + extent[1]
      return [left, top, right, bottom]
    },
    left: extent => {
      const right = box[0] - gap
      const left = right - extent[0]
      const top = box[1] + (height - extent[1]) / 2 + gap
      const bottom = top + extent[1]
      return [left, top, right, bottom]
    },
    right: extent => {
      const right = box[2] + gap
      const left = right + extent[0]
      const top = box[1] + (height - extent[1]) / 2 + gap
      const bottom = top + extent[1]
      return [right, top, left, bottom]
    }
  }

  const makeText = (x, y, text) => ({
    type: 'text', x, y, text
  })

  const makeGroup = (box, children, style) => ({
    type: 'g',
    children,
    transform: `translate(${box[0]},${box[1]})`,
    ...style
  })

  const line = slots => slots.map(key => options.modifiers[key]).filter(Boolean).join('/')
  const [bbox, instructions] = Object
    .entries(template)
    .reduce((acc, [placement, slots]) => {
      const lines = slots.map(line)

      // No lines -> nothing to do.
      if (lines.filter(Boolean).length === 0) return acc

      const style = `style:text-amplifiers/${placement}`
      const fontSize = options[style]['font-size']
      const extent = Text.extent(lines, fontSize)
      // TODO: left/right placement: trim empty leading/trailing slots
      // TODO: left/right placement: vertical align center slot @ 100
      const box = boxes[placement](extent)

      const dy = extent[1] / lines.length
      const x = placement === 'right'
        ? 0
        : ['top', 'bottom', 'center'].includes(placement)
          ? extent[0] / 2
          : extent[0]
      const text = (line, index) => makeText(x, fontSize + index * dy, line)
      const children = lines.map(text)
      acc[1].push(makeGroup(box, children, options[style] ))
      if (options.infoOutline) acc[1].push(makeGroup(box, children, { ...options[style], ...options['style:text-amplifiers/outline'] }))
      return [BBox.merge(acc[0], box), acc[1]]
    }, [BBox.NULL, []])

  return [bbox, instructions]
}

const fromFields = (fields, options) => box => {
  const stuff = Object.entries(options.modifiers).reduce((acc, [key, value]) => {
    if (!fields[key]) return acc
    if (Array.isArray(fields[key])) {
      fields[key].forEach(field => acc.push({ ...field, text: value }))
    } else acc.push({ ...fields[key], text: value })
    return acc
  }, [])

  return stuff.reduce(([box, instructions], instruction) => {
    instructions.push(instruction)
    const bbox = BBox.of(instruction)
    return [BBox.merge(box, bbox), instructions]
  }, [box, []])
}

/* eslint-disable import/no-anonymous-default-export */
export default options => {
  if (fields[options.generic]) return fromFields(fields[options.generic], options)
  const template = templates[`${options.type}+${options.dimension}`]
  if (!template) return box => [box, []]

  return fromTemplate(template, options)
}
