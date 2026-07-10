/* VANTA RUN — original static Three.js arcade shooter */
(() => {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const canvas = $('#canvas');
  const ui = {
    hud: $('#hud'), score: $('#score'), chain: $('#chain'), health: $('#health'),
    weapon: $('#weapon'), progress: $('#progress'), sector: $('#sector'), flash: $('#flash'),
    menu: $('#menu'), pause: $('#pause'), result: $('#result'), toast: $('#power-toast'),
    warning: $('#warning'), finalScore: $('#final-score'), resultTitle: $('#result-title'),
    resultKicker: $('#result-kicker'), resultCopy: $('#result-copy')
  };

  const C = {
    cyan: 0x75f7ff, hot: 0xff3d8d, gold: 0xffd166, blue: 0x537dff,
    ink: 0x050712, white: 0xedfaff, violet: 0x9d6cff
  };
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.ink);
  scene.fog = new THREE.FogExp2(0x070a18, 0.026);
  const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 120);
  camera.position.set(0, 0.3, 15);
  camera.lookAt(0, 0, 0);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const world = new THREE.Group();
  const actors = new THREE.Group();
  const effects = new THREE.Group();
  scene.add(world, actors, effects);
  scene.add(new THREE.HemisphereLight(0x88bbff, 0x15091e, 1.05));
  const keyLight = new THREE.DirectionalLight(0x9ffaff, 2.2);
  keyLight.position.set(-4, 6, 9);
  scene.add(keyLight);
  const rim = new THREE.PointLight(C.hot, 2.2, 22);
  rim.position.set(8, -3, 5);
  scene.add(rim);

  const mat = {
    dark: new THREE.MeshStandardMaterial({ color: 0x10162b, metalness: .88, roughness: .28 }),
    dark2: new THREE.MeshStandardMaterial({ color: 0x24162e, metalness: .78, roughness: .34 }),
    cyan: new THREE.MeshStandardMaterial({ color: C.cyan, emissive: C.cyan, emissiveIntensity: 1.25, metalness: .55, roughness: .2 }),
    hot: new THREE.MeshStandardMaterial({ color: C.hot, emissive: C.hot, emissiveIntensity: 1.2, metalness: .5, roughness: .25 }),
    gold: new THREE.MeshStandardMaterial({ color: C.gold, emissive: C.gold, emissiveIntensity: 1.15, metalness: .55, roughness: .25 }),
    white: new THREE.MeshStandardMaterial({ color: C.white, emissive: 0x9bdde2, emissiveIntensity: .5, metalness: .75, roughness: .2 }),
    violet: new THREE.MeshStandardMaterial({ color: C.violet, emissive: C.violet, emissiveIntensity: 1.2, metalness: .5, roughness: .25 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x86eaff, emissive: 0x126080, emissiveIntensity: .7, transmission: .25, transparent: true, opacity: .72, metalness: .1, roughness: .05 }),
    ghost: new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: .12, wireframe: true, blending: THREE.AdditiveBlending, depthWrite: false })
  };
  const GEO = {
    orb: new THREE.IcosahedronGeometry(.24, 1),
    shard: new THREE.TetrahedronGeometry(.18, 0),
    bullet: new THREE.CylinderGeometry(.055, .11, .95, 6),
    enemyBullet: new THREE.OctahedronGeometry(.16, 0),
    ring: new THREE.TorusGeometry(.55, .075, 6, 24),
    cube: new THREE.BoxGeometry(1, 1, 1)
  };
  GEO.bullet.rotateZ(-Math.PI / 2);

  const game = {
    state: 'menu', time: 0, score: 0, displayScore: 0, health: 4, maxHealth: 4,
    weapon: 1, shield: 0, chain: 1, chainClock: 0, spawnClock: 0,
    pickupClock: 8, shake: 0, boss: null, bossWarned: false, won: false,
    speed: 5.2, pointerActive: false, invulnerable: 0, trailClock: 0
  };
  const input = { up: 0, down: 0, left: 0, right: 0, firing: false, pointerX: 0, pointerY: 0 };
  const enemies = [], shots = [], enemyShots = [], pickups = [], particles = [], structures = [];

  class Sound {
    constructor() { this.ctx = null; this.master = null; }
    init() {
      if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC(); this.master = this.ctx.createGain(); this.master.gain.value = .12;
      this.master.connect(this.ctx.destination);
      const drone = this.ctx.createOscillator(), gain = this.ctx.createGain();
      drone.type = 'sawtooth'; drone.frequency.value = 43; gain.gain.value = .018;
      drone.connect(gain).connect(this.master); drone.start();
    }
    tone(freq, end, dur, type = 'square', volume = .1) {
      if (!this.ctx) return;
      const t = this.ctx.currentTime, o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, end), t + dur);
      g.gain.setValueAtTime(volume, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
      o.connect(g).connect(this.master); o.start(t); o.stop(t + dur);
    }
    shoot() { this.tone(210, 85, .055, 'square', .028); }
    boom(big = false) { this.tone(big ? 110 : 160, 28, big ? .55 : .22, 'sawtooth', big ? .3 : .16); }
    pickup() { this.tone(420, 1050, .18, 'sine', .16); }
    hurt() { this.tone(120, 42, .38, 'sawtooth', .25); }
    alarm() { this.tone(220, 180, .5, 'square', .13); }
  }
  const sound = new Sound();

  function mesh(geo, material, parent, pos, scale) {
    const m = new THREE.Mesh(geo, material); parent.add(m);
    if (pos) m.position.set(pos[0], pos[1], pos[2]);
    if (scale) m.scale.set(scale[0], scale[1], scale[2]);
    return m;
  }

  function createPlayer() {
    const g = new THREE.Group(); g.position.set(-5.4, 0, 0);
    const fuselage = mesh(new THREE.ConeGeometry(.42, 2.1, 6), mat.white, g);
    fuselage.rotation.z = -Math.PI / 2;
    fuselage.scale.z = .7;
    const mid = mesh(new THREE.CylinderGeometry(.3, .4, 1.25, 8), mat.dark, g);
    mid.rotation.z = -Math.PI / 2; mid.position.x = -.32; mid.scale.z = .75;
    const wing = mesh(new THREE.BoxGeometry(1.25, .09, .76), mat.dark, g, [-.25, 0, 0]);
    wing.rotation.z = -.12;
    mesh(new THREE.BoxGeometry(.82, .045, .9), mat.cyan, g, [-.35, 0, 0], [1, 1, .1]);
    const canopy = mesh(new THREE.SphereGeometry(.3, 12, 8), mat.glass, g, [.18, .22, .03], [1.25, .65, .72]);
    canopy.rotation.z = -.2;
    const engine = mesh(new THREE.TorusGeometry(.31, .08, 6, 16), mat.cyan, g, [-.92, 0, 0]);
    engine.rotation.y = Math.PI / 2;
    const flame = mesh(new THREE.ConeGeometry(.25, 1.25, 8), mat.cyan, g, [-1.45, 0, 0], [1, 1, .65]);
    flame.rotation.z = Math.PI / 2; flame.userData.flame = true;
    const shield = mesh(new THREE.SphereGeometry(1.05, 16, 10), mat.ghost, g);
    shield.scale.x = 1.35; shield.visible = false; shield.userData.shield = true;
    g.userData = { target: new THREE.Vector2(-5.4, 0), velocity: new THREE.Vector2(), flame, shield };
    actors.add(g); return g;
  }
  const player = createPlayer();

  function createBackdrop() {
    const count = 900, positions = new Float32Array(count * 3), colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i*3] = THREE.MathUtils.randFloatSpread(70);
      positions[i*3+1] = THREE.MathUtils.randFloatSpread(28);
      positions[i*3+2] = THREE.MathUtils.randFloat(-35, -3);
      const c = new THREE.Color(Math.random() > .82 ? C.hot : C.cyan).multiplyScalar(THREE.MathUtils.randFloat(.45, 1));
      colors.set([c.r,c.g,c.b], i*3);
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(positions, 3)); geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const stars = new THREE.Points(geo, new THREE.PointsMaterial({ size:.065, vertexColors:true, transparent:true, opacity:.85, sizeAttenuation:true }));
    stars.userData.stars = true; world.add(stars);

    for (let i = 0; i < 11; i++) {
      const g = new THREE.Group(); g.position.set(-18 + i * 6.2, THREE.MathUtils.randFloatSpread(2), -8 - Math.random()*8);
      const ring = mesh(new THREE.TorusGeometry(THREE.MathUtils.randFloat(3.5,7), .045, 4, 30), Math.random()>.7 ? mat.hot : mat.ghost, g);
      ring.scale.y = THREE.MathUtils.randFloat(.65, 1.2); ring.rotation.z = Math.random()*Math.PI;
      g.userData = { kind:'ring', speed:THREE.MathUtils.randFloat(.35,1.1) }; world.add(g); structures.push(g);
    }
    for (let i = 0; i < 8; i++) createStructure(-16 + i * 8);
  }

  function createStructure(x = 14) {
    const g = new THREE.Group();
    const top = Math.random() > .5; g.position.set(x, top ? 6.3 : -6.3, THREE.MathUtils.randFloat(-4,1));
    g.rotation.z = top ? Math.PI : 0;
    const tower = mesh(new THREE.CylinderGeometry(.8, 1.6, 4.3, 6), mat.dark, g);
    const glow = mesh(new THREE.CylinderGeometry(.48, .75, 4.36, 6), Math.random()>.75 ? mat.hot : mat.cyan, g);
    glow.scale.set(1,.015,1); glow.position.y = -1;
    const arm = mesh(new THREE.BoxGeometry(3.4,.18,.35), mat.dark, g, [0,-1.7,0]);
    arm.rotation.z = THREE.MathUtils.randFloatSpread(.2);
    for(let j=0;j<3;j++) mesh(GEO.orb, mat.cyan, g, [-1.2+j*1.2,-1.7,.22],[.35,.35,.35]);
    g.userData = { kind:'tower', speed:THREE.MathUtils.randFloat(.65,1), top };
    world.add(g); structures.push(g); return g;
  }
  createBackdrop();

  function createEnemy(type, y) {
    const g = new THREE.Group();
    let hp=1, radius=.55, score=120, speed=THREE.MathUtils.randFloat(4.4,6.2);
    if (type === 'drone') {
      mesh(new THREE.OctahedronGeometry(.48,0), mat.dark2,g);
      const r=mesh(GEO.ring,mat.hot,g); r.rotation.y=Math.PI/2;
      mesh(GEO.orb,mat.hot,g,[0,0,0],[.55,.55,.55]);
    } else if(type === 'dart') {
      hp=2; radius=.7; score=220; speed=7.4;
      const body=mesh(new THREE.ConeGeometry(.48,1.7,5),mat.dark,g); body.rotation.z=Math.PI/2;
      mesh(new THREE.BoxGeometry(1.1,.08,1.2),mat.hot,g,[.05,0,0]);
      mesh(GEO.orb,mat.gold,g,[.4,0,0],[.55,.55,.55]);
    } else if(type === 'spinner') {
      hp=5; radius=.95; score=480; speed=3.5;
      mesh(new THREE.DodecahedronGeometry(.58,0),mat.dark,g);
      for(let i=0;i<3;i++){const arm=mesh(new THREE.BoxGeometry(.18,2.1,.2),i===0?mat.hot:mat.dark2,g);arm.rotation.z=i*Math.PI/3;}
      mesh(GEO.orb,mat.hot,g,[0,0,.2],[1.1,1.1,1.1]);
    }
    g.position.set(10.5,y,THREE.MathUtils.randFloat(-.4,.5));
    g.userData={ type,hp,maxHp:hp,radius,score,speed,age:0,baseY:y,fire:THREE.MathUtils.randFloat(1,2.5),near:false };
    actors.add(g); enemies.push(g); return g;
  }

  function createPickup(y) {
    const kinds = game.health < 2 ? ['repair','repair','weapon','shield'] : ['weapon','shield','weapon'];
    const kind = kinds[Math.floor(Math.random()*kinds.length)], color = kind==='weapon'?mat.gold:kind==='shield'?mat.cyan:mat.violet;
    const g=new THREE.Group();
    const cage=mesh(new THREE.IcosahedronGeometry(.5,1),mat.ghost,g); cage.material=mat.ghost;
    const core=mesh(GEO.orb,color,g,[0,0,0],[1.25,1.25,1.25]);
    const ring=mesh(GEO.ring,color,g); ring.scale.set(1.2,1.2,1.2);
    g.position.set(10,y,0); g.userData={kind,radius:.65,age:0,cage,core};
    actors.add(g); pickups.push(g);
  }

  function createBoss() {
    const g=new THREE.Group(); g.position.set(11,0,-.2);
    const body=mesh(new THREE.DodecahedronGeometry(2.15,1),mat.dark,g); body.scale.x=1.35;
    for(let i=0;i<3;i++) {
      const ring=mesh(new THREE.TorusGeometry(2.7+i*.35,.16,6,32),i===1?mat.hot:mat.dark2,g); ring.rotation.y=Math.PI/2; ring.rotation.x=i*.65;
      ring.userData.ring=true;
    }
    const core=mesh(new THREE.SphereGeometry(.9,16,10),mat.hot,g,[.75,0,0]);
    const iris=mesh(new THREE.TorusGeometry(1.25,.13,6,24),mat.gold,g,[.8,0,0]); iris.rotation.y=Math.PI/2;
    for(let i=0;i<6;i++){const p=mesh(new THREE.ConeGeometry(.3,1.8,5),mat.dark2,g);p.rotation.z=Math.PI/2;p.position.set(-.8,Math.sin(i*Math.PI/3)*2.3,Math.cos(i*Math.PI/3)*1.2);}
    g.userData={type:'boss',hp:180,maxHp:180,radius:2.2,score:10000,speed:1.2,age:0,fire:.8,phase:0,core,iris};
    actors.add(g); enemies.push(g); game.boss=g; return g;
  }

  function firePlayer() {
    if(game.state!=='playing'||player.userData.fireClock>0)return;
    player.userData.fireClock=game.weapon>=3?.09:.14;
    const spreads = game.weapon===1?[0]:game.weapon===2?[-.12,.12]:[-.22,0,.22];
    spreads.forEach((vy,i)=>{
      const b=mesh(GEO.bullet,i===spreads.length-1?mat.gold:mat.cyan,actors);
      b.position.copy(player.position);b.position.x+=1.15;b.position.y+=vy*1.3;b.userData={vx:19,vy:vy*5,damage:game.weapon>=3?1.15:1,radius:.18,age:0};shots.push(b);
    });
    sound.shoot(); game.shake=Math.max(game.shake,.018);
  }

  function fireEnemy(enemy, angle, speed=7) {
    const a=angle===undefined?Math.atan2(player.position.y-enemy.position.y,player.position.x-enemy.position.x):angle;
    const b=mesh(GEO.enemyBullet,enemy.userData.type==='boss'?mat.gold:mat.hot,actors);
    b.position.copy(enemy.position); b.position.x-=.5;
    b.userData={vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,radius:.2,age:0}; enemyShots.push(b);
  }

  function burst(pos, colorMat=mat.cyan, count=12, power=4) {
    for(let i=0;i<count;i++){
      const p=mesh(Math.random()>.5?GEO.shard:GEO.orb,colorMat,effects);
      p.position.copy(pos); const a=Math.random()*Math.PI*2, s=THREE.MathUtils.randFloat(power*.3,power);
      p.scale.setScalar(THREE.MathUtils.randFloat(.25,1));
      p.userData={vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:THREE.MathUtils.randFloatSpread(power),life:THREE.MathUtils.randFloat(.3,.75),maxLife:1,spin:THREE.MathUtils.randFloatSpread(8)};particles.push(p);
    }
  }

  function ringBlast(pos,color=C.cyan,scale=1) {
    const m=new THREE.Mesh(new THREE.RingGeometry(.75,.9,32),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.8,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));
    m.position.copy(pos);m.userData={life:.45,maxLife:.45,ringBlast:true,base:scale};effects.add(m);particles.push(m);
  }

  function removeFrom(arr,i,obj){ arr.splice(i,1); if(obj.parent)obj.parent.remove(obj); }
  function dist2(a,b){const x=a.position.x-b.position.x,y=a.position.y-b.position.y;return x*x+y*y;}

  function hitPlayer(source) {
    if(game.invulnerable>0||game.state!=='playing')return;
    if(game.shield>0){game.shield--;game.invulnerable=.55;toast('SHIELD ABSORBED');burst(player.position,mat.cyan,16,5);ringBlast(player.position,C.cyan,1.2);sound.pickup();return;}
    game.health--;game.invulnerable=1.65;game.chain=1;game.chainClock=0;game.shake=.55;
    burst(player.position,mat.hot,26,7);ringBlast(player.position,C.hot,1.4);sound.hurt();flash('rgba(255,35,100,.7)',.8);updateHUD();
    if(game.health<=0) endGame(false);
  }

  function killEnemy(e,index) {
    const big=e.userData.type==='spinner'||e.userData.type==='boss';
    game.score+=Math.round(e.userData.score*game.chain); game.chain=Math.min(8,game.chain+1);game.chainClock=2.4;
    burst(e.position,e.userData.type==='boss'?mat.gold:mat.hot,big?48:16,big?9:5);ringBlast(e.position,e.userData.type==='boss'?C.gold:C.hot,big?2.5:1);
    sound.boom(big); game.shake=big?.65:.16;
    if(e.userData.type==='boss'){removeFrom(enemies,index,e);game.boss=null;setTimeout(()=>endGame(true),1200);flash('rgba(255,209,102,.85)',1);return;}
    if(Math.random()<.08)createPickup(e.position.y);
    removeFrom(enemies,index,e); updateHUD();
  }

  function collectPickup(p,index) {
    const kind=p.userData.kind;
    if(kind==='weapon'){game.weapon=Math.min(3,game.weapon+1);toast(game.weapon===3?'TRI-BEAM MAX':'PULSE ARRAY UPGRADED');}
    if(kind==='shield'){game.shield=Math.min(2,game.shield+1);toast('PHASE SHIELD +1');}
    if(kind==='repair'){game.health=Math.min(game.maxHealth,game.health+1);toast('CORE INTEGRITY RESTORED');}
    game.score+=500;burst(p.position,kind==='weapon'?mat.gold:kind==='shield'?mat.cyan:mat.violet,20,5);ringBlast(p.position,kind==='weapon'?C.gold:kind==='shield'?C.cyan:C.violet,1.4);sound.pickup();removeFrom(pickups,index,p);updateHUD();
  }

  function toast(text) { ui.toast.textContent=text;ui.toast.classList.remove('show');void ui.toast.offsetWidth;ui.toast.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>ui.toast.classList.remove('show'),1700); }
  function flash(color='white',strength=.55){ui.flash.style.background=color;ui.flash.style.opacity=strength;}

  function updateHUD() {
    ui.health.innerHTML='';for(let i=0;i<game.maxHealth;i++){const pip=document.createElement('i');if(i>=game.health)pip.className='off';ui.health.appendChild(pip);}
    ui.weapon.textContent=(game.weapon===1?'TWIN PULSE · LV1':game.weapon===2?'SPLIT PULSE · LV2':'TRI-BEAM · MAX')+(game.shield?` · SHIELD ×${game.shield}`:'');
    ui.chain.textContent=`CHAIN ×${game.chain}`;
  }

  function resetGame() {
    [...enemies,...shots,...enemyShots,...pickups,...particles].forEach(o=>o.parent&&o.parent.remove(o));
    enemies.length=shots.length=enemyShots.length=pickups.length=particles.length=0;
    Object.assign(game,{state:'playing',time:0,score:0,displayScore:0,health:4,weapon:1,shield:0,chain:1,chainClock:0,spawnClock:.8,pickupClock:8,shake:0,boss:null,bossWarned:false,won:false,speed:5.2,pointerActive:false,invulnerable:1,trailClock:0});
    player.position.set(-5.4,0,0);player.visible=true;player.userData.velocity.set(0,0);player.userData.target.set(-5.4,0);player.userData.fireClock=0;player.userData.shield.visible=false;
    ui.menu.classList.remove('active');ui.result.classList.remove('active');ui.pause.classList.remove('active');ui.hud.classList.remove('hidden');ui.warning.classList.remove('show');
    updateHUD();sound.init();
  }

  function endGame(won) {
    if(game.state!=='playing')return;game.state=won?'won':'over';game.won=won;player.visible=won;
    ui.finalScore.textContent=Math.round(game.score).toString().padStart(6,'0');
    ui.resultKicker.textContent=won?'MISSION COMPLETE':'SIGNAL LOST';ui.resultTitle.textContent=won?'VEIL BROKEN':'CORE COLLAPSED';
    ui.resultCopy.textContent=won?'The forge signal is silent. For now.':'The foundry is still awake. Run it again.';
    setTimeout(()=>ui.result.classList.add('active'),won?900:500);ui.hud.classList.add('hidden');
  }

  function spawnLogic(dt) {
    if(game.time>63&&!game.bossWarned){game.bossWarned=true;ui.warning.classList.add('show');sound.alarm();setTimeout(()=>sound.alarm(),650);setTimeout(()=>{ui.warning.classList.remove('show');if((game.state==='playing'||game.state==='paused')&&game.bossWarned&&!game.boss)createBoss();},2600);}
    if(game.boss||game.time>63)return;
    game.spawnClock-=dt;
    if(game.spawnClock<=0){
      const tier=game.time<18?0:game.time<38?1:2;
      const count=Math.random()<(tier*.16+.12)?2:1;
      for(let i=0;i<count;i++){
        const roll=Math.random(),type=tier===0?'drone':roll<.2?'dart':tier===2&&roll>.76?'spinner':'drone';
        createEnemy(type,THREE.MathUtils.randFloat(-3.7,3.7)+(i?i*.7:0));
      }
      game.spawnClock=Math.max(.38,1.45-game.time*.012)*THREE.MathUtils.randFloat(.72,1.25);
    }
    game.pickupClock-=dt;if(game.pickupClock<=0){createPickup(THREE.MathUtils.randFloat(-3.3,3.3));game.pickupClock=THREE.MathUtils.randFloat(10,14);}
  }

  function updatePlayer(dt) {
    const ud=player.userData;ud.fireClock=Math.max(0,(ud.fireClock||0)-dt);
    const aspect=innerWidth/innerHeight,boundX=aspect<1.4?5.7:7.15;
    if(game.pointerActive){
      ud.target.x=THREE.MathUtils.clamp(input.pointerX*boundX,-boundX,-1.1);
      ud.target.y=THREE.MathUtils.clamp(input.pointerY*4.25,-4.05,4.05);
      ud.velocity.x+=(ud.target.x-player.position.x)*dt*16;ud.velocity.y+=(ud.target.y-player.position.y)*dt*16;
    } else {
      ud.velocity.x+=(input.right-input.left)*24*dt;ud.velocity.y+=(input.up-input.down)*24*dt;
    }
    const damping=Math.pow(.0007,dt);ud.velocity.multiplyScalar(damping);
    const max=8.5;if(ud.velocity.length()>max)ud.velocity.setLength(max);
    player.position.x=THREE.MathUtils.clamp(player.position.x+ud.velocity.x*dt,-boundX,1.8);
    player.position.y=THREE.MathUtils.clamp(player.position.y+ud.velocity.y*dt,-4.05,4.05);
    player.rotation.x=THREE.MathUtils.lerp(player.rotation.x,-ud.velocity.y*.055,dt*9);
    player.rotation.y=THREE.MathUtils.lerp(player.rotation.y,ud.velocity.x*.035,dt*8);
    player.rotation.z=THREE.MathUtils.lerp(player.rotation.z,ud.velocity.y*-.07,dt*9);
    ud.flame.scale.y=.85+Math.random()*.45;ud.shield.visible=game.shield>0;ud.shield.rotation.x+=dt;ud.shield.rotation.y-=dt*.65;
    player.visible=game.invulnerable>0?Math.floor(game.invulnerable*14)%2===0:true;
    if(input.firing||('ontouchstart'in window))firePlayer();
    game.trailClock-=dt;if(game.trailClock<=0){
      game.trailClock=.035;const p=mesh(GEO.orb,mat.cyan,effects);p.position.copy(player.position);p.position.x-=1.25;p.scale.set(.25,.25,.25);p.userData={vx:-3,vy:THREE.MathUtils.randFloatSpread(.5),vz:0,life:.32,maxLife:.32,spin:0};particles.push(p);
    }
  }

  function updateEnemies(dt) {
    for(let i=enemies.length-1;i>=0;i--){
      const e=enemies[i],u=e.userData;u.age+=dt;u.fire-=dt;
      if(u.type==='boss'){
        e.position.x=THREE.MathUtils.lerp(e.position.x,5.4,dt*.52);e.position.y=Math.sin(u.age*.72)*2.1;
        e.rotation.x+=dt*.18;e.children.forEach(c=>{if(c.userData.ring){c.rotation.x+=dt*.25;c.rotation.z+=dt*.16;}});
        u.core.scale.setScalar(.95+Math.sin(u.age*6)*.1);u.iris.rotation.x+=dt*1.8;
        const ratio=u.hp/u.maxHp;u.phase=ratio<.34?2:ratio<.68?1:0;
        if(u.fire<=0&&e.position.x<7){
          if(u.phase===0){for(let k=-1;k<=1;k++)fireEnemy(e,Math.PI+k*.28,6.3);u.fire=1.05;}
          else if(u.phase===1){for(let k=0;k<8;k++)fireEnemy(e,Math.PI*2*k/8+u.age*.35,5.2);u.fire=1.3;}
          else {for(let k=-2;k<=2;k++)fireEnemy(e,Math.atan2(player.position.y-e.position.y,player.position.x-e.position.x)+k*.16,7.4);u.fire=.72;}
        }
      } else {
        e.position.x-=u.speed*dt;
        if(u.type==='drone'){e.position.y=u.baseY+Math.sin(u.age*3+u.baseY)*.62;e.rotation.x+=dt*2.6;e.rotation.y+=dt*.9;}
        if(u.type==='dart'){e.position.y+=Math.sin(u.age*4)*dt*.8;e.rotation.x=Math.sin(u.age*3)*.18;}
        if(u.type==='spinner'){e.rotation.z+=dt*2.3;e.position.y=u.baseY+Math.sin(u.age*1.8)*1.05;if(u.fire<=0&&e.position.x<7){fireEnemy(e);u.fire=1.8;}}
      }
      if(dist2(e,player)<(u.radius+.43)**2){hitPlayer(e);if(u.type!=='boss')killEnemy(e,i);continue;}
      if(!u.near&&e.position.x<player.position.x&&Math.abs(e.position.y-player.position.y)<u.radius+1.05){u.near=true;game.score+=75;game.chainClock=Math.max(game.chainClock,1);toast('NEAR TRACE +75');}
      if(e.position.x<-10){removeFrom(enemies,i,e);}
    }
  }

  function updateShots(dt) {
    for(let i=shots.length-1;i>=0;i--){
      const b=shots[i],u=b.userData;u.age+=dt;b.position.x+=u.vx*dt;b.position.y+=u.vy*dt;b.rotation.x+=dt*8;
      let hit=false;
      for(let j=enemies.length-1;j>=0;j--){const e=enemies[j];if(dist2(b,e)<(u.radius+e.userData.radius)**2){e.userData.hp-=u.damage;burst(b.position,mat.cyan,3,2);removeFrom(shots,i,b);hit=true;if(e.userData.hp<=0)killEnemy(e,j);else if(e.userData.type==='boss')game.shake=.035;break;}}
      if(!hit&&b.position.x>12)removeFrom(shots,i,b);
    }
    for(let i=enemyShots.length-1;i>=0;i--){const b=enemyShots[i],u=b.userData;u.age+=dt;b.position.x+=u.vx*dt;b.position.y+=u.vy*dt;b.rotation.z+=dt*7;if(dist2(b,player)<(.42+u.radius)**2){hitPlayer(b);removeFrom(enemyShots,i,b);continue;}if(Math.abs(b.position.x)>12||Math.abs(b.position.y)>7||u.age>6)removeFrom(enemyShots,i,b);}
  }

  function updatePickups(dt){for(let i=pickups.length-1;i>=0;i--){const p=pickups[i],u=p.userData;u.age+=dt;p.position.x-=3.5*dt;p.position.y+=Math.sin(u.age*2.5)*dt*.35;p.rotation.x+=dt;p.rotation.y-=dt*1.4;u.core.scale.setScalar(1+Math.sin(u.age*7)*.14);if(dist2(p,player)<1.15**2){collectPickup(p,i);continue;}if(p.position.x<-10)removeFrom(pickups,i,p);}}

  function updateParticles(dt){for(let i=particles.length-1;i>=0;i--){const p=particles[i],u=p.userData;u.life-=dt;if(u.ringBlast){const t=1-u.life/u.maxLife;p.scale.setScalar(u.base*(1+t*4));p.material.opacity=(u.life/u.maxLife)*.75;}else{p.position.x+=u.vx*dt;p.position.y+=u.vy*dt;p.position.z+=u.vz*dt;p.rotation.x+=u.spin*dt;p.rotation.z+=u.spin*dt*.7;p.scale.multiplyScalar(Math.pow(.09,dt));if(p.material.transparent)p.material.opacity=Math.max(0,u.life/u.maxLife);}if(u.life<=0)removeFrom(particles,i,p);}}

  function updateWorld(dt) {
    const stars=world.children.find(c=>c.userData.stars);if(stars){const a=stars.geometry.attributes.position.array;for(let i=0;i<a.length;i+=3){a[i]-=dt*(2.5+(-a[i+2])*.07);if(a[i]<-36)a[i]=36;}stars.geometry.attributes.position.needsUpdate=true;}
    for(const s of structures){s.position.x-=game.speed*dt*s.userData.speed;if(s.position.x<-18){s.position.x+=structures.length*(s.userData.kind==='tower'?8:6.2);if(s.userData.kind==='tower'){s.position.y=(Math.random()>.5?1:-1)*THREE.MathUtils.randFloat(5.8,7);}}if(s.userData.kind==='ring')s.rotation.z+=dt*.05;}
  }

  function tick(t) {
    requestAnimationFrame(tick);const now=t*.001,dt=Math.min(.033,tick.last?now-tick.last:.016);tick.last=now;
    if(game.state==='playing'){
      game.time+=dt;game.speed=5.2+Math.min(2.5,game.time*.035);game.invulnerable=Math.max(0,game.invulnerable-dt);
      if(game.chainClock>0){game.chainClock-=dt;if(game.chainClock<=0){game.chain=1;updateHUD();}}
      spawnLogic(dt);updatePlayer(dt);updateEnemies(dt);updateShots(dt);updatePickups(dt);updateParticles(dt);updateWorld(dt);
      game.displayScore=THREE.MathUtils.lerp(game.displayScore,game.score,dt*8);ui.score.textContent=Math.round(game.displayScore).toString().padStart(6,'0');ui.chain.textContent=`CHAIN ×${game.chain}`;
      if(game.boss){ui.progress.style.width=`${Math.max(0,game.boss.userData.hp/game.boss.userData.maxHp*100)}%`;ui.progress.style.background='var(--hot)';ui.sector.textContent='HEAVY SIGNAL // FORGE WARDEN';}
      else {ui.progress.style.width=`${Math.min(100,game.time/66*100)}%`;ui.progress.style.background='';ui.sector.textContent=game.time<24?'SECTOR 01 // THE GLASS VEIL':game.time<46?'SECTOR 02 // LATTICE GRAVE':'SECTOR 03 // MACHINE-DARK';}
    } else if(game.state==='menu'){updateWorld(dt*.28);player.rotation.x=Math.sin(now*.8)*.08;player.position.y=Math.sin(now*.65)*.3;player.userData.flame.scale.y=.9+Math.random()*.3;}
    else if(game.state==='won'||game.state==='over'){updateParticles(dt);updateWorld(dt*.22);}
    ui.flash.style.opacity=Math.max(0,(parseFloat(ui.flash.style.opacity)||0)-dt*2.8);
    game.shake=THREE.MathUtils.lerp(game.shake,0,dt*9);camera.position.x=(Math.random()-.5)*game.shake;camera.position.y=.3+(Math.random()-.5)*game.shake;camera.position.z=15+(Math.random()-.5)*game.shake*.4;
    renderer.render(scene,camera);
  }

  function setPointer(e){const r=canvas.getBoundingClientRect();input.pointerX=((e.clientX-r.left)/r.width)*2-1;input.pointerY=-(((e.clientY-r.top)/r.height)*2-1);game.pointerActive=true;}
  window.addEventListener('pointermove',e=>{if(game.state==='playing')setPointer(e);});
  window.addEventListener('pointerdown',e=>{if(game.state==='playing'){setPointer(e);input.firing=true;sound.init();}});
  window.addEventListener('pointerup',()=>input.firing=false);
  const keyMap={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
  window.addEventListener('keydown',e=>{
    if(keyMap[e.code]){input[keyMap[e.code]]=1;game.pointerActive=false;e.preventDefault();}
    if(e.code==='Space'){input.firing=true;e.preventDefault();}
    if((e.code==='KeyP'||e.code==='Escape')&&(game.state==='playing'||game.state==='paused'))togglePause();
    if(e.code==='Enter'&&(game.state==='menu'||game.state==='over'||game.state==='won'))resetGame();
  });
  window.addEventListener('keyup',e=>{if(keyMap[e.code])input[keyMap[e.code]]=0;if(e.code==='Space')input.firing=false;});
  window.addEventListener('blur',()=>{if(game.state==='playing')togglePause();});

  function togglePause(){if(game.state==='playing'){game.state='paused';ui.pause.classList.add('active');}else if(game.state==='paused'){game.state='playing';ui.pause.classList.remove('active');sound.init();}}
  $('#start').addEventListener('click',resetGame);$('#restart').addEventListener('click',resetGame);$('#resume').addEventListener('click',togglePause);
  window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.state==='playing')togglePause();});
  updateHUD();requestAnimationFrame(tick);
})();
