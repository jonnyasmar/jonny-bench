import { Game } from './game.js';
import { Audio } from './audio.js';

function boot() {
  const container = document.getElementById('game');
  const game = new Game(container);
  window.__game = game; // handy for debugging

  // First user gesture unlocks audio.
  const unlock = () => { Audio.resume(); };
  window.addEventListener('pointerdown', unlock, { once: false });
  window.addEventListener('keydown', unlock, { once: false });

  // Music / SFX toggles
  const musicBtn = document.getElementById('btn-music');
  const sfxBtn = document.getElementById('btn-sfx');
  if (musicBtn) musicBtn.addEventListener('click', () => {
    const on = musicBtn.classList.toggle('off');
    Audio.setMusicEnabled(!on);
    musicBtn.textContent = on ? '♪ MUSIC: OFF' : '♪ MUSIC: ON';
  });
  if (sfxBtn) sfxBtn.addEventListener('click', () => {
    const off = sfxBtn.classList.toggle('off');
    Audio.enabled = !off;
    sfxBtn.textContent = off ? '♫ SFX: OFF' : '♫ SFX: ON';
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
