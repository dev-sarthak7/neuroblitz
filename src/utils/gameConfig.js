export const GAMES = [
  {
    id: 'flash-type',
    title: 'Flash Type',
    description: 'A word flashes briefly — type it before it vanishes.',
    icon: '⚡',
    skill: 'Attention + Speed',
    color: '#7c6ff7',
    path: '/game/flash-type'
  },
  {
    id: 'sequence-grid',
    title: 'Sequence Grid',
    description: 'Tiles light up in a pattern — repeat the sequence.',
    icon: '🔲',
    skill: 'Memory',
    color: '#34d399',
    path: '/game/sequence-grid'
  },
  {
    id: 'nback',
    title: 'N-Back',
    description: 'Does this letter match the one from N steps ago?',
    icon: '🧠',
    skill: 'Working Memory',
    color: '#60a5fa',
    path: '/game/nback'
  },
  {
    id: 'math-sprint',
    title: 'Math Sprint',
    description: 'Solve as many equations as possible in 60 seconds.',
    icon: '➕',
    skill: 'Processing Speed',
    color: '#fbbf24',
    path: '/game/math-sprint'
  },
  {
    id: 'stroop-test',
    title: 'Stroop Test',
    description: 'Name the ink color, not the word. Classic brain conflict.',
    icon: '🎨',
    skill: 'Inhibition',
    color: '#f87171',
    path: '/game/stroop-test'
  }
]

export const FLASH_WORDS = [
  'brain','flash','speed','focus','train','quick','sharp','swift',
  'smart','rapid','think','light','blaze','grasp','alert','power',
  'chase','pixel','spark','prime','drift','nexus','pulse','glyph',
  'crisp','blast','surge','frame','scope','verse','track','climb'
]

export const STROOP_COLORS = [
  { name: 'Red',    hex: '#f87171' },
  { name: 'Blue',   hex: '#60a5fa' },
  { name: 'Green',  hex: '#4ade80' },
  { name: 'Yellow', hex: '#fbbf24' },
  { name: 'Purple', hex: '#a78bfa' },
]