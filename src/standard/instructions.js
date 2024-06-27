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

export const instructions = (options, meta) => {

  const hints = {
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
    hqStaffLength: options.hqStaffLength || 100
  }

  // Implicitly true if not explicitly false:
  hints.outline =
    options.outline === false
      ? false
      : hints.outlineWidth > 0 &&  hints.outlineColor

  hints.infoOutline =
    options.infoOutline === false
      ? false
      : hints.infoOutlineWidth > 0 &&  hints.infoOutlineColor

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

  // Only include icon if special c2 headquarters (AA) is NOT provided.
  // SKKM is a special case with icons only.
  const dropIcon = !meta.skkm && hints.infoFields && hints.modifiers.AA

  const debugRectangle = bbox => [bbox, [{
    type: 'rect',
    ...BBox.xywh(bbox),
    ...context['style:debug']
  }]]

  const [bbox, children] = Layout.compose(
    (context.frame && context.dimension !== 'CONTROL') && Frame.frame(context),
    (context.frame && (!context.present || context.pending)) && Frame.overlay(context),
    (context.frame && context.outline) && Frame.outline(context),
    !dropIcon && icon(context),
    Layout.overlay(
      Layout.compose(
        context.frame && Frame.context(context),
        Layout.overlay(
          context.infoFields && fields(context),
          context.condition && Condition.condition(context)
        )
      ),
      Layout.compose(
        Layout.overlay(
          context.installation && Installation.installation(context),
          context.echelon && Echelon.echelon(context),
          (context.echelon && context.outline) && Echelon.outline(context),
          context.taskForce && Modifiers.taskForce(context),
          context.feintDummy && Modifiers.feintDummy(context),

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
          context.mobility && Mobility.mobility(context),
        ),
        context.modifiers.AO && Engagement.engagement(context),
      )
    ),

    // Last but not least, add padding:
    bbox => [BBox.resize([padding, padding], bbox), []]
  )(BBox.NULL)

  const scale = x => x * hints.size / 100
  const extent = BBox.extent(bbox)
  const [width, height] = extent.map(scale)
  const size = { width, height }

  const anchor = {
    x: (center.x - bbox[0]) * hints.size / 100,
    y: (center.y - bbox[1]) * hints.size / 100
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
    toDataURL: () => 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
  }
}
