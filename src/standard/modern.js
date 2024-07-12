import { instructions } from './instructions.js'

export const accept = options => {
  const [sidc] = options.sidc.split('+')
  const regex = /[0-9]{20}/
  const match = sidc.match(regex)
  return match ? true : false
}

export const document = options => {
  return instructions(options, meta(options))
}


const meta = options => {
  const meta = { invalid: false }
  const [sidc, standard] = options.sidc.split('+')

  const parts = {
    context: sidc[2],
    affiliation: sidc[3],
    symbolSet: sidc.substring(4, 6),
    status: sidc[6],
    indicator: sidc[7],
    amplifier: sidc.substring(8, 10),
    entity: sidc.substring(10, 12),
    type: sidc.substring(12, 14),
    subtype: sidc.substring(14, 16),
    function: sidc.substring(10, 16),
    modifier1: sidc.substring(16, 18),
    modifier2: sidc.substring(18, 20)
  }

  meta.type = 'MODERN'
  meta.standard = standard || '2525'

  meta.generic = parts.symbolSet + '-' + parts.function
  meta.context = CONTEXT[parts.context]
  meta.affiliation =
    AFFILIATION[parts.context + parts.affiliation] ||
    AFFILIATION[parts.affiliation]

  // FIXME: wrong shape for joker
  meta.joker = meta.context === 'EXERCISE' && parts.affiliation === '5' // SUSPECT
  meta.faker = meta.context === 'EXERCISE' && parts.affiliation === '6' // HOSTILE
  meta.status = STATUS[parts.status]
  meta.present = parts.status === '0'
  meta.dimension = DIMENSION.find(([regex]) => sidc.match(regex))[1]
  meta.civilian = CIVILIAN.some(regex => sidc.match(regex))
  // TODO: PENDING - ETC/POSCON tracks, fused tracks
  meta.pending = !meta.joker && PENDING.has(parts.affiliation)
  meta.installation = meta.dimension === 'UNIT' && parts.symbolSet === '20'
  meta.taskForce = TASK_FORCE.has(parts.indicator)
  meta.headquarters = HEADQUARTERS.has(parts.indicator)
  meta.feintDummy = FEINT_DUMMY.has(parts.indicator)
  meta.mobility = MOBILITY[parts.amplifier]
  meta.echelon = !meta.mobility && ECHELON[parts.amplifier]

  return meta
}


const CONTEXT = ['REALITY', 'EXERCISE', 'SIMULATION']
const PENDING = new Set(['0', '2', '5'])

const AFFILIATION = {
  '15': 'FRIEND',
  '16': 'FRIEND',
  '0': 'UNKNOWN', '1': 'UNKNOWN',
  '2': 'FRIEND', '3': 'FRIEND',
  '4': 'NEUTRAL',
  '5': 'HOSTILE', '6': 'HOSTILE'
}

const DIMENSION = [
  [/^....(15)/, 'EQUIPMENT'],
  [/^....(05|06|50)/, 'SPACE'],
  [/^....(01|02|51)/, 'AIR'],
  [/^....20/, 'INSTALLATION'],
  [/^....27/, 'DISMOUNTED'],
  [/^....30/, 'SEA'],
  [/^....(35|36|39|45)/, 'SUBSURFACE'],
  [/^....40/, 'ACTIVITY'],
  [/^....(10|11|12|15|20|27|30|52|60)/, 'UNIT'], // incl. DISMOUNTED
]

const CIVILIAN = [
  /^....01....12/,
  /^....05....12/,
  /^....11/,
  /^....12....12/,
  /^....15....16/,
  /^....30....14/
]

const STATUS = {
  0: 'PRESENT',
  1: 'PLANNED', // ANTICIPATED
  2: 'FULLY_CAPABLE',
  3: 'DAMAGED',
  4: 'DESTROYED',
  5: 'FULL_TO_CAPACITY'
}

export const ECHELON = {
  11: 'TEAM', // CREW: '11',
  12: 'SQUAD',
  13: 'SECTION',
  14: 'PLATOON', // DETACHMENT: '14',
  15: 'COMPANY', // BATTERY: '15', TROOP: '15',
  16: 'BATTALION', // SQUADRON: '16',
  17: 'REGIMENT', // GROUP: '17',
  18: 'BRIGADE',
  21: 'DIVISION',
  22: 'CORPS', // MEF: '22',
  23: 'ARMY',
  24: 'ARMY_GROUP', // FRONT: '24',
  25: 'REGION', // THEATER: '25',
  26: 'COMMAND'
}

const MOBILITY = {
  31: 'WHEELED_LIMITED',
  32: 'WHEELED',
  33: 'TRACKED',
  34: 'HALF_TRACK',
  35: 'TOWED',
  36: 'RAIL',
  37: 'PACK_ANIMALS',
  41: 'OVER_SNOW',
  42: 'SLED',
  51: 'BARGE',
  52: 'AMPHIBIOUS',
  61: 'TOWED_ARRAY_SHORT',
  62: 'TOWED_ARRAY_LONG'
}

const FEINT_DUMMY = new Set(['1', '3', '5', '7'])
const HEADQUARTERS = new Set(['2', '3', '6', '7'])
const TASK_FORCE = new Set(['4', '5', '6', '7'])
