import { Game } from "./game.js";

const canvas = document.getElementById("game-canvas");
if (!canvas) {
  throw new Error("Missing #game-canvas");
}

// Focus canvas for keyboard when clicking game
canvas.tabIndex = 0;
document.body.addEventListener("click", () => canvas.focus(), { passive: true });

const game = new Game(canvas);

// Expose for debug in console
window.__aetherWing = game;

// Prevent context menu on long-press
canvas.addEventListener("contextmenu", (e) => e.preventDefault());
