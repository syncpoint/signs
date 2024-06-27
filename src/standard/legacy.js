import { instructions } from './instructions.js'

export const accept = options => {
  const [sidc] = options.sidc.split('+')
  const normalized = sidc.toUpperCase().replaceAll('*', '-')
  // Note: Also accepting SKKM.
  const regex = /^[EGIOSWK][A-Z0-9\-]{9,14}$/
  const match = normalized.match(regex)
  return match ? true : false
}

export const document = options => {
  return instructions(options, meta(options))
}

const meta = options => {
  const meta = { invalid: false }
  const [sidc, standard] = options.sidc.split('+')

  meta.type = 'LEGACY'
  meta.sidc = sidc.toUpperCase().replaceAll('*', '-')
  meta.standard = standard || '2525'
  meta.generic = sidc[0] + '-' + sidc[2] + '-' + (sidc.substring(4, 10) || '------')

  const parts = {
    scheme: meta.sidc[0],
    identity: meta.sidc[1],
    dimension: meta.sidc[2],
    status: meta.sidc[3],
    function: meta.sidc.substring(4, 10),
    modifier10: meta.sidc[10],
    modifier11: meta.sidc[11],
    modifiers: meta.sidc.substring(10, 12)
  }

  meta.skkm = parts.scheme === 'K'
  meta.affiliation = AFFILIATION[parts.identity] || 'UNKNOWN'
  meta.joker = parts.identity === 'J'
  meta.faker = parts.identity === 'K'
  meta.context = EXERCISE.has(parts.identity) ? 'EXERCISE' : 'REALITY'
  meta.status = STATUS[parts.status]
  meta.present = parts.status !== 'A'
  meta.anticipated = !meta.present
  meta.planned = meta.anticipated
  meta.condition = CONDITION[parts.status]

  meta.dimension = DIMENSION.find(([regex]) => meta.sidc.match(regex))[1]
  meta.ground = GROUND.some(regex => meta.sidc.match(regex))
  meta.frameless = FRAMELESS.some(regex => meta.sidc.match(regex))
  meta.unfilled = UNFILLED.some(regex => meta.sidc.match(regex))
  meta.civilian = CIVILIAN.some(regex => meta.sidc.match(regex))
  meta.pending = PENDING.has(parts.identity)
  meta.installation = meta.dimension === 'UNIT' && parts.modifiers === 'H-'
  meta.taskForce = TASK_FORCE.has(parts.modifier10)
  meta.headquarters = HEADQUARTERS.has(parts.modifier10) || parts.function === 'UH----'
  meta.feintDummy = FEINT_DUMMY.has(parts.modifier10)

  // Mobility and echelon are mutually exclusive; try mobility first.
  // TODO: limit to equipment
  meta.mobility = MOBILITY[parts.modifiers] || false
  meta.echelon = !meta.mobility && ECHELON[parts.modifier11]

  return meta
}

const AFFILIATION = {
  H: 'HOSTILE', J: 'FRIEND', K: 'FRIEND', S: 'HOSTILE',
  A: 'FRIEND', F: 'FRIEND', D: 'FRIEND', M: 'FRIEND',
  L: 'NEUTRAL', N: 'NEUTRAL',
  G: 'UNKNOWN', P: 'UNKNOWN', U: 'UNKNOWN', W: 'UNKNOWN'
}

const EXERCISE = new Set(['D', 'G', 'J', 'K', 'L', 'M', 'W'])
const PENDING = new Set(['P', 'A', 'S', 'G', 'M'])
const FEINT_DUMMY = new Set(['C', 'D', 'F', 'G'])
const HEADQUARTERS = new Set(['A', 'B', 'C', 'D'])
const TASK_FORCE = new Set(['B', 'D', 'E', 'G'])

const STATUS = {
  A: 'PLANNED', // also ANTICIPATED
  P: 'PRESENT'
}

const CONDITION = {
  C: 'FULLY_CAPABLE', // PRESENT
  D: 'DAMAGED', // PRESENT
  X: 'DESTROYED', // PRESENT
  F: 'FULL_TO_CAPACITY' // PRESENT
}

const DIMENSION = [
  [/^[^O].P/, 'SPACE'],
  [/^[^O].[AP]/, 'AIR'],
  [/^O.[VOR]/, 'ACTIVITY'], // precedence over SO
  [/^O/, 'UNIT'], // SO => GROUND/UNIT
  [/^S.G.E/, 'EQUIPMENT'],
  [/^S.S/, 'EQUIPMENT'], // SUBSURFACE -> EQUIPMENT
  [/^.FS/, 'EQUIPMENT'],
  [/^I.G/, 'EQUIPMENT'], // SIGINT
  [/^E.O.(AB|AE|AF|BB|CB|CC|DB|D.B|E.)/, 'EQUIPMENT'], // EMS EQUIPMENT
  [/^E.F.(BA|MA|MC)/, 'EQUIPMENT'],
  [/^E/, 'UNIT'], // EMS tactical symbols
  [/^..[EFGOSXZ]/, 'UNIT'], // incl. SOF, EMS
  [/^..U/, 'SUBSURFACE' ],
  [/^G/, 'CONTROL'] // control measures aka tactical graphics
]

const GROUND = [
  /^..G/,
  /^O.V/
]

const FRAMELESS = [
  /^..S.(O-----|ED----|EP----|EV----|ZM----|ZN----|ZI----)/,
  /^E.N.(AA----|AB----|AC----|AD----|AE----|AG----|BB----|BC----|BF----|BM----|CA----|CB----|CC----|CD----|CE----)/,
  /^W.S.(WSVE--|WSD-LI|WSFGSO|WSGRL-|WSR-LI|WSDSLM|WSS-LI|WSTMH-|WST-FC|WSTSS-)/,
  /^..U.(ND----|NBS---|NBR---|NBW---|NM----|NA----)/,
  /^G.(?!O.[VLPI])/,

  // SKKM icons only, no frames:
  /^K/
]

// With unfilled frames.
const UNFILLED = [
  /^..U.(WM----|WMD---|WMG---|WMGD--|WMGX--|WMGE--|WMGC--|WMGR--|WMGO--|WMM---|WMMD--|WMMX--|WMME--|WMMC--|WMMR--|WMMO--|WMF---)/,
  /^..U.(WMFD--|WMFX--|WMFE--|WMFC--|WMFR--|WMFO--|WMO---|WMOD--|WMX---|WME---|WMA---|WMC---|WMR---|WMB---|WMBD--|WMN---|WMS---)/,
  /^..U.(WMSX--|WMSD--|WDM---|WDMG--|WDMM--|E-----|V-----|X-----)/
]

const CIVILIAN = [/^..A.C/, /^..G.EVC/, /^..S.X/]

const MOBILITY = {
  MO: 'WHEELED_LIMITED',
  MP: 'WHEELED',
  MQ: 'TRACKED',
  MR: 'HALF_TRACK',
  MS: 'TOWED',
  MT: 'RAIL',
  MW: 'PACK_ANIMALS',
  MU: 'OVER_SNOW',
  MV: 'SLED',
  MX: 'BARGE',
  MY: 'AMPHIBIOUS',
  NS: 'TOWED_ARRAY_SHORT',
  NL: 'TOWED_ARRAY_LONG'
}

const ECHELON = {
  A: 'TEAM', // CREW
  B: 'SQUAD',
  C: 'SECTION',
  D: 'PLATOON', // DETACHMENT
  E: 'COMPANY', // BATTERY, TROOP
  F: 'BATTALION', // SQUADRON
  G: 'REGIMENT', // GROUP
  H: 'BRIGADE',
  I: 'DIVISION',
  J: 'CORPS', // MEF
  K: 'ARMY',
  L: 'ARMY_GROUP', // FRONT
  M: 'REGION', // THEATER
  N: 'COMMAND'
}
