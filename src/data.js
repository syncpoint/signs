export default [
  {
    description: 'Symbols construct from the inside out. Start with [FRIENDLY, PRESENT] frame with no icon and default styling.',
    sidc: 'SFGPU-------'
  },
  {
    description: 'Frame border for anticipated or planned symbol is dashed.',
    sidc: 'SFGAU-------'
  },
  {
    description: 'An icon if available is placed inside the frame.',
    sidc: 'SFGPUCIZ----'
  },
  {
    description: 'Symbol icon is not displayed if "special C2 headquarters" text modifier [AA] is supplied.',
    sidc: 'SFGPUCIZ----',
    modifiers: { AA: 'SOF'}
  },
  {
    description: 'One icon may vary between different frame shapes. Compare to previous [MECHANIZED INFRANTRY] with [FRIENDLY] frame.',
    sidc: 'SHGPUCIZ----'
  },
  {
    description: 'Growing to the right, context modifier [JOKER, FAKER, EXERCISE, SIMULATION] sits right next to the frame.',
    sidc: 'SWGU--------'
  },
  {
    description: 'Showing an outline does NOT offset anything around the frame. EXERCISE indicator for example stays put.',
    sidc: 'SWGU--------',
    outlineWidth: 10,
    outlineColor: 'red'
  },
  {
    description: 'For frameless symbols, [JOKER, FAKER, EXERCISE, SIMULATION] indicator is NOT displayed.',
    sidc: 'SWGUUCIZ----',
    frame: false
  },
  {
    description: 'Extending further to the sides, text modifiers come next.',
    sidc: 'SDGPUCIZ----',
    modifiers: {
      W: 'W', X: 'X', Y: 'Y', V: 'V', T: 'T', Z: 'Z',
      F: 'F', G: 'G', H: 'H', M: 'M', J: 'J', K: 'K', L: 'L', N: 'N', P: 'P'
    }
  },
  {
    description: 'Equipment has a dedicated text modifier for [QUANTITY].',
    sidc: 'SHGPEWMAS------',
    modifiers: { C: '2' }

  },
  {
    description: 'On top of the frame, we first stack [INSTALLATION] modifier...',
    sidc: 'SFGPI-----H----'
  },
  {
    description: '...then [ECHELON]. Note: echelon has precedence over [INSTALLATION]. There can be only one!',
    sidc: 'SFGPI------D---'
  },
  {
    description: '[TASK FORCE] indicator comes next.',
    sidc: 'SFGPI-----ED---'
  },
  {
    description: 'After that [FEINT/DUMMY]...',
    sidc: 'SFGPI-----GD---'
  },
  {
    description: '... and finally [ENGAGEMENT BAR].',
    sidc: 'SFGPI-----GD---',
    modifiers: {
      AO: 'A:BBB-CC'
    }
  },
  {
    description: 'By the way, text fields stay aligned relative to frame with optional JOKER, FAKER etc. context.',
    sidc: 'SDGPI-----GD---',
    modifiers: {
      W: 'W', X: 'X', Y: 'Y', V: 'V', T: 'T', Z: 'Z',
      F: 'F', G: 'G', H: 'H', M: 'M', J: 'J', K: 'K', L: 'L', N: 'N', P: 'P'
    }
  },
  {
    description: 'An outline still does not change relative positioning.',
    sidc: 'SDGPI-----GD---',
    outlineWidth: 6,
    outlineColor: 'lightgrey',
    modifiers: {
      W: 'W', X: 'X', Y: 'Y', V: 'V', T: 'T', Z: 'Z',
      F: 'F', G: 'G', H: 'H', M: 'M', J: 'J', K: 'K', L: 'L', N: 'N', P: 'P'
    }
  },
  {
    description: 'For equipment [MOBILITY INDICATOR] is the first extension below the frame.',
    sidc: 'SHGPEWMAS-MR---'
  },
  {
    description: 'For equipment [OPERATIONAL CONDITION] is the next extension below [MOBILITY]. It might be slightly misaligned if [MOBILITY] already is.',
    sidc: 'SHGCEWMAS-MR---',
  },
  {
    description: 'Outline nicely blooms around bottom extension without offsetting them.',
    sidc: 'SHGCEWMAS-MR---',
    outlineWidth: 10,
    outlineColor: 'yellow'
  },
  {
    description: 'Strictly speaking, 2525C does not support [OPERATIONAL CONDITION] for units. We do.',
    sidc: 'SDGCI-----GD---',
    modifiers: {
      W: 'W', X: 'X', Y: 'Y', V: 'V', T: 'T', Z: 'Z',
      F: 'F', G: 'G', H: 'H', M: 'M', J: 'J', K: 'K', L: 'L', N: 'N', P: 'P'
    }
  },
  {
    description: 'Direction indicator exits from the bottom center of regular units, i.e. not headquarters.',
    sidc: 'SFGPUCIZ----',
    modifiers: { Q: '120', Z: '25 km/h' }
  },
  {
    description: 'Direction indicator is attached to headquarters staff for HQs.',
    sidc: 'SFGPUCIZ--A-',
    modifiers: { Q: '120', Z: '25 km/h' }
  },
  {
    description: 'Direction indicator originates in frame center for equipments.',
    sidc: 'SUAPMF----',
    modifiers: { Q: '120', Z: '25 km/h' }
  },
  {
    description: 'Invalid symbol for identifier codes are displayed as proposed by 2525/APP6.',
    sidc: 'MUZP------'
  },
  {
    context: 'issue',
    reference: 'https://github.com/syncpoint/signs/issues/3',
    description: 'Exercise flag causes extension of conditional bar',
    sidc: 'SDGPUCIZ----',
    modifiers: {
      W: 'W', X: 'X', Y: 'Y', V: 'V', T: 'T', Z: 'Z',
      F: 'F', G: 'G', H: 'H', M: 'M', J: 'J', K: 'K', L: 'L', N: 'N', P: 'P'
    }
  },
  {
    context: 'issue',
    reference: 'https://github.com/syncpoint/signs/issues/4',
    description: '30161000001110010000: icon not displayed',
    sidc: '30161000001110010000'
  },
  {
    context: 'issue',
    reference: 'https://github.com/syncpoint/signs/issues/5',
    description: '30161000001110010000: wrong frame color',
    sidc: '30161000001110010000'
  }
]
