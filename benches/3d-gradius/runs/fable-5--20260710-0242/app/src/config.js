// VOIDSURGE — palette + tuning constants.
export const PAL = {
  bg: 0x06030f,
  fog: 0x0a0522,
  starA: 0xaee6ff,
  starB: 0xffd6f2,
  starC: 0xfff7d6,
  ridgeNear: 0x1b1040,
  ridgeNearWire: 0x6f4fe0,
  ridgeFar: 0x120a2e,
  ridgeFarWire: 0x3a2a7a,
  crystal: 0x241455,

  hull: 0xdfe9ff,
  hullDark: 0x30386b,
  engine: 0x54e0ff,
  canopy: 0x7cf6ff,

  pbullet: 0xa7f6ff,
  pulse: 0xff8df0,
  ebullet: 0xff4f9e,
  ebulletHot: 0xffd24f,

  shard: 0xffd35a,
  droneCol: 0x8fffe0,
  shieldCol: 0x66c8ff,

  moteCol: 0xff6f86,
  dartCol: 0xffa14f,
  spinnerCol: 0xc06fff,
  chargerCol: 0x5fffb4,
  weaverCol: 0x6fa8ff,

  bossShell: 0x8a5cff,
  bossCore: 0xff5ad2,
};

export const SURGE_SLOTS = [
  { key: 'THRUST', desc: 'engine boost' },
  { key: 'TWIN',   desc: 'twin cannons' },
  { key: 'PULSE',  desc: 'piercing wave' },
  { key: 'ECHO',   desc: 'echo drone' },
  { key: 'WARD',   desc: 'energy ward' },
  { key: 'NOVA',   desc: 'screen burst' },
];

export const TUNE = {
  scroll: 3.2,               // world scroll speed (visual)
  playerAccel: 90,
  playerDrag: 9,
  playerSpeedBase: 10.5,
  playerSpeedStep: 2.1,      // per THRUST level
  playerSpeedMax: 4,         // max THRUST levels
  playerRadius: 0.34,
  fireInterval: 0.145,
  respawnInvuln: 2.6,
  startLives: 3,

  bossEvery: 72,             // seconds of wave time between bosses
  comboDecay: 3.5,           // s without a kill before combo bleeds
};
