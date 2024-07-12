import * as BBox from '../bbox.js'

export const condition = options => {
  if (!options.condition) return box => [box, []]
  else return box => {
    const [width] = BBox.extent(box)
    const y = box[3] + 5

    const styles =
      options.outline
        ? ['style:condition', 'style:outline']
        : ['style:condition']

    const instructions = styles.map(style => ({
      type: 'path',
      d: `M${box[0]},${y} l${width},0 0,25 -${width},0 z`,
      ...options[style]
    }))

    const bbox = BBox.merge(box, BBox.of(instructions))
    return [bbox, instructions]
  }
}
