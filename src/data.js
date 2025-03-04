export default [
  {
    id: '6b0b1d56-a9e7-4908-a87c-f001239f3d05',
    description: 'Symbols construct from the inside out. Start with [FRIENDLY, PRESENT] frame with no icon and default styling.',
    sidc: 'SFGPU-------'
  },
  {
    id: 'b2424f85-080f-4649-9ec9-53c778d06b9e',
    description: 'Frame border for anticipated or planned symbol is dashed.',
    sidc: 'SFGAU-------'
  },
  {
    id: '9422b223-08ca-45db-b5a5-9351a6114d7b',
    description: 'An icon if available is placed inside the frame.',
    sidc: 'SFGPUCIZ----'
  },
  {
    id: 'b2d82bfe-6f8e-4e9b-90c1-837960701cc4',
    description: 'Symbol icon is not displayed if "special C2 headquarters" text modifier [AA] is supplied.',
    sidc: 'SFGPUCIZ----',
    modifiers: { AA: 'SOF'}
  },
  {
    id: '45e7bede-fa22-430a-82c6-971d456c0de6',
    description: 'One icon may vary between different frame shapes. Compare to previous [MECHANIZED INFRANTRY] with [FRIENDLY] frame.',
    sidc: 'SHGPUCIZ----'
  },
  {
    id: '24ab5e4c-2641-403a-b551-d31e26972c5e',
    description: 'Growing to the right, context modifier [JOKER, FAKER, EXERCISE, SIMULATION] sits right next to the frame.',
    sidc: 'SWGU--------'
  },
  {
    id: '73fcb380-f196-4a40-8f68-1a282b0a40cb',
    description: 'Showing an outline does NOT offset anything around the frame. EXERCISE indicator for example stays put.',
    sidc: 'SWGU--------',
    outlineWidth: 10,
    outlineColor: 'red'
  },
  {
    id: '5f433e07-135b-4310-8246-c7ea26ce8a68',
    description: 'For frameless symbols, [JOKER, FAKER, EXERCISE, SIMULATION] indicator is NOT displayed.',
    sidc: 'SWGUUCIZ----',
    frame: false
  },
  {
    id: '4597b850-4af2-4282-8b39-b5dde974037d',
    description: 'Extending further to the sides, text modifiers come next.',
    sidc: 'SDGPUCIZ----',
    modifiers: {
      W: 'W', X: 'X', Y: 'Y', V: 'V', T: 'T', Z: 'Z',
      F: 'F', G: 'G', H: 'H', M: 'M', J: 'J', K: 'K', L: 'L', N: 'N', P: 'P'
    }
  },
  {
    id: 'a7ab24e9-381d-4c16-beac-e3db0934e4ca',
    description: 'Equipment has a dedicated text modifier for [QUANTITY].',
    sidc: 'SHGPEWMAS------',
    modifiers: { C: '2' }
  },
  {
    id: 'c21fed28-cde0-4c3a-8d9e-74e8119668cf',
    description: 'On top of the frame, we first stack [INSTALLATION] modifier...',
    sidc: 'SFGPI-----H----'
  },
  {
    id: 'a5a22b93-47d1-4bc8-b75b-2728fd58a55d',
    description: '...then [ECHELON]. Note: echelon has precedence over [INSTALLATION]. There can be only one!',
    sidc: 'SFGPI------D---'
  },
  {
    id: 'd101ab8e-0392-4c2f-87fe-bd045bea079b',
    description: '[TASK FORCE] indicator comes next.',
    sidc: 'SFGPI-----ED---'
  },
  {
    id: '9318dbdb-ce66-4912-8fa8-153dc47a6bbe',
    description: 'After that [FEINT/DUMMY]...',
    sidc: 'SFGPI-----GD---'
  },
  {
    id: '6eef8dd5-a533-431b-ad47-88f12cc753ef',
    description: '... and finally [ENGAGEMENT BAR].',
    sidc: 'SFGPI-----GD---',
    modifiers: {
      AO: 'A:BBB-CC'
    }
  },
  {
    id: 'd20f6759-181b-4852-ae6b-7609d30ffb51',
    description: 'By the way, text fields stay aligned relative to frame with optional JOKER, FAKER etc. context.',
    sidc: 'SDGPI-----GD---',
    modifiers: {
      W: 'W', X: 'X', Y: 'Y', V: 'V', T: 'T', Z: 'Z',
      F: 'F', G: 'G', H: 'H', M: 'M', J: 'J', K: 'K', L: 'L', N: 'N', P: 'P'
    }
  },
  {
    id: '1c6032bb-6581-47a1-86f4-ed851c97a635',
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
    id: '77f9a634-ed09-46f4-8823-974f379c2130',
    description: 'For equipment [MOBILITY INDICATOR] is the first extension below the frame.',
    sidc: 'SHGPEWMAS-MR---'
  },
  {
    id: '4c5fb023-0398-43e4-b01c-5ea03a0d85e7',
    description: 'For equipment [OPERATIONAL CONDITION] is the next extension below [MOBILITY]. It might be slightly misaligned if [MOBILITY] already is.',
    sidc: 'SHGCEWMAS-MR---',
  },
  {
    id: 'a618d115-417b-4897-82c7-621f70d0c4b0',
    description: 'Outline nicely blooms around bottom extension without offsetting them.',
    sidc: 'SHGCEWMAS-MR---',
    outlineWidth: 10,
    outlineColor: 'yellow'
  },
  {
    id: '9147c9a7-60cc-407d-99a9-471f1ec3ddee',
    description: 'Strictly speaking, 2525C does not support [OPERATIONAL CONDITION] for units. We do.',
    sidc: 'SDGCI-----GD---',
    modifiers: {
      W: 'W', X: 'X', Y: 'Y', V: 'V', T: 'T', Z: 'Z',
      F: 'F', G: 'G', H: 'H', M: 'M', J: 'J', K: 'K', L: 'L', N: 'N', P: 'P'
    }
  },
  {
    id: '35fed635-bae8-4308-9cbe-84b5658417b6',
    description: 'Direction indicator exits from the bottom center of regular units, i.e. not headquarters.',
    sidc: 'SFGPUCIZ----',
    modifiers: { Q: '120', Z: '25 km/h' }
  },
  {
    id: '4a141e32-d26c-4c26-9be2-74665b449676',
    description: 'Direction indicator is attached to headquarters staff for HQs.',
    sidc: 'SFGPUCIZ--A-',
    modifiers: { Q: '120', Z: '25 km/h' }
  },
  {
    id: '8510bdfa-2fd2-4c46-b1a4-76ec44733f2c',
    description: 'Direction indicator originates in frame center for equipments.',
    sidc: 'SUAPMF----',
    modifiers: { Q: '120', Z: '25 km/h' }
  },
  {
    id: '13549e31-77da-4fd0-be4a-d365c5336339',
    description: 'Invalid symbol for identifier codes are displayed as proposed by 2525/APP6.',
    sidc: 'MUZP------'
  },
  {
    id: '33b5563d-6209-4be7-8fee-1563c6af0a55',
    description: 'Stacked frame (Unit)',
    sidc: 'SDGPI-----GD---',
    stack: 4,
    modifiers: {
      W: 'W', X: 'X', Y: 'Y', V: 'V', T: 'T', Z: 'Z',
      F: 'F', G: 'G', H: 'H', M: 'M', J: 'J', K: 'K', L: 'L', N: 'N', P: 'P'
    }
  },
  {
    id: 'e98c25e5-a591-44c7-87ac-6a3b50fac9d0',
    description: 'Stacked equipment frame with mobility indicator and operational condition bar.',
    sidc: 'SHGCEWMAS-MR---',
    stack: 3
  },
  {
    id: 'a145a02a-e9bf-4528-8d48-81499d53ecae',
    description: 'Stacked unit frame with engagement bar',
    sidc: 'SFGPI-----GD---',
    stack: 6,
    modifiers: {
      AO: 'A:BBB-CC',
      F: '(+/-)'
    }
  },
  {
    id: '2f202360-88eb-4ffd-942f-01f17fd8f0a5',
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
    id: '6c0ab402-240f-4f85-a89a-e119fe2b81dc',
    context: 'issue',
    reference: 'https://github.com/syncpoint/signs/issues/4',
    description: '30161000001110010000: icon not displayed',
    sidc: '30161000001110010000'
  },
  {
    id: 'f92c39ae-4d35-42a5-96e7-8dc433ef220f',
    context: 'issue',
    reference: 'https://github.com/syncpoint/signs/issues/5',
    description: '30161000001110010000: wrong frame color',
    sidc: '30161000001110010000'
  }
]
