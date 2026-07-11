const planets = [
  {name:'Mercury',color:'linear-gradient(135deg,#c5bdb4,#575159)',tagline:'Small, speedy, and closest to the Sun.',distance:'1st from Sun',day:'59 Earth days',year:'88 Earth days',moons:'0 moons',wow:'Mercury races around the Sun faster than any other planet.',size:38,temp:167,yearNum:88},
  {name:'Venus',color:'linear-gradient(135deg,#f0ce79,#b86c36)',tagline:'The hottest planet, wrapped in thick clouds.',distance:'2nd from Sun',day:'243 Earth days',year:'225 Earth days',moons:'0 moons',wow:'Venus spins backward compared with most planets — and its day is longer than its year!',size:95,temp:464,yearNum:225},
  {name:'Earth',color:'linear-gradient(135deg,#47d2ad 20%,#267bd1 45%,#163e99)',tagline:'Our one-of-a-kind ocean world.',distance:'3rd from Sun',day:'24 hours',year:'365 days',moons:'1 moon',wow:'Earth is the only world we know with life — and oceans cover most of it.',size:100,temp:15,yearNum:365},
  {name:'Mars',color:'linear-gradient(135deg,#e98255,#802d27)',tagline:'The rusty red world with giant volcanoes.',distance:'4th from Sun',day:'24.6 hours',year:'687 Earth days',moons:'2 moons',wow:'Mars has Olympus Mons, the largest volcano in the whole solar system.',size:53,temp:-65,yearNum:687},
  {name:'Jupiter',color:'repeating-linear-gradient(#e6c09b 0 7px,#9d6451 8px 12px,#ebd0ab 13px 18px)',tagline:'The giant king of the planets.',distance:'5th from Sun',day:'10 hours',year:'12 Earth years',moons:'101 moons',wow:'Jupiter’s Great Red Spot is a storm wider than Earth that has raged for centuries.',size:1120,temp:-110,yearNum:4333},
  {name:'Saturn',color:'linear-gradient(135deg,#f0da99,#ad8553)',tagline:'The dazzling world with icy rings.',distance:'6th from Sun',day:'11 hours',year:'29 Earth years',moons:'274 moons',wow:'Saturn’s rings are made of countless pieces of ice and rock.',size:945,temp:-140,yearNum:10759},
  {name:'Uranus',color:'linear-gradient(135deg,#b8ffff,#4bb9c8)',tagline:'The pale ice giant that rolls sideways.',distance:'7th from Sun',day:'17 hours',year:'84 Earth years',moons:'28 moons',wow:'Uranus is tilted so far over that it spins almost completely on its side.',size:401,temp:-195,yearNum:30687},
  {name:'Neptune',color:'linear-gradient(135deg,#7098ff,#1f43b8)',tagline:'The windy blue world at the edge.',distance:'8th from Sun',day:'16 hours',year:'165 Earth years',moons:'16 moons',wow:'Neptune has the fastest winds in the solar system — faster than a jet plane.',size:388,temp:-200,yearNum:60190}
];

const quiz = [
  {icon:'☀',q:'Which object is the star at the center of our solar system?',a:['The Moon','The Sun','Earth','Jupiter'],correct:1,explain:'Correct! The Sun is our star, and every planet orbits it.'},
  {icon:'🌍',q:'Which planet is our home and the only world known to have life?',a:['Earth','Mars','Venus','Neptune'],correct:0,explain:'Yes! Earth has liquid water, air, and life.'},
  {icon:'◉',q:'Which planet is the biggest in our solar system?',a:['Mercury','Saturn','Earth','Jupiter'],correct:3,explain:'Right! Jupiter is the giant king of the planets.'},
  {icon:'♨',q:'Which planet is the hottest?',a:['Mercury','Venus','Mars','Uranus'],correct:1,explain:'You got it! Venus’s thick atmosphere traps lots of heat.'},
  {icon:'🪐',q:'Which planet is famous for its bright, icy rings?',a:['Saturn','Mars','Earth','Mercury'],correct:0,explain:'Exactly! Saturn has a spectacular system of icy rings.'},
  {icon:'↻',q:'What path does a planet follow around the Sun?',a:['A crater','A galaxy','An orbit','A ring'],correct:2,explain:'Mission success! A planet travels around the Sun in an orbit.'}
];

const state={selected:2,visited:new Set(),sound:true,quizIndex:0,score:0,answering:false};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

function showScreen(name){
  $$('.screen').forEach(s=>s.classList.remove('active'));
  const target=$(`#${name}Screen`); if(target) target.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  $$('.tool-switcher button').forEach(b=>b.classList.toggle('active',b.dataset.tool===name));
  if(name==='quiz') startQuiz();
}

function buildRail(){
  $('#planetRail').innerHTML=planets.map((p,i)=>`<button class="rail-planet ${i===state.selected?'active':''} ${state.visited.has(i)?'visited':''}" data-index="${i}" role="listitem" aria-label="Explore ${p.name}"><i class="rail-orb" style="--planet:${p.color}"></i><span>${p.name.toUpperCase()}</span></button>`).join('');
  $$('.rail-planet').forEach(b=>b.addEventListener('click',()=>selectPlanet(+b.dataset.index)));
}

function selectPlanet(i){
  state.selected=i; const p=planets[i]; state.visited.add(i); buildRail(); updateProgress();
  $('#planetKicker').textContent=`PLANET ${i+1} OF 8`; $('#planetName').textContent=p.name; $('#planetTagline').textContent=p.tagline; $('#wowFact').textContent=p.wow;
  $('#factGrid').innerHTML=[['PLACE',p.distance],['DAY',p.day],['YEAR',p.year],['MOONS',p.moons]].map(x=>`<div class="fact-card"><span>${x[0]}</span><b>${x[1]}</b></div>`).join('');
  const orb=$('#bigPlanet'); orb.className=`big-planet ${p.name.toLowerCase()}`; orb.style.background=p.color;
  $('#stampBtn').classList.toggle('collected',localStamps().includes(i)); $('#stampBtn span').textContent=localStamps().includes(i)?'STAMP COLLECTED':'COLLECT PLANET STAMP'; $('#stampBtn b').textContent=localStamps().includes(i)?'✓':'＋';
}

function localStamps(){try{return JSON.parse(localStorage.getItem('stellarStamps')||'[]')}catch{return[]}}
function saveStamp(){const stamps=localStamps();if(!stamps.includes(state.selected)){stamps.push(state.selected);localStorage.setItem('stellarStamps',JSON.stringify(stamps));const p=planets[state.selected];$('#toast p').textContent=`${p.name} added to your passport.`;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2700);playTone(620);playTone(820,.15)}selectPlanet(state.selected);updateProgress();buildPassport()}
function updateProgress(){const n=localStamps().length;$('#progressFill').style.width=`${n/8*100}%`;$('#progressText').textContent=`${n} / 8`;$('#badgeCount').textContent=n}
function buildPassport(){const stamps=localStamps();$('#stampGrid').innerHTML=planets.map((p,i)=>`<div class="stamp ${stamps.includes(i)?'collected':''}" style="--planet:${p.color}"><i></i><b>${p.name.toUpperCase()}</b></div>`).join('');$('#passportNote').textContent=stamps.length===8?'All worlds collected — you’re ready for the final flight check!':`${8-stamps.length} planet stamp${8-stamps.length===1?'':'s'} left to collect.`}

function speak(text){if(!state.sound||!('speechSynthesis'in window))return; speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.9;u.pitch=1.08;speechSynthesis.speak(u)}
function playTone(freq=440,delay=0){if(!state.sound)return;setTimeout(()=>{try{const c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(.06,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.25);o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+.26)}catch{}},delay*1000)}

const compareConfigs={
 size:{title:'BIGGEST TO SMALLEST',sub:'Each circle shows a planet’s width',icon:'◉',note:'Jupiter is so big that more than 1,000 Earths could fit inside it!',value:p=>p.size,label:p=>p.name==='Earth'?'1× Earth':p.size<100?`${p.size}% Earth`:`${(p.size/100).toFixed(1)}× Earth`,bar:false},
 temp:{title:'HOTTEST TO COLDEST',sub:'Average surface or cloud-top temperature',icon:'♨',note:'Venus is hotter than Mercury because its thick air traps heat like a blanket.',value:p=>p.temp+210,label:p=>`${p.temp}°C`,bar:true},
 year:{title:'SHORTEST TO LONGEST YEAR',sub:'Time to travel once around the Sun',icon:'↻',note:'The farther a planet is from the Sun, the longer its journey around the Sun takes.',value:p=>Math.log10(p.yearNum)*45,label:p=>p.yearNum<1000?`${p.yearNum} days`:`${Math.round(p.yearNum/365)} years`,bar:true}
};
function renderCompare(type='size'){const c=compareConfigs[type];let sorted=[...planets].sort((a,b)=>c.value(b)-c.value(a));const max=Math.max(...sorted.map(c.value));$('#compareTitle').textContent=c.title;$('#compareSubtitle').textContent=c.sub;$('#compareIcon').textContent=c.icon;$('#labNote p').innerHTML=`<b>SCOUT TIP</b><br>${c.note}`;$('#comparisonChart').innerHTML=sorted.map(p=>{const px=type==='size'?18+Math.sqrt(c.value(p)/max)*175:15+(c.value(p)/max)*185;return `<div class="chart-item"><span class="chart-value">${c.label(p)}</span><i class="${c.bar?'chart-bar':'chart-orb'}" style="--size:${px}px;--planet:${p.color}"></i><b class="chart-name">${p.name.toUpperCase()}</b></div>`}).join('')}

function startQuiz(){state.quizIndex=0;state.score=0;state.answering=false;$('#quizContent').classList.remove('hidden');$('#quizResult').classList.add('hidden');renderQuestion()}
function renderQuestion(){const q=quiz[state.quizIndex];$('#quizCounter').textContent=`${state.quizIndex+1} / ${quiz.length}`;$('#quizProgress').style.width=`${(state.quizIndex+1)/quiz.length*100}%`;$('#questionIcon').textContent=q.icon;$('#questionText').textContent=q.q;$('#answerFeedback').textContent='';$('#answers').innerHTML=q.a.map((a,i)=>`<button class="answer-btn" data-answer="${i}"><b>${String.fromCharCode(65+i)}</b>${a}</button>`).join('');$$('.answer-btn').forEach(b=>b.addEventListener('click',()=>answerQuestion(+b.dataset.answer)))}
function answerQuestion(i){if(state.answering)return;state.answering=true;const q=quiz[state.quizIndex],buttons=$$('.answer-btn');buttons[i].classList.add(i===q.correct?'correct':'wrong');buttons[q.correct].classList.add('correct');if(i===q.correct){state.score++;playTone(650);playTone(850,.12)}else playTone(190);$('#answerFeedback').textContent=i===q.correct?q.explain:`Good try! ${q.explain}`;speak($('#answerFeedback').textContent);setTimeout(()=>{state.quizIndex++;state.answering=false;if(state.quizIndex<quiz.length)renderQuestion();else finishQuiz()},1900)}
function finishQuiz(){$('#quizContent').classList.add('hidden');$('#quizResult').classList.remove('hidden');$('#scoreLine').textContent=`You got ${state.score} of ${quiz.length} right. ${state.score===quiz.length?'Perfect flight!':'Great exploring — every try makes your brain stronger!'}`;playTone(523);playTone(659,.15);playTone(784,.3)}

function modal(id,open=true){$(id).classList.toggle('hidden',!open)}
$('#launchBtn').onclick=$('#launchCue').onclick=$('#modalLaunch').onclick=()=>{modal('#howModal',false);showScreen('explorer');selectPlanet(state.selected)};
$('#howBtn').onclick=()=>modal('#howModal');$('#closeHow').onclick=()=>modal('#howModal',false);$('#passportBtn').onclick=()=>{buildPassport();modal('#passportModal')};$('#closePassport').onclick=()=>modal('#passportModal',false);
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.go==='home'?'home':'explorer')));
$$('.tool-switcher button').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.tool)));
$('#stampBtn').onclick=saveStamp;$('#spinBtn').onclick=()=>{const el=$('#bigPlanet');el.classList.remove('spin');void el.offsetWidth;el.classList.add('spin');playTone(330)};
$('#listenBtn').onclick=()=>{const p=planets[state.selected];speak(`${p.name}. ${p.tagline} It is the ${p.distance}. One day lasts ${p.day}, and one year lasts ${p.year}. It has ${p.moons}. Wow fact: ${p.wow}`)};
$('#questionListen').onclick=()=>speak(quiz[state.quizIndex].q+' '+quiz[state.quizIndex].a.join(', '));
$('#soundBtn').onclick=()=>{state.sound=!state.sound;$('#soundBtn').classList.toggle('muted',!state.sound);$('#soundBtn').textContent=state.sound?'♪':'×'};
$('#replayQuiz').onclick=startQuiz;
$$('#compareTabs button').forEach(b=>b.addEventListener('click',()=>{$$('#compareTabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderCompare(b.dataset.compare)}));
$$('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.add('hidden')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')$$('.modal').forEach(m=>m.classList.add('hidden'))});

function starfield(){const canvas=$('#starfield'),ctx=canvas.getContext('2d');let stars=[];function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);stars=Array.from({length:Math.min(220,innerWidth/5)},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.2+.15,a:Math.random()*.7+.15,d:Math.random()*.008+.002}))}function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);stars.forEach(s=>{s.a+=s.d;if(s.a>.9||s.a<.1)s.d*=-1;ctx.fillStyle=`rgba(205,220,255,${s.a})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()});requestAnimationFrame(draw)}addEventListener('resize',resize);resize();draw()}
buildRail();selectPlanet(2);renderCompare();buildPassport();starfield();
