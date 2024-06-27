import * as BBox from '../bbox.js'
import { DEG2RAD, rotate, translate, matrix } from '../transform.js'

export const direction = options => {
  const paths = d => {
    const paths = [{ type: "path", d, ...options['style:direction'] }]
    if (options.outline) paths.push({ type: "path", d, ...options['style:outline'] })
    return paths
  }

  return box => {
    const children = paths('M0,0 l0,-75 -5,3 5,-15 5,15 -5,-3')

    const [dx, dy] = options.ground
      ? options.headquarters
        ? [box[0], box[3] + 100]
        : [100, box[3] + 100]
      : [100, 100]

    const transform = matrix(
      translate(
        rotate(options.direction * DEG2RAD),
        dx,
        dy
      )
    )

    const instructions = [{
      type: 'g',
      transform,
      children
    }]

    if (options.ground && !options.headquarters) {
      instructions.push(...paths(`M 100,${box[3]} l0,100`))
    }

    return [BBox.of(instructions), instructions]
  }
}
