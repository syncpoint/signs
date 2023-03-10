import * as R from 'ramda'

const MODE = { dark: 0, medium: 1, light: 2 }

const OFF_WHITE = 'rgb(239,239,239)'

const COLORS = {
  ENGAGEMENT: {
    TARGET: 'rgb(255, 0, 0)',
    'NON-TARGET': 'rgb(255, 255, 255)',
    EXPIRED: 'rgb(255, 120, 0)'
  },
  frameColor: {
    civilian: 'rgb(255,0,255)',
    friend: 'rgb(0, 255, 255)',
    hostile: 'rgb(255, 0, 0)',
    neutral: 'rgb(0, 255, 0)',
    unknown: 'rgb(255, 255, 0)'
  },
  condition: {
    FULLY_CAPABLE: 'rgb(0,255,0)',
    DAMAGED: 'rgb(255,255,0)',
    DESTROYED: 'rgb(255,0,0)',
    FULL_TO_CAPACITY: 'rgb(0, 180, 240)'
  }
}

const FRAME_FILL = {
  civilian: ['rgb(80,0,80)', 'rgb(128,0,128)', 'rgb(255,161,255)'],
  unknown: ['rgb(225,220,0)', 'rgb(255,255,0)', 'rgb(255,255,128)'],
  friend: ['rgb(0,107,140)', 'rgb(0,168,220)', 'rgb(128,224,255)'],
  neutral: ['rgb(0,160,0)', 'rgb(0,226,110)', 'rgb(170,255,170)'],
  hostile: ['rgb(200,0,0)', 'rgb(255,48,49)', 'rgb(255,128,128)']
}

export const styles = function (meta, hints) {
  const colorMode = (hints.colorMode || 'light').toLowerCase()
  const scheme = MODE[colorMode] || 0
  const isCivilian = () => meta.civilian && meta.affiliation !== 'HOSTILE'
  const isJoker = () => meta.joker || meta.faker

  const key = R.cond([
    [isCivilian, R.always('civilian')],
    [isJoker, R.always('hostile')],
    [R.T, R.always(meta.affiliation.toLowerCase())]
  ])()

  const styles = {}

  // prepare all colors:
  styles['color:default/stroke'] = hints.monoColor || hints.strokeColor
  styles['color:default/fill'] = 'none'
  styles['color:debug/stroke'] = 'red'
  styles[`color:frame/fill/unknown`] = FRAME_FILL['unknown'][scheme]
  styles[`color:frame/fill/civilian`] = FRAME_FILL['civilian'][scheme]
  styles[`color:frame/fill/friend`] = FRAME_FILL['friend'][scheme]
  styles[`color:frame/fill/neutral`] = FRAME_FILL['neutral'][scheme]
  styles[`color:frame/fill/hostile`] = FRAME_FILL['hostile'][scheme]
  styles['color:frame-overlay/stroke'] = OFF_WHITE
  styles['color:frame-decoration/stroke'] = 'none'
  styles['color:frame-decoration/fill'] = styles['color:default/stroke']
  styles['color:echelon/stroke'] = styles['color:default/stroke']
  styles['color:echelon/fill'] = styles['color:default/stroke']
  styles['color:condition/stroke'] = styles['color:default/stroke']
  styles['color:condition/fill'] = COLORS.condition[meta.condition] || 'none'
  styles['color:direction/stroke'] = styles['color:default/stroke']
  styles['color:direction/fill'] = styles['color:default/stroke']

  styles['color:icon/fill/008218'] = hints.monoColor ? 'none' : 'rgb(0,130,24)'
  styles['color:icon/fill/008000'] = 'rgb(0,128,0)'
  styles['color:icon/fill/ffff00'] = hints.monoColor ? 'none' : 'rgb(255,255,0)'
  styles['color:icon/fill/fff700'] = 'rgb(255,247,0)'
  styles['color:icon/fill/ff8d2a'] = 'rgb(255,141,42)'
  styles['color:icon/fill/c61021'] = 'rgb(198,16,33)'
  styles['color:icon/fill/ff0000'] = hints.monoColor || 'rgb(255,0,0)'
  styles['color:icon/fill/ad694b'] = 'rgb(173,105,75)'
  styles['color:icon/stroke/ff00ff'] = 'rgb(255,0,255)'
  styles['color:icon/stroke/ff0000'] = hints.monoColor || 'rgb(255,0,0)'

  // console.log('meta.unfilled', meta.unfilled)

  Object.entries(FRAME_FILL).forEach(([affiliation, value]) => {
    // console.log(affiliation, value)
    styles[`color:fill/${affiliation}`] =
      styles[`color:frame/fill/${affiliation}`] // SFAPW-----*****

    styles[`color:icon/${affiliation}`] = meta.unfilled
      ? COLORS.frameColor[affiliation] // SUUPWM----*****
      : styles['color:default/stroke'] // SUPPS-----*****

    // meta.frameless: false|true
    styles[`color:icon/fill/${affiliation}`] = meta.frameless
      ? FRAME_FILL[affiliation][scheme] // SUSPO-----*****
      : OFF_WHITE // SUPPT-----*****

    styles[`color:icon/white/${affiliation}`] =
      OFF_WHITE // SUSPNH----*****

    styles[`color:icon/black/${affiliation}`] =
      'black' // SUUPWMGX--*****

  })

  styles['color:frame/fill'] = (meta.unfilled || hints.monoColor) ? 'none' : styles[[`color:frame/fill/${key}`]]
  styles['color:frame/stroke'] = meta.unfilled ? (hints.monoColor || COLORS.frameColor[key]) : styles['color:default/stroke']
  styles['color:engagement/fill'] = COLORS.ENGAGEMENT[hints.engagement] || styles[[`color:frame/fill/${key}`]]

  // Numeric APP6 is considered MODERN.
  const legacy = meta.type === 'LEGACY' && meta.standard === 'APP6'

  styles['style:debug'] = {
    stroke: styles['color:debug/stroke'],
    'stroke-width': 2,
    'stroke-dasharray': [10, 10]
  }

  styles['style:default'] = {
    fill: styles['color:default/fill'],
    stroke: styles['color:default/stroke'],
    'stroke-width': hints.strokeWidth,
    'font-family': 'Arial'
  }

  styles['style:text-amplifiers/left'] = {
    'font-family': 'Arial',
    'font-size': 36,
    'text-anchor': 'end',
    'stroke-width': 0,
    fill: 'black'
  }

  styles['style:text-amplifiers/right'] = {
    'font-family': 'Arial',
    'font-size': 36,
    'text-anchor': 'start',
    'stroke-width': 0,
    fill: 'black'
  }

  styles['style:text-amplifiers/bottom'] = {}

  styles['style:outline'] = {
    stroke: hints.outlineColor,
    'stroke-width': hints.strokeWidth + hints.outlineWidth * 2,
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round',
    zIndex: -1
   }

  styles['style:frame/shape'] = {
    fill: styles['color:frame/fill'],
    stroke: styles['color:frame/stroke'],
    'stroke-width': hints.strokeWidth
  }

   styles['style:frame/overlay'] = {
    stroke: styles['color:frame-overlay/stroke'],
    'stroke-width': hints.strokeWidth,
    // pending state has precedence over planned status:
    'stroke-dasharray':
      meta.pending
        ? '4,4'
        : meta.planned
          ? '8,12'
          : 'none',
    zIndex: 1
   }

   styles['style:frame/decoration'] = {
    fill: styles['color:frame-decoration/fill'],
    stroke: styles['color:frame-decoration/stroke']
   }

   styles['style:echelon'] = {
    fill: styles['color:echelon/fill'],
    stroke: styles['color:echelon/stroke'],
    'stroke-width': hints.strokeWidth
   }

   styles['style:installation'] = styles['style:echelon']

   styles['style:engagement/text'] = {
    'text-anchor': 'middle',
    'font-size': 22,
    'font-weight': 'bold',
    'stroke-width': 4,
    stroke: 'none',
    fill: 'black'
   }

   styles['style:engagement/bar'] = {
    fill: styles['color:engagement/fill']
   }

   styles['style:frame/context'] = {
    'font-family': 'Arial',
    'font-size': 35,
    'font-weight': 'bold',
    'text-anchor': 'start',
    'stroke-width': 0,
    fill: 'black'
  }

  styles['style:icon/civilian-fill'] = legacy
    ? { stroke: 'black', 'stroke-width': 3, fill: styles[[`color:frame/fill/${key}`]] }
    : { stroke: 'black', 'stroke-width': 3, fill: OFF_WHITE }

  styles['style:condition'] = {
    fill: styles['color:condition/fill'],
    stroke: styles['color:condition/stroke'],
    'stroke-width': hints.strokeWidth,
  }

  styles['style:direction'] = {
    fill: styles['color:direction/fill'],
    stroke: styles['color:direction/stroke'],
    'stroke-width': hints.strokeWidth,
    zIndex: 1
  }

  return styles
}

