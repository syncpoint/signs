import * as R from 'ramda'
import * as BBox from '../bbox.js'
import * as Layout from '../layout.js'
import * as Styles from './styles.js'
import * as Frame from './frame.js'
import * as Installation from './installation.js'
import * as Echelon from './echelon.js'
import * as Engagement from './engagement.js'
import * as Mobility from './mobility.js'
import * as Modifiers from './modifiers.js'
import * as Condition from './condition.js'
import * as Direction from './direction.js'
import icon from './icons.js'
import fields from './fields.js'
import { deltaX } from './stack.js'

export const instructions = (options, meta) => {

  const baseHints = {
    colorMode: options.colorMode || 'light',

    fillOpacity:
      options.fillOpacity === 0
        ? 0
        : options.fillOpacity || 1
        ,

    frame: options.frame !== false && !meta.frameless,
    modifiers: options.modifiers || {},
    infoFields: options.modifiers && options.infoFields !== false,
    engagement: options?.modifiers?.AT,
    direction: Number(options?.modifiers?.Q) || undefined, // suppress/replace NaN
    strokeWidth: options.strokeWidth || 4,
    strokeColor: options.strokeColor || 'black',
    monoColor: options.monoColor,
    outlineWidth: options.outlineWidth || 0,
    outlineColor: options.outlineColor || false,
    infoColor: options.infoColor || false,
    infoOutlineColor: options.infoOutlineColor || options.outlineColor,
    infoOutlineWidth: options.infoOutlineWidth || options.outlineWidth || 0,
    size: options.size || 100, // %
    hqStaffLength: options.hqStaffLength || 100,
    stack: Math.min(Number(options.stack), 6) || 1
  }

  const drivedHints = {
    // Implicitly true if not explicitly false:
    outline:
      options.outline === false
        ? false
        : baseHints.outlineWidth > 0 &&  baseHints.outlineColor
        ,

    infoOutline:
      options.infoOutline === false
        ? false
        : baseHints.infoOutlineWidth > 0 &&  baseHints.infoOutlineColor
  }

  const hints = {
    ...baseHints,
    ...drivedHints
  }


  const context = {
    ...meta,
    ...hints,
    ...Styles.styles(meta, hints)
  }

  const padding = 2 + Math.max(
    context['style:default']['stroke-width'],
    context['style:outline']['stroke-width'],
  ) / 2

  // Center is available after HQ staff was processed:
  let center

  // Only include icon if 'special c2 headquarters' (AA) is NOT provided.
  // SKKM is a special case with icons only.
  const dropIcon = !meta.skkm && baseHints.infoFields && baseHints.modifiers.AA

  const debugRectangle = bbox => [bbox, [{
    type: 'rect',
    ...BBox.xywh(bbox),
    ...context['style:debug']
  }]]

  // Compensate for stack extending bounding box to the right,
  // which is unwanted for Feint/Dummy and Operational Condition.
  const compensate = fn => bbox => {
    const box = [...bbox]
    box[2] = box[2] - (context.stack - 1) * deltaX
    return fn(box)
  }

  const [bbox, children] = Layout.compose(
    Frame.frame(context),
    !dropIcon && icon(context),
    Layout.overlay(
      Layout.compose(
        context.frame && Frame.context(context),
        context.infoFields && fields(context),
      ),
      Layout.compose(
        context.mobility && Mobility.mobility(context),
        compensate(Condition.condition(context)),
      ),
      Layout.compose(
        Layout.overlay(
          context.installation && Installation.installation(context),
          context.echelon && Echelon.echelon(context),
          context.echelon && context.outline && Echelon.outline(context),
          context.taskForce && Modifiers.taskForce(context),
          context.feintDummy && compensate(Modifiers.feintDummy(context)),

          // Tap into intermediate bounding box to get anchor right.
          // For HQs, info fields would shift anchor horizontally, otherwise.
          context.headquarters
            ? box => {
              const [bbox, instructions] = Modifiers.headquartersStaff(context)(box)
              center = { x: bbox[0], y: bbox[3] }
              return [bbox, instructions]
            }
            : () => {
              center = { x: 100, y: 100 }
              return [BBox.NULL, []]
            }
            ,
          context.direction !== undefined && Direction.direction(context),
        ),
        context.modifiers.AO && Engagement.engagement(context)
      )
    ),

    // Last but not least, add padding:
    bbox => [BBox.resize([padding, padding], bbox), []]
  )(BBox.NULL)

  const scale = x => x * baseHints.size / 100
  const extent = BBox.extent(bbox)
  const [width, height] = extent.map(scale)
  const size = { width, height }

  const anchor = {
    x: (center.x - bbox[0]) * baseHints.size / 100,
    y: (center.y - bbox[1]) * baseHints.size / 100
  }

  // Poor man's (SVG) layers:
  // Sort top level instructions according zIndex.
  // Sort chilren of top level groups.
  // TODO: sort tree recursively
  const sorter = (a, b) => (a.zIndex || 0) - (b.zIndex || 0)
  children.sort(sorter)
  children.filter(R.propEq('g', 'type')).map(x => x.children.sort(sorter))

  const document = {
    type: 'svg',
    xmlns: 'http://www.w3.org/2000/svg',
    version: '1.2',
    baseProfile: 'tiny',
    width,
    height,
    viewBox: [bbox[0], bbox[1], ...extent],
    children,
    ...context['style:default']
  }

  const array = x => x ? Array.isArray(x) ? x : [x] : []

  // TODO: move to milsymbol/genicon.js
  const escape = s => s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  const xml = document => {
    const { type, children, zIndex, ...properties } = document
    const propertyList = Object.entries(properties).map(([key, value]) => {
      if (key === 'text') return ''
      const type = typeof value
      if (type === 'string') return `${key}="${value}"`
      else if (type === 'number') return `${key}="${value}"`
      else if (Array.isArray(value)) return `${key}="${value.join(' ')}"`
      else return ''
    }).join(' ')

    const childList = type !== 'text'
      ? (array(children)).map(child => xml(child)).join('')
      : escape(properties.text)

    return `<${type} ${propertyList}>${childList}</${type}>`
  }

  const svg = xml(document)

  return {
    getSize: () => size,
    getAnchor: () => anchor,
    asSVG: () => svg,
    toDataURL: () => 'data:image/svg+xml;utf8,' + encodeURIComponent(svg),
    isValid: () => meta.isValid
  }
}
