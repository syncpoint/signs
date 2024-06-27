import * as BBox from '../bbox.js'

export const condition = options => {
  return box => {
    const [width] = BBox.extent(box)
    const y = box[3] + 5
    const instruction = {
      type: 'path',
      d: `M${box[0]},${y} l${width},0 0,25 -${width},0 z`,
      ...options['style:condition']
    }

    const bbox = BBox.merge(box, BBox.of(instruction))
    return [bbox, [instruction]]
  }
}
