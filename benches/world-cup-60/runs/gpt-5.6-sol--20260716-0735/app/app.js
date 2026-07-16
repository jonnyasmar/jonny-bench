const matchText = `
Group A|Jun 11|Mexico|2-0|South Africa|
Group A|Jun 12|South Korea|2-1|Czechia|
Group B|Jun 12|Canada|1-1|Bosnia & Herzegovina|
Group D|Jun 13|United States|4-1|Paraguay|
Group B|Jun 13|Qatar|1-1|Switzerland|
Group C|Jun 13|Brazil|1-1|Morocco|
Group C|Jun 14|Haiti|0-1|Scotland|
Group D|Jun 14|Australia|2-0|Türkiye|
Group E|Jun 14|Germany|7-1|Curaçao|
Group F|Jun 14|Netherlands|2-2|Japan|
Group E|Jun 15|Ivory Coast|1-0|Ecuador|
Group F|Jun 15|Sweden|5-1|Tunisia|
Group H|Jun 15|Spain|0-0|Cape Verde|
Group G|Jun 15|Egypt|1-1|Belgium|
Group H|Jun 15|Saudi Arabia|1-1|Uruguay|
Group G|Jun 16|Iran|2-2|New Zealand|
Group I|Jun 16|France|3-1|Senegal|
Group I|Jun 16|Iraq|1-4|Norway|
Group J|Jun 17|Argentina|3-0|Algeria|
Group J|Jun 17|Austria|3-1|Jordan|
Group K|Jun 17|Portugal|1-1|DR Congo|
Group L|Jun 17|England|4-2|Croatia|
Group L|Jun 17|Ghana|1-0|Panama|
Group K|Jun 17|Colombia|3-1|Uzbekistan|
Group A|Jun 18|Czechia|1-1|South Africa|
Group B|Jun 18|Switzerland|4-1|Bosnia & Herzegovina|
Group B|Jun 18|Canada|6-0|Qatar|
Group A|Jun 18|Mexico|1-0|South Korea|
Group D|Jun 19|United States|2-0|Australia|
Group C|Jun 19|Scotland|0-1|Morocco|
Group C|Jun 19|Brazil|3-0|Haiti|
Group D|Jun 19|Türkiye|0-1|Paraguay|
Group F|Jun 20|Netherlands|5-1|Sweden|
Group E|Jun 20|Germany|2-1|Ivory Coast|
Group E|Jun 20|Ecuador|0-0|Curaçao|
Group F|Jun 20|Tunisia|0-4|Japan|
Group H|Jun 21|Spain|4-0|Saudi Arabia|
Group G|Jun 21|Belgium|0-0|Iran|
Group H|Jun 21|Uruguay|2-2|Cape Verde|
Group G|Jun 21|New Zealand|1-3|Egypt|
Group J|Jun 22|Argentina|2-0|Austria|
Group I|Jun 22|France|3-0|Iraq|
Group I|Jun 22|Norway|3-2|Senegal|
Group J|Jun 22|Jordan|1-2|Algeria|
Group K|Jun 23|Portugal|5-0|Uzbekistan|
Group L|Jun 23|England|0-0|Ghana|
Group L|Jun 23|Croatia|1-0|Panama|
Group K|Jun 23|Colombia|1-0|DR Congo|
Group B|Jun 24|Bosnia & Herzegovina|3-1|Qatar|
Group B|Jun 24|Switzerland|2-1|Canada|
Group C|Jun 24|Morocco|4-2|Haiti|
Group C|Jun 24|Scotland|0-3|Brazil|
Group A|Jun 25|South Africa|1-0|South Korea|
Group A|Jun 25|Czechia|0-3|Mexico|
Group E|Jun 25|Curaçao|0-2|Ivory Coast|
Group E|Jun 25|Ecuador|2-1|Germany|
Group F|Jun 25|Japan|1-1|Sweden|
Group F|Jun 25|Tunisia|1-3|Netherlands|
Group D|Jun 25|Türkiye|3-2|United States|
Group D|Jun 25|Paraguay|0-0|Australia|
Group I|Jun 26|Norway|1-4|France|
Group I|Jun 26|Senegal|5-0|Iraq|
Group H|Jun 26|Cape Verde|0-0|Saudi Arabia|
Group H|Jun 26|Uruguay|0-1|Spain|
Group G|Jun 26|New Zealand|1-5|Belgium|
Group G|Jun 26|Egypt|1-1|Iran|
Group L|Jun 27|Panama|0-2|England|
Group L|Jun 27|Croatia|2-1|Ghana|
Group K|Jun 27|Colombia|0-0|Portugal|
Group K|Jun 27|DR Congo|3-1|Uzbekistan|
Group J|Jun 27|Algeria|3-3|Austria|
Group J|Jun 27|Jordan|1-3|Argentina|
Round of 32|Jun 28|South Africa|0-1|Canada|
Round of 32|Jun 29|Brazil|2-1|Japan|
Round of 32|Jun 29|Germany|1-1|Paraguay|PAR 4-3 pens
Round of 32|Jun 29|Netherlands|1-1|Morocco|MAR 3-2 pens
Round of 32|Jun 30|Ivory Coast|1-2|Norway|
Round of 32|Jun 30|France|3-0|Sweden|
Round of 32|Jun 30|Mexico|2-0|Ecuador|
Round of 32|Jul 01|England|2-1|DR Congo|
Round of 32|Jul 01|Belgium|3-2|Senegal|AET
Round of 32|Jul 01|United States|2-0|Bosnia & Herzegovina|
Round of 32|Jul 02|Spain|3-0|Austria|
Round of 32|Jul 02|Portugal|2-1|Croatia|
Round of 32|Jul 02|Switzerland|2-0|Algeria|
Round of 32|Jul 03|Australia|1-1|Egypt|EGY 4-2 pens
Round of 32|Jul 03|Argentina|3-2|Cape Verde|AET
Round of 32|Jul 03|Colombia|1-0|Ghana|
Round of 16|Jul 04|Canada|0-3|Morocco|
Round of 16|Jul 04|France|1-0|Paraguay|
Round of 16|Jul 05|Brazil|1-2|Norway|
Round of 16|Jul 05|Mexico|2-3|England|
Round of 16|Jul 06|Portugal|0-1|Spain|
Round of 16|Jul 06|United States|1-4|Belgium|
Round of 16|Jul 07|Argentina|3-2|Egypt|
Round of 16|Jul 07|Switzerland|0-0|Colombia|SUI 4-3 pens
Quarter-finals|Jul 09|France|2-0|Morocco|
Quarter-finals|Jul 10|Spain|2-1|Belgium|
Quarter-finals|Jul 11|Norway|1-2|England|AET
Quarter-finals|Jul 11|Argentina|3-1|Switzerland|AET
Semi-finals|Jul 14|France|0-2|Spain|
Semi-finals|Jul 15|England|1-2|Argentina|
`.trim();

const matches = matchText.split('\n').map((line, index) => {
  const [stage, date, home, score, away, note] = line.split('|');
  const [hg, ag] = score.split('-').map(Number);
  return { index: index + 1, stage, date, home, score, away, note, hg, ag };
});

const flags = {
  'Mexico':'🇲🇽','South Africa':'🇿🇦','South Korea':'🇰🇷','Czechia':'🇨🇿','Canada':'🇨🇦','Bosnia & Herzegovina':'🇧🇦','United States':'🇺🇸','Paraguay':'🇵🇾','Qatar':'🇶🇦','Switzerland':'🇨🇭','Brazil':'🇧🇷','Morocco':'🇲🇦','Haiti':'🇭🇹','Scotland':'🏴󠁧󠁢󠁳󠁣󠁴󠁿','Australia':'🇦🇺','Türkiye':'🇹🇷','Germany':'🇩🇪','Curaçao':'🇨🇼','Netherlands':'🇳🇱','Japan':'🇯🇵','Ivory Coast':'🇨🇮','Ecuador':'🇪🇨','Sweden':'🇸🇪','Tunisia':'🇹🇳','Spain':'🇪🇸','Cape Verde':'🇨🇻','Egypt':'🇪🇬','Belgium':'🇧🇪','Saudi Arabia':'🇸🇦','Uruguay':'🇺🇾','Iran':'🇮🇷','New Zealand':'🇳🇿','France':'🇫🇷','Senegal':'🇸🇳','Iraq':'🇮🇶','Norway':'🇳🇴','Argentina':'🇦🇷','Algeria':'🇩🇿','Austria':'🇦🇹','Jordan':'🇯🇴','Portugal':'🇵🇹','DR Congo':'🇨🇩','England':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','Croatia':'🇭🇷','Ghana':'🇬🇭','Panama':'🇵🇦','Colombia':'🇨🇴','Uzbekistan':'🇺🇿'
};
const codes = {'United States':'USA','South Africa':'RSA','South Korea':'KOR','Bosnia & Herzegovina':'BIH','Ivory Coast':'CIV','New Zealand':'NZL','Saudi Arabia':'KSA','Cape Verde':'CPV','DR Congo':'COD','Curaçao':'CUW','Türkiye':'TUR'};
const codeFor = team => codes[team] || team.slice(0,3).toUpperCase();
const totalGoals = matches.reduce((sum, match) => sum + match.hg + match.ag, 0);

const r32Teams = new Set(matches.filter(m => m.stage === 'Round of 32').flatMap(m => [m.home, m.away]));
const groupMatches = matches.filter(m => m.stage.startsWith('Group'));
const groups = {};
for (const match of groupMatches) {
  if (!groups[match.stage]) groups[match.stage] = {};
  for (const [team, gf, ga] of [[match.home,match.hg,match.ag],[match.away,match.ag,match.hg]]) {
    groups[match.stage][team] ||= { team, p:0, gd:0, gf:0 };
    const row = groups[match.stage][team];
    row.gf += gf; row.gd += gf-ga; row.p += gf > ga ? 3 : gf === ga ? 1 : 0;
  }
}
for (const key of Object.keys(groups)) groups[key] = Object.values(groups[key]).sort((a,b)=>b.p-a.p || b.gd-a.gd || b.gf-a.gf);

const chapters = [
  { id:'opening', label:'OPENING', start:0, end:6, render: renderOpening },
  { id:'scale', label:'THE SCALE', start:6, end:14, render: renderScale },
  { id:'groups', label:'GROUPS', start:14, end:23, render: renderGroups },
  { id:'moments', label:'MOMENTS', start:23, end:32, render: renderMoments },
  { id:'cut', label:'THE CUT', start:32, end:39, render: renderCut },
  { id:'knockout', label:'KNOCKOUT', start:39, end:49, render: renderKnockout },
  { id:'scorers', label:'GOLDEN BOOT', start:49, end:55, render: renderScorers },
  { id:'final', label:'THE FINAL', start:55, end:60, render: renderFinal }
];

const scene = document.querySelector('#scene');
const broadcast = document.querySelector('#broadcast');
const scrubber = document.querySelector('#scrubber');
const progress = document.querySelector('#timelineProgress');
const timeNow = document.querySelector('#timeNow');
const playButton = document.querySelector('#playButton');
const speedButton = document.querySelector('#speedButton');
let currentTime = 0, playing = true, speed = 1, lastFrame = performance.now(), activeChapter = -1;

function renderOpening() {
  return `<div class="scene-inner intro-layout">
    <div><p class="eyebrow reveal-up">60 SECONDS · ONE UNFINISHED STORY</p>
      <h1 class="display reveal-up delay-1">The world<br><span class="stroke">came to play.</span></h1>
      <p class="lede reveal-up delay-2">The biggest World Cup ever is down to two. Here is how <b class="accent">48 nations</b> became Spain vs Argentina.</p>
    </div>
    <div class="intro-meta reveal-up delay-3"><div class="meta-line"><span>HOSTS</span><b>03</b></div><div class="meta-line"><span>DAYS PLAYED</span><b>35</b></div><div class="meta-line"><span>MATCHES LEFT</span><b>02</b></div></div>
    <div class="giant-26">26</div>
  </div>`;
}

function renderScale() {
  return `<div class="scene-inner"><div class="split-head reveal-up"><div><p class="eyebrow">JUNE 11 — JULY 15</p><h2>A continent-sized<br>tournament.</h2></div><div class="mini-stat"><b>98%</b>PLAYED</div></div>
    <div class="stat-grid">
      ${[[48,'TEAMS'],[102,'MATCHES PLAYED'],[totalGoals,'GOALS SCORED'],[16,'HOST CITIES']].map((x,i)=>`<div class="stat-card reveal-up delay-${i+1}"><div class="stat-number">${x[0]}</div><div class="stat-label">${x[1]}</div></div>`).join('')}
    </div>
    <div class="host-strip reveal-up delay-4"><div class="host-pill">🇨🇦 CANADA <b>R16</b></div><div class="host-pill">🇲🇽 MEXICO <b>R16</b></div><div class="host-pill">🇺🇸 UNITED STATES <b>R16</b></div></div>
  </div>`;
}

function renderGroups() {
  const cards = Object.entries(groups).map(([name, rows]) => `<div class="group-card reveal-up"><h3>${name.toUpperCase()}</h3>${rows.map(row=>`<div class="group-team ${r32Teams.has(row.team)?'advanced':''}"><strong>${r32Teams.has(row.team)?'<i class="qual-dot"></i>':''}${flags[row.team]} ${shortName(row.team)}</strong><span>${row.p}P</span></div>`).join('')}</div>`).join('');
  return `<div class="scene-inner"><div class="split-head"><div><p class="eyebrow reveal-up">THE GROUP STAGE</p><h2 class="reveal-up delay-1">12 groups.<br>Zero safe bets.</h2></div><div class="mini-stat reveal-up delay-2"><b>72</b>MATCHES</div></div><div class="groups-grid">${cards}</div></div>`;
}

function shortName(team) { return team.replace('Bosnia & Herzegovina','Bosnia').replace('United States','USA').replace('South Korea','Korea').replace('Saudi Arabia','Saudi').replace('Ivory Coast','Côte d’Ivoire'); }

function renderMoments() {
  const moments = [
    ['Canada makes history','First men’s World Cup win','6–0'],
    ['Germany runs riot','The tournament’s biggest score','7–1'],
    ['Cape Verde holds Spain','Debutants stop the European champs','0–0'],
    ['Ecuador stuns Germany','Group E ends upside down','2–1'],
    ['Messi turns back time','Hat-trick in Argentina’s opener','3 GOALS']
  ];
  return `<div class="scene-inner moments-layout"><div><p class="eyebrow reveal-up">THE GROUP STAGE, REMEMBERED</p><h2 class="display reveal-up delay-1" style="font-size:clamp(54px,8vw,108px)">Firsts.<br><span class="stroke">Shockwaves.</span></h2><div class="moment-score reveal-up delay-2"><div class="score-team">🇨🇦 CANADA<small>JONATHAN DAVID HAT-TRICK</small></div><div class="score-big">6—0</div><div class="score-team">🇶🇦 QATAR<small>JUNE 18 · VANCOUVER</small></div></div></div><div class="moment-stack">${moments.map((m,i)=>`<div class="moment-card reveal-up delay-${Math.min(i+1,4)}"><div class="moment-index">0${i+1}</div><div><h3>${m[0]}</h3><p>${m[1]}</p></div><div class="moment-result">${m[2]}</div></div>`).join('')}</div></div>`;
}

function renderCut() {
  const allTeams = [...new Set(groupMatches.flatMap(m=>[m.home,m.away]))];
  return `<div class="scene-inner field-layout"><div class="field-copy"><p class="eyebrow reveal-up">JUNE 28 · THE KNOCKOUTS BEGIN</p><h2 class="reveal-up delay-1">48<br><span class="accent">↓</span><br>32</h2><p class="reveal-up delay-2">Sixteen nations went home. The first-ever Round of 32 arrived—and penalties immediately took Germany and the Netherlands.</p></div><div class="team-field">${allTeams.map((team,i)=>`<div class="team-dot ${r32Teams.has(team)?'alive':'out'} reveal-up" style="animation-delay:${Math.min(i*.014,.5)}s" data-code="${codeFor(team)}" title="${team}">${flags[team]}</div>`).join('')}</div></div>`;
}

function matchBox(a,as,b,bs,winner) { return `<div class="bracket-match"><b class="${winner===a?'winner':''}"><span>${flags[a]} ${shortName(a)}</span><span>${as}</span></b><b class="${winner===b?'winner':''}"><span>${flags[b]} ${shortName(b)}</span><span>${bs}</span></b></div>`; }
function renderKnockout() {
  return `<div class="scene-inner bracket-layout"><p class="eyebrow reveal-up">THE FINAL EIGHT</p><h2 class="reveal-up delay-1">Giants fell. Two paths remained.</h2><div class="bracket reveal-up delay-2">
    <div class="bracket-col qf-col">${matchBox('France',2,'Morocco',0,'France')}${matchBox('Spain',2,'Belgium',1,'Spain')}${matchBox('Norway',1,'England',2,'England')}${matchBox('Argentina',3,'Switzerland',1,'Argentina')}</div><div class="bracket-arrow">›</div>
    <div class="bracket-col">${matchBox('France',0,'Spain',2,'Spain')}${matchBox('England',1,'Argentina',2,'Argentina')}</div><div class="bracket-arrow">›</div>
    <div class="bracket-col final-col">${matchBox('Spain','—','Argentina','—','')}</div>
  </div><p class="bracket-kicker">Norway ended Brazil’s dream · Spain ended Ronaldo’s · Argentina overturned Egypt and England late</p></div>`;
}

function renderScorers() {
  const scorers = [['Lionel Messi','ARGENTINA',8],['Kylian Mbappé','FRANCE',8],['Erling Haaland','NORWAY',7],['Harry Kane','ENGLAND',6],['Jude Bellingham','ENGLAND',6],['Mikel Oyarzabal','SPAIN',5]];
  return `<div class="scene-inner scorers-layout"><div><p class="eyebrow reveal-up">THE GOLDEN BOOT RACE</p><h2 class="reveal-up delay-1">Eight<br>apiece.</h2><p class="boot-note reveal-up delay-2">Messi’s four assists put him ahead on the tie-break. Mbappé has one match left; Messi has the final.</p></div><div class="scorer-bars">${scorers.map((s,i)=>`<div class="scorer-row reveal-up delay-${Math.min(i+1,4)}"><div class="scorer-name">${s[0]}<small>${s[1]}</small></div><div class="scorer-track"><div class="scorer-fill" style="--goals:${s[2]}"></div></div><div class="scorer-goals">${s[2]}</div></div>`).join('')}</div></div>`;
}

function renderFinal() {
  return `<div class="scene-inner final-layout"><div class="final-label reveal-up">SUNDAY · THE FINAL</div><div class="final-matchup"><div class="final-team reveal-up delay-1"><div class="final-flag">🇪🇸</div><h2>Spain</h2><p><b>13</b> SCORED · <b>1</b> CONCEDED · UNBEATEN</p></div><div class="versus reveal-up delay-2">VS</div><div class="final-team reveal-up delay-1"><div class="final-flag">🇦🇷</div><h2>Argentina</h2><p><b>19</b> SCORED · <b>7</b> CONCEDED · PERFECT</p></div></div><p class="final-date reveal-up delay-3">JULY 19 <span>•</span> NEW YORK NEW JERSEY <span>•</span> 3 PM ET</p><div class="bronze-note reveal-up delay-4">BEFORE THAT: 🇫🇷 FRANCE vs ENGLAND 🏴 · JULY 18 · MIAMI</div></div>`;
}

function setChapter(index) {
  if (index === activeChapter) return;
  activeChapter = index;
  scene.classList.remove('is-active');
  setTimeout(() => {
    scene.innerHTML = chapters[index].render();
    scene.classList.add('is-active');
  }, 180);
  document.querySelectorAll('.chapter-label').forEach((el,i)=>el.classList.toggle('active',i===index));
}

function setTime(value, fromUser=false) {
  currentTime = Math.max(0, Math.min(60, value));
  const chapterIndex = Math.min(chapters.length-1, chapters.findIndex(ch => currentTime >= ch.start && currentTime < ch.end) === -1 ? chapters.length-1 : chapters.findIndex(ch => currentTime >= ch.start && currentTime < ch.end));
  setChapter(chapterIndex);
  progress.style.width = `${currentTime/60*100}%`;
  scrubber.value = currentTime;
  const seconds = Math.floor(currentTime);
  timeNow.textContent = `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
  if (currentTime >= 60 && !fromUser) { playing = false; broadcast.classList.add('is-paused'); playButton.setAttribute('aria-label','Replay story'); }
}

function frame(now) {
  const dt = Math.min((now-lastFrame)/1000,.1); lastFrame = now;
  if (playing) setTime(currentTime + dt*speed);
  requestAnimationFrame(frame);
}

document.querySelector('#chapterLabels').innerHTML = chapters.map((ch,i)=>`<span class="chapter-label" style="left:${ch.start/60*100}%">${ch.label}</span>`).join('');
playButton.addEventListener('click',()=>{
  if (currentTime >= 60) setTime(0,true);
  playing = !playing; broadcast.classList.toggle('is-paused',!playing); playButton.setAttribute('aria-label',playing?'Pause story':'Play story'); lastFrame=performance.now();
});
scrubber.addEventListener('input',e=>setTime(Number(e.target.value),true));
scrubber.addEventListener('pointerdown',()=>{ playing=false; broadcast.classList.add('is-paused'); });
const speeds=[1,1.5,2,.5];
speedButton.addEventListener('click',()=>{ speed=speeds[(speeds.indexOf(speed)+1)%speeds.length]; speedButton.textContent=`${speed}×`; });
document.querySelector('.brand').addEventListener('click',e=>{ e.preventDefault(); setTime(0,true); playing=true; broadcast.classList.remove('is-paused'); });
document.addEventListener('keydown',e=>{
  if(e.key===' '){ e.preventDefault(); playButton.click(); }
  if(e.key==='ArrowRight'){ const next=chapters.find(ch=>ch.start>currentTime+.2); setTime(next?next.start:60,true); }
  if(e.key==='ArrowLeft'){ const prev=[...chapters].reverse().find(ch=>ch.start<currentTime-.2); setTime(prev?prev.start:0,true); }
  if(e.key==='Escape' && panel.classList.contains('open')) closePanel();
});

// Full results explorer
const panel=document.querySelector('#resultsPanel');
let wasPlaying=true;
document.querySelector('#panelStats').innerHTML=`<div class="panel-stat"><b>${matches.length}</b><span>PLAYED</span></div><div class="panel-stat"><b>${totalGoals}</b><span>GOALS</span></div><div class="panel-stat"><b>${(totalGoals/matches.length).toFixed(2)}</b><span>PER MATCH</span></div>`;
const filters=['All','Groups','Round of 32','Round of 16','Quarter-finals','Semi-finals'];
document.querySelector('#filterRow').innerHTML=filters.map((f,i)=>`<button class="filter-button ${i===0?'active':''}" data-filter="${f}">${f}</button>`).join('');
function renderResults(filter='All'){
  const visible=matches.filter(m=>filter==='All'||(filter==='Groups'&&m.stage.startsWith('Group'))||m.stage===filter);
  const sections={}; visible.forEach(m=>(sections[m.stage]||=[]).push(m));
  document.querySelector('#resultsList').innerHTML=Object.entries(sections).map(([stage,rows])=>`<section class="result-section"><h3>${stage.toUpperCase()} · ${rows.length} MATCHES</h3>${rows.map(m=>`<div class="result-row"><span class="result-date">${m.date}</span><span class="result-home">${flags[m.home]} ${shortName(m.home)}</span><span class="result-score">${m.score}${m.note?`<small>${m.note}</small>`:''}</span><span>${flags[m.away]} ${shortName(m.away)}</span></div>`).join('')}</section>`).join('');
}
renderResults();
document.querySelector('#filterRow').addEventListener('click',e=>{ const b=e.target.closest('[data-filter]'); if(!b)return; document.querySelectorAll('.filter-button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); renderResults(b.dataset.filter); });
function openPanel(){ wasPlaying=playing; playing=false; broadcast.classList.add('is-paused'); panel.classList.add('open'); panel.setAttribute('aria-hidden','false'); document.querySelector('.close-button').focus(); }
function closePanel(){ panel.classList.remove('open'); panel.setAttribute('aria-hidden','true'); playing=wasPlaying; broadcast.classList.toggle('is-paused',!playing); }
document.querySelector('#exploreButton').addEventListener('click',openPanel);
document.querySelectorAll('[data-close-panel]').forEach(el=>el.addEventListener('click',closePanel));

setTime(0);
requestAnimationFrame(frame);
setTimeout(()=>document.querySelector('#skipHint').style.opacity='0',5000);
