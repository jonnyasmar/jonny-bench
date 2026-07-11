/* ============================================================
   Space Kids! — all content data (bodies, quiz, badges)
   ============================================================ */

// order: position in the "grand tour" / prev-next cycle (Sun=0, Moon tucked after Earth)
// planetNum: 1-8 for real planets, null for Sun/Moon
const BODIES = [
  {
    id: 'sun', name: 'The Sun', kind: 'star', tagline: 'Our Star!',
    order: 0, planetNum: null, sizeEarths: 109, mapSize: 92, color: '#ffb300',
    facts: [
      '☀️ The Sun is a STAR — a giant ball of super-hot, glowing gas!',
      '🌱 It gives Earth light and warmth so plants, animals, and YOU can live.',
      '😲 More than one MILLION Earths could fit inside the Sun!',
      '👀 Never look right at the Sun — it is too bright for your eyes!',
    ],
    sizeFact: 'The Sun is SO big that more than one million Earths could fit inside it. This is just its edge!',
  },
  {
    id: 'mercury', name: 'Mercury', kind: 'rocky', tagline: 'The Speedy One!',
    order: 1, planetNum: 1, sizeEarths: 0.38, mapSize: 30, periodSec: 16, color: '#b0aca6',
    facts: [
      '🏃 Mercury is the SMALLEST planet and the closest one to the Sun.',
      '💨 It zooms around the Sun faster than any other planet — one year there takes only 88 days!',
      '🕳️ It is covered in craters, just like our Moon.',
      '🌡️ It is burning hot in the day and freezing cold at night!',
    ],
    sizeFact: 'Mercury is the smallest planet — it is not much bigger than our Moon!',
  },
  {
    id: 'venus', name: 'Venus', kind: 'rocky', tagline: 'The Hottest Planet!',
    order: 2, planetNum: 2, sizeEarths: 0.95, mapSize: 42, periodSec: 24, color: '#e8b465',
    facts: [
      '🔥 Venus is the HOTTEST planet — its thick clouds trap heat like a big cozy blanket!',
      '🔄 It spins backwards! On Venus, the Sun rises in the west.',
      '✨ It shines so bright that you can see it from your backyard in the evening sky.',
      '👯 Venus is almost the same size as Earth — they are like twins!',
    ],
    sizeFact: 'Venus is almost the same size as Earth — they are like twins!',
  },
  {
    id: 'earth', name: 'Earth', kind: 'rocky', tagline: 'Our Home!',
    order: 3, planetNum: 3, sizeEarths: 1, mapSize: 44, periodSec: 33, color: '#4fa8e8',
    facts: [
      '🏠 Earth is OUR home — the only place we know with people, animals, and plants!',
      '💧 It looks blue from space because it is mostly covered in water.',
      '🌙 Earth has one Moon that circles around us.',
      '🌬️ Earth has just the right air to breathe and is not too hot or too cold. Perfect!',
    ],
    sizeFact: 'This is Earth, our home! We compare all the other planets to it.',
  },
  {
    id: 'moon', name: 'The Moon', kind: 'moon', tagline: "Earth's Best Friend!",
    order: 3.5, planetNum: null, sizeEarths: 0.27, mapSize: 16, periodSec: 6, color: '#cfcdc7',
    facts: [
      '🌙 The Moon circles around the Earth — it is our closest space neighbor.',
      '👨‍🚀 Astronauts flew there in a rocket and walked on it! The first was Neil Armstrong.',
      '👣 The Moon has no air and no wind, so footprints there can last millions of years!',
      '🌗 It seems to change shape in our sky, from a thin banana to a big round circle.',
    ],
    sizeFact: 'The Moon is little — about four Moons would fit across the Earth!',
  },
  {
    id: 'mars', name: 'Mars', kind: 'rocky', tagline: 'The Red Planet!',
    order: 4, planetNum: 4, sizeEarths: 0.53, mapSize: 36, periodSec: 44, color: '#e0653a',
    facts: [
      '🔴 Mars looks red because it is covered in rusty red dust.',
      '🤖 Robot rovers are driving around on Mars RIGHT NOW, exploring for us!',
      '🌋 Mars has the biggest volcano in the whole solar system — Olympus Mons!',
      '🌙 It has two tiny moons shaped like potatoes.',
    ],
    sizeFact: 'Mars is about half as wide as Earth.',
  },
  {
    id: 'jupiter', name: 'Jupiter', kind: 'gas', tagline: 'The Giant!',
    order: 5, planetNum: 5, sizeEarths: 11.2, mapSize: 74, periodSec: 60, color: '#d9a066',
    facts: [
      '🐘 Jupiter is the BIGGEST planet — more than 1,300 Earths could fit inside it!',
      '🌀 Its Great Red Spot is a giant storm bigger than Earth that has been swirling for hundreds of years!',
      '💨 Jupiter is a gas giant — it is made mostly of gas, so you could not stand on it!',
      '🌙 It has about 95 moons!',
    ],
    sizeFact: 'Jupiter is the BIGGEST planet — more than 1,300 Earths could fit inside it!',
  },
  {
    id: 'saturn', name: 'Saturn', kind: 'gas', tagline: 'The Ring King!',
    order: 6, planetNum: 6, sizeEarths: 9.4, mapSize: 64, periodSec: 76, color: '#e7cf8f',
    facts: [
      '💍 Saturn has beautiful rings made of billions of pieces of sparkly ice and rock!',
      '🛁 Saturn is so light it could float in a giant bathtub of water!',
      '🌙 It has more than 140 moons — one of them, Titan, even has lakes!',
      '💨 Saturn is a gas giant, like Jupiter.',
    ],
    sizeFact: 'Saturn is the second biggest planet — and its rings stretch even wider!',
  },
  {
    id: 'uranus', name: 'Uranus', kind: 'ice', tagline: 'The Sideways Planet!',
    order: 7, planetNum: 7, sizeEarths: 4.0, mapSize: 52, periodSec: 92, color: '#7adfe2',
    facts: [
      '🤸 Uranus spins lying on its side — it rolls around the Sun like a ball!',
      '🥶 It is an ice giant — super cold and blue-green.',
      '🟢 Its pretty color comes from a gas called methane.',
      '🌙 It has 28 known moons and faint rings too!',
    ],
    sizeFact: 'Uranus is four times wider than Earth.',
  },
  {
    id: 'neptune', name: 'Neptune', kind: 'ice', tagline: 'The Windy One!',
    order: 8, planetNum: 8, sizeEarths: 3.9, mapSize: 50, periodSec: 110, color: '#4a7bd8',
    facts: [
      '🥇 Neptune is the planet FARTHEST from the Sun.',
      '🌬️ It has the fastest winds in the solar system — much faster than a jet plane!',
      '🔵 It is a deep blue ice giant — dark and freezing cold.',
      '🐌 One year on Neptune takes 165 Earth years!',
    ],
    sizeFact: 'Neptune is almost four times wider than Earth.',
  },
];

const BODY = {};
BODIES.forEach((b) => { BODY[b.id] = b; });

// The 8 planets in order from the Sun
const PLANETS = BODIES.filter((b) => b.planetNum).sort((a, b) => a.planetNum - b.planetNum);

const ORDINALS = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

const MNEMONIC = [
  { word: 'My', planet: 'mercury' },
  { word: 'Very', planet: 'venus' },
  { word: 'Excellent', planet: 'earth' },
  { word: 'Mother', planet: 'mars' },
  { word: 'Just', planet: 'jupiter' },
  { word: 'Served', planet: 'saturn' },
  { word: 'Us', planet: 'uranus' },
  { word: 'Noodles!', planet: 'neptune' },
];

/* Quiz questions.
   choices: strings starting with '#' are body ids (rendered as planet balls);
   anything else is a plain text answer. First choice is always the correct
   one — the game shuffles them. `yay` is spoken on a correct answer. */
const QUIZ = [
  { q: 'Which planet do we live on?', choices: ['#earth', '#mars', '#neptune'], yay: 'Yes! Earth is our home!' },
  { q: 'Which planet is called the Red Planet?', choices: ['#mars', '#jupiter', '#earth'], yay: 'Yes! Mars is the Red Planet!' },
  { q: 'Which planet has beautiful icy rings?', choices: ['#saturn', '#mercury', '#venus'], yay: 'Yes! Saturn is the Ring King!' },
  { q: 'Which planet is the BIGGEST of all?', choices: ['#jupiter', '#mars', '#mercury'], yay: 'Yes! Jupiter is the giant of the solar system!' },
  { q: 'Which planet is closest to the Sun?', choices: ['#mercury', '#neptune', '#saturn'], yay: 'Yes! Speedy Mercury is closest to the Sun!' },
  { q: 'What is the Sun?', choices: ['A star ⭐', 'A planet 🪐', 'A moon 🌙'], yay: 'Yes! The Sun is a star — a giant ball of hot glowing gas!' },
  { q: 'Which planet spins lying on its side?', choices: ['#uranus', '#venus', '#earth'], yay: 'Yes! Uranus is the sideways planet!' },
  { q: 'Which planet is the HOTTEST?', choices: ['#venus', '#neptune', '#uranus'], yay: 'Yes! Venus is the hottest — its thick clouds trap the heat!' },
  { q: 'Which planet is FARTHEST from the Sun?', choices: ['#neptune', '#mercury', '#venus'], yay: 'Yes! Neptune is the farthest planet!' },
  { q: 'Which planet is the SMALLEST?', choices: ['#mercury', '#jupiter', '#saturn'], yay: 'Yes! Little Mercury is the smallest planet!' },
  { q: 'How many planets are in our solar system?', choices: ['Eight — 8!', 'Three — 3', 'One hundred — 100'], yay: 'Yes! There are eight planets in our solar system!' },
  { q: 'What circles around the Earth?', choices: ['#moon', '#sun', '#jupiter'], yay: 'Yes! The Moon goes around and around the Earth!' },
  { q: 'Robot rovers are exploring which planet right now?', choices: ['#mars', '#venus', '#neptune'], yay: 'Yes! Robots are driving on Mars right now!' },
  { q: 'Which planet is so light it could float in a giant bathtub?', choices: ['#saturn', '#earth', '#mercury'], yay: 'Yes! Saturn could float in water!' },
  { q: 'Which planet has the fastest winds?', choices: ['#neptune', '#earth', '#venus'], yay: 'Yes! Windy Neptune has the fastest winds of all!' },
  { q: 'Which planet has a giant storm called the Great Red Spot?', choices: ['#jupiter', '#mars', '#uranus'], yay: "Yes! Jupiter's Great Red Spot is a storm bigger than Earth!" },
  { q: 'Which one is a STAR, not a planet?', choices: ['#sun', '#earth', '#mars'], yay: 'Yes! The Sun is a star!' },
  { q: 'Which planet comes right after Earth, going away from the Sun?', choices: ['#mars', '#venus', '#jupiter'], yay: 'Yes! Mars comes right after Earth!' },
  { q: 'What do we call the Sun and everything that travels around it?', choices: ['The solar system 🌞', 'A big city 🏙️', 'The ocean 🌊'], yay: 'Yes! The Sun and its family of planets is called the solar system!' },
  { q: 'What does the Sun give the Earth?', choices: ['Light and warmth ☀️', 'Rocks and sand 🪨', 'Pizza 🍕'], yay: 'Yes! The Sun gives us light and warmth!' },
];

const BADGES = [
  { id: 'explorer', emoji: '🔭', name: 'Space Explorer', how: 'Visit the Sun, the Moon, and all 8 planets in Explore Space.' },
  { id: 'tourist', emoji: '🚀', name: 'Grand Tourist', how: 'Ride the Grand Tour all the way to Neptune.' },
  { id: 'parade', emoji: '🪐', name: 'Planet Parade', how: 'Put all 8 planets in order from the Sun.' },
  { id: 'paradePerfect', emoji: '🌟', name: 'Order Master', how: 'Finish the Planet Parade with no mistakes!' },
  { id: 'quizStar', emoji: '⭐', name: 'Quiz Star', how: 'Get 6 or more right in one Space Quiz.' },
  { id: 'quizChamp', emoji: '🏆', name: 'Quiz Champion', how: 'Get ALL 8 quiz questions right!' },
  { id: 'sizeWizard', emoji: '📏', name: 'Size Wizard', how: 'Tap every world in Big & Small.' },
  { id: 'expert', emoji: '🌈', name: 'Solar System Expert', how: 'Collect every other sticker!' },
];
