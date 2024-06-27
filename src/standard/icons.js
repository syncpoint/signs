import regular from './icon-data.json' assert { type: "json" }
import index from './icon-index.json' assert { type: "json" }
import special from './icons-special.json' assert { type: "json" }
import skkm from './icons-skkm.json' assert { type: "json" }
import * as BBox from '../bbox.js'

const undefinedIcon = [{
  type: 'path',
  stroke: 'black',
  fill: 'black',
  d: 'm 94.8206,78.1372 c -0.4542,6.8983 0.6532,14.323 5.3424,19.6985 4.509,5.6933 11.309,9.3573 14.98,15.7283 3.164,6.353 -0.09,14.245 -5.903,17.822 -7.268,4.817 -18.6219,2.785 -22.7328,-5.249 -1.5511,-2.796 -2.3828,-5.931 -2.8815,-9.071 -3.5048,0.416 -7.0093,0.835 -10.5142,1.252 0.8239,8.555 5.2263,17.287 13.2544,21.111 7.8232,3.736 17.1891,3.783 25.3291,1.052 8.846,-3.103 15.737,-11.958 15.171,-21.537 0.05,-6.951 -4.272,-12.85 -9.134,-17.403 -4.526,-4.6949 -11.048,-8.3862 -12.401,-15.2748 -1.215,-2.3639 -0.889,-8.129 -0.889,-8.129 z m -0.6253,-20.5177 0,11.6509 11.6527,0 0,-11.6509 z'
}]

const boxes = Object.entries(({ ...regular, ...skkm })).reduce((acc, [key, icon]) => {
  acc[key] = icon.length ? BBox.of(icon) : [100, 100, 100, 100]
  return acc
}, {})


const lookupInstructions = options => {
  if (options.invalid) return undefinedIcon
  else if (special[options.generic]) return special[options.generic]
  else if (skkm[options.generic]) return skkm[options.generic]
  else {
    const key = `${options.generic}+${options.standard}+${options.affiliation}`
    const hashcode = index[key]
    return regular[hashcode] || []
  }
}

const lookupBBox = options => box => {
  if (special[options.generic]) return [0, 0, 200, 200]
  else if (skkm[options.generic]) return boxes[options.generic]
  else {
    const key = `${options.generic}+${options.standard}+${options.affiliation}`
    const hashcode = index[key]
    return boxes[hashcode] || box
  }
}

const resolveStyles = options => instructions => {
  if (Array.isArray(instructions)) return instructions.map(resolveStyles(options))
  else {
    const { stroke, fill, children, ...rest } = instructions
    return children
      ? { ...rest, children: children.map(resolveStyles(options)) }
      : {
        stroke: options[stroke] || stroke,
        fill: options[fill] || fill,
        ...rest
      }
  }
}

export default options => {
  const styles = resolveStyles(options)
  const instructions = lookupInstructions(options)
  const bbox = lookupBBox(options)

  const applyOutline =
    (!!options.outlineWidth && !!options.outlineColor) &&
    (!options.frame || !!options.monoColor)

  const finalInstructions = applyOutline
    ? [
        ...styles(instructions),
        ...instructions.map(x => ({ ...x, ...options['style:icon/outline'] }))
      ]
    : styles(instructions)

  return box => [bbox(box), finalInstructions]
}
