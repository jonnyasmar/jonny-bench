// Post-processing: UnrealBloom for the neon glow, with a graceful fallback
// to plain rendering if the composer can't be constructed.

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export class PostFX {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.enabled = true;
    try {
      const size = renderer.getSize(new THREE.Vector2());
      this.composer = new EffectComposer(renderer);
      this.composer.addPass(new RenderPass(scene, camera));
      this.bloom = new UnrealBloomPass(
        new THREE.Vector2(size.x, size.y),
        0.62,  // strength
        0.5,   // radius
        0.55   // threshold — only bright neon elements bloom
      );
      this.composer.addPass(this.bloom);
      this.composer.addPass(new OutputPass());
    } catch (err) {
      console.warn('PostFX disabled:', err);
      this.enabled = false;
    }
  }

  setSize(w, h) {
    if (this.composer) this.composer.setSize(w, h);
  }

  render() {
    if (this.enabled && this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
  }
}
