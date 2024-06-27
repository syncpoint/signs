import * as BBox from '../bbox.js'

export const taskForce = options => {
  const widths = { CORPS: 110, ARMY: 145, ARMY_GROUP: 180, REGION: 215 }
  const width = widths[options.echelon] || 90
  const [x1, x2] = [100 - width / 2, 100 + width / 2]
  const path = { type: "path", d: `M${x1},0 L${x1},-40 ${x2},-40 ${x2},0` }

  return box => {
    const dy = box[1]
    const transform = `translate(0, ${dy})`
    const instructions = [{ type: 'g', children: [path], transform }]
    if (options.outline) instructions.push({ type: 'g', children: [path], transform, ...options['style:outline'] })
    const bbox = BBox.of(path)
    const translated = BBox.translate([0, dy], bbox)
    return [translated, instructions]
  }
}

export const feintDummy = options => {
  return box => {
    const extent = BBox.extent(box)
    const y1 = box[1] - extent[0] / 2
    const path = {
      type: "path",
      d: `M100,${y1} L${box[0]},${box[1]} M100,${y1} L${box[2]},${box[1]}`,
      'stroke-dasharray': [8, 8]
    }

    const instructions = [path]
    if (options.outline) instructions.push({ ...path, ...options['style:outline'] })
    return [BBox.of(path), instructions]
  }
}

const hqOffset = {
  'AIR:FRIEND': box => box[3],
  'AIR:NEUTRAL': box => box[3],
  'UNIT:FRIEND': box => box[3],
  'UNIT:NEUTRAL': box => box[3],
  'EQUIPMENT:NEUTRAL': box => box[3],
  'SUBSURFACE:NEUTRAL': box => box[3],
  'SUBSURFACE:FRIEND': box => box[1],
  'SPACE:FRIEND': box => box[3],
}

export const headquartersStaff = options => {
  return box => {
    const offset = hqOffset[`${options.dimension}:${options.affiliation}`] || (() => 100)
    const y = offset(box)
    const { hqStaffLength } = options
    const path = { type: "path", d: `M${box[0]},${y} L${box[0]},${box[3] + hqStaffLength}` }
    const instructions = [path]
    if (options.outline) instructions.push({ ...path, ...options['style:outline'] })
    return [BBox.of(path), instructions]
  }
}
