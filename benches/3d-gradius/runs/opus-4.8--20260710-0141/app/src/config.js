// Central configuration & shared palette for NEON VANGUARD.
// A Gradius-inspired 3D side-scrolling shooter with an original synthwave look.

export const COLORS = {
  bg:        0x05030f,
  fog:       0x0a0620,
  gridA:     0xff2d95, // magenta
  gridB:     0x00e5ff, // cyan
  player:    0x39f6ff, // ship cyan
  playerHot: 0xffffff,
  engine:    0xff7a1a, // engine warm
  bullet:    0x9dfcff, // player shots
  laser:     0x8bff00, // laser green-cyan
  missile:   0xffcf3d,
  optionC:   0x39f6ff,
  shield:    0x66e0ff,
  capsule:   0xffb020, // power capsule amber
  enemyBul:  0xff3b6b, // enemy shots hot pink
  eMagenta:  0xff2d95,
  eViolet:   0xb46bff,
  eOrange:   0xff8a3d,
  eGreen:    0x4dffb0,
  bossCore:  0xff2d55,
  star:      0xbfe9ff,
};

export const CONFIG = {
  // Camera / playfield
  fov: 52,
  camZ: 34,
  playMarginX: 2.2,
  playMarginTop: 1.6,
  playMarginBottom: 1.6,

  // Player
  baseSpeed: 15.5,
  speedStep: 4.2,
  maxSpeedLevels: 4,
  fireRate: 0.14,          // seconds between shots
  maxBullets: 2,           // simultaneous forward bullets on screen (classic feel), scaled by options
  invulnTime: 2.2,
  respawnDelay: 1.0,
  startLives: 3,

  // Bullets
  bulletSpeed: 46,
  laserSpeed: 78,
  missileSpeed: 26,
  enemyBulletSpeed: 15,

  // Options
  maxOptions: 4,
  optionTrailGap: 9,       // frames of delay between followers

  // Power meter slots (the iconic Gradius selector)
  powerSlots: ['SPEED', 'MISSILE', 'DOUBLE', 'LASER', 'OPTION', 'SHIELD'],

  // Difficulty
  bossScore: 0,            // driven by wave scheduler instead
};

// Playfield bounds are computed at runtime from the camera frustum.
export const bounds = { left: -24, right: 24, top: 14, bottom: -14 };

export function setBounds(l, r, t, b) {
  bounds.left = l; bounds.right = r; bounds.top = t; bounds.bottom = b;
}
