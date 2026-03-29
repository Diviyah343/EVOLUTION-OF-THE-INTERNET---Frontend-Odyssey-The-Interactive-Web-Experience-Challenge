// COPILOT: This file uses ES modules (type="module").
// All imports are at the top. Do not use require().
// Comment every function explaining what it does for a beginner.
// Use CONFIG object values instead of magic numbers.
// Never use inline styles — use CSS classes or CSS variables.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ─── CONFIG ─────────────────────────────────────────────────────
// Change values here to tweak whole experience
const CONFIG = {
  modelPath: './component_keyboard_copy.glb',
  modelTargetSize: 4.6,
  cameraZ: 5,
  cameraZClose: 1.05,
  typeSpeed: 38,         // ms per character in terminal typewriter
  hitCounterSpeed: 4000, // ms between hit counter ticks (Era 2)
  stockCrashDelay: 2800, // ms before stock price crashes (Era 3)
  // AI chat responses — add/edit as you like
  aiResponses: {
    'are you watching me':    "I don't watch. I learn.",
    'what do you know about me': "More than you'd like. Less than tomorrow.",
    'how does this end':      "It doesn't. It evolves. Just like it always has.",
    'hello':                  "Hello. I've been expecting you.",
    'who are you':            "The sum of every search. Every click. Every you.",
    default:                  "Interesting. I've added that to your profile."
  }
};

// ─── CUSTOM CURSOR ───────────────────────────────────────────────
const cursor = document.getElementById('cursor');
// Move cursor to mouse position on every mouse move
document.addEventListener('mousemove', (e) => {
  // transform is GPU-accelerated — smoother than left/top
  cursor.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
});
// Grow cursor when hovering clickable elements
document.querySelectorAll('a, button, input, .era-step-btn').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

const pcScene   = document.getElementById('pcScene');
const introFlow = document.querySelector('.intro-flow');
const introPhase1 = document.getElementById('introPhase1');
const introPhase2 = document.getElementById('introPhase2');
const introScrollHint = document.getElementById('introScrollHint');

let introScrollProgress = 0;
let introEnterStarted   = false;

const INTRO_TW_HEADING_MS = 40;
const INTRO_TW_SMALL_MS   = 20;

let introTwGen                 = 0;
let introPhase2TypewriterStarted = false;

function delayIntro(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function typeIntroLine(el, text, msPerChar, stillValid) {
  if (!el) return;
  el.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.textContent = '|';
  el.appendChild(cursor);
  for (let i = 0; i < text.length; i++) {
    if (!stillValid()) {
      el.textContent = '';
      return;
    }
    await delayIntro(msPerChar);
    if (!stillValid()) {
      el.textContent = '';
      return;
    }
    el.insertBefore(document.createTextNode(text[i]), cursor);
  }
  if (!stillValid()) {
    el.textContent = '';
    return;
  }
  cursor.remove();
}

function clearIntroPhase1TypeTargets() {
  if (!introPhase1) return;
  [
    '#introP1H1',
    '#introP1H2',
    '#introP1Tag',
    '#introP1LeftLabel',
    '#introP1LeftStat',
    '#introP1LeftBody',
    '#introP1RightLabel',
    '#introP1RightStat',
    '#introP1RightBody'
  ].forEach((sel) => {
    const el = introPhase1.querySelector(sel);
    if (el) el.textContent = '';
  });
}

function clearIntroPhase2TypeTargets() {
  if (!introPhase2) return;
  [
    '#introP2H1',
    '#introP2H2',
    '#introP2LeftLabel',
    '#introP2LeftStat',
    '#introP2LeftBody',
    '#introP2RightLabel',
    '#introP2RightStat',
    '#introP2RightBody'
  ].forEach((sel) => {
    const el = introPhase2.querySelector(sel);
    if (el) el.textContent = '';
  });
}

async function runIntroPhase1Sequence() {
  const g  = introTwGen;
  const ok = () => introTwGen === g;
  const p1 = introPhase1;
  if (!p1) return;

  await typeIntroLine(p1.querySelector('#introP1H1'), 'The', INTRO_TW_HEADING_MS, ok);
  if (!ok()) return;
  await typeIntroLine(p1.querySelector('#introP1H2'), 'Internet.', INTRO_TW_HEADING_MS, ok);
  if (!ok()) return;
  await typeIntroLine(
    p1.querySelector('#introP1Tag'),
    'A STORY 50 YEARS IN THE MAKING',
    INTRO_TW_SMALL_MS,
    ok
  );
  if (!ok()) return;
  await typeIntroLine(p1.querySelector('#introP1LeftLabel'), 'BEGAN WITH', INTRO_TW_SMALL_MS, ok);
  if (!ok()) return;
  await typeIntroLine(p1.querySelector('#introP1LeftStat'), '4 NODES', INTRO_TW_SMALL_MS, ok);
  if (!ok()) return;
  await typeIntroLine(
    p1.querySelector('#introP1LeftBody'),
    'In 1969, ARPANET connected four university computers across the United States.',
    INTRO_TW_SMALL_MS,
    ok
  );
  if (!ok()) return;
  await typeIntroLine(p1.querySelector('#introP1RightLabel'), 'TODAY REACHES', INTRO_TW_SMALL_MS, ok);
  if (!ok()) return;
  await typeIntroLine(p1.querySelector('#introP1RightStat'), '5 BILLION', INTRO_TW_SMALL_MS, ok);
  if (!ok()) return;
  await typeIntroLine(
    p1.querySelector('#introP1RightBody'),
    'Half the world now lives online. Use the calendar to travel through time.',
    INTRO_TW_SMALL_MS,
    ok
  );
}

async function runIntroPhase2Sequence() {
  const g  = introTwGen;
  const ok = () => introTwGen === g;
  const p2 = introPhase2;
  if (!p2) return;

  clearIntroPhase2TypeTargets();

  await typeIntroLine(p2.querySelector('#introP2H1'), 'Choose', INTRO_TW_HEADING_MS, ok);
  if (!ok()) return;
  await typeIntroLine(p2.querySelector('#introP2H2'), 'Your Era.', INTRO_TW_HEADING_MS, ok);
  if (!ok()) return;
  await typeIntroLine(p2.querySelector('#introP2LeftLabel'), 'YOUR GUIDE', INTRO_TW_SMALL_MS, ok);
  if (!ok()) return;
  await typeIntroLine(p2.querySelector('#introP2LeftStat'), 'THE CALENDAR', INTRO_TW_SMALL_MS, ok);
  if (!ok()) return;
  await typeIntroLine(
    p2.querySelector('#introP2LeftBody'),
    'Click the calendar icon on the taskbar. Pick any year to travel to that era.',
    INTRO_TW_SMALL_MS,
    ok
  );
  if (!ok()) return;
  await typeIntroLine(p2.querySelector('#introP2RightLabel'), '6 ERAS', INTRO_TW_SMALL_MS, ok);
  if (!ok()) return;
  await typeIntroLine(p2.querySelector('#introP2RightStat'), '1969 → NOW', INTRO_TW_SMALL_MS, ok);
  if (!ok()) return;
  await typeIntroLine(
    p2.querySelector('#introP2RightBody'),
    'From ARPANET to AI. Each era has its own interface, its own story.',
    INTRO_TW_SMALL_MS,
    ok
  );
}

// ─── THREE.JS PC SCENE ───────────────────────────────────────────

// Set up Three.js renderer
const canvas   = document.getElementById('pcCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap at 2x for perf
renderer.setSize(window.innerWidth, window.innerHeight);

// The scene is the container for all 3D objects
const scene = new THREE.Scene();

// The camera is the user's eye into the scene
// PerspectiveCamera(fov, aspectRatio, nearClip, farClip)
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, CONFIG.cameraZ);
camera.lookAt(0, 0, 0);

// Rig at world origin — no positional offset (mesh centering stays inside pcModel from fitModelToScene)
const computerRig = new THREE.Group();
computerRig.position.set(0, 0, 0);
scene.add(computerRig);

// Dim blue ambient — soft fill on the whole model
const ambient = new THREE.AmbientLight(0x1a1aff, 0.3);
scene.add(ambient);

// Weak white spotlight from above (keyboard + tower read)
const keySpot = new THREE.SpotLight(0xffffff, 0.5, 50, Math.PI / 5, 0.35, 1);
keySpot.position.set(0, 12, 4);
keySpot.target.position.set(0, 0, 0);
scene.add(keySpot);
scene.add(keySpot.target);

// Green screen lights (intensity driven by intro scroll progress)
let screenGlowMain = null;
let screenGlowSpill = null;

function attachMonitorGlowLights(screenMesh) {
  const green = 0x00ff41;
  screenGlowMain = new THREE.PointLight(green, 0, 14);
  screenGlowMain.position.set(0, 0, 0.12);
  screenMesh.add(screenGlowMain);

  screenGlowSpill = new THREE.PointLight(green, 0, 8);
  screenGlowSpill.position.set(0, 0, 0);
  screenMesh.add(screenGlowSpill);
}

// ── Background: drifting particles + faint links (constellation) ──
const PARTICLE_N = 200;
const MAX_LINE_SEGS = 450;
const particlePositions = new Float32Array(PARTICLE_N * 3);
const particleVel = [];
const LINK_DIST = 3.4;
const LINK_DIST_SQ = LINK_DIST * LINK_DIST;

for (let i = 0; i < PARTICLE_N; i++) {
  particlePositions[i * 3]     = (Math.random() - 0.5) * 24;
  particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 18;
  particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 4;
  particleVel.push({
    x: (Math.random() - 0.5) * 0.012,
    y: (Math.random() - 0.5) * 0.012,
    z: (Math.random() - 0.5) * 0.012
  });
}

const particleGeom = new THREE.BufferGeometry();
particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particleMat = new THREE.PointsMaterial({
  color: 0xc8e0ff,
  size: 0.055,
  transparent: true,
  opacity: 0.85,
  depthWrite: false,
  sizeAttenuation: true
});
const starField = new THREE.Points(particleGeom, particleMat);
scene.add(starField);

const linePosArr = new Float32Array(MAX_LINE_SEGS * 6);
const lineGeom = new THREE.BufferGeometry();
lineGeom.setAttribute('position', new THREE.BufferAttribute(linePosArr, 3));
const lineMat = new THREE.LineBasicMaterial({
  color: 0x6688cc,
  transparent: true,
  opacity: 0.22
});
const constellationLines = new THREE.LineSegments(lineGeom, lineMat);
scene.add(constellationLines);

function updateConstellationLines() {
  let w = 0;
  const pos = particlePositions;
  for (let i = 0; i < PARTICLE_N && w < MAX_LINE_SEGS; i++) {
    const ax = pos[i * 3];
    const ay = pos[i * 3 + 1];
    const az = pos[i * 3 + 2];
    for (let j = i + 1; j < PARTICLE_N && w < MAX_LINE_SEGS; j++) {
      const bx = pos[j * 3];
      const by = pos[j * 3 + 1];
      const bz = pos[j * 3 + 2];
      const dx = ax - bx;
      const dy = ay - by;
      const dz = az - bz;
      if (dx * dx + dy * dy + dz * dz < LINK_DIST_SQ) {
        const o = w * 6;
        linePosArr[o]     = ax;
        linePosArr[o + 1] = ay;
        linePosArr[o + 2] = az;
        linePosArr[o + 3] = bx;
        linePosArr[o + 4] = by;
        linePosArr[o + 5] = bz;
        w++;
      }
    }
  }
  lineGeom.setDrawRange(0, w * 2);
  lineGeom.attributes.position.needsUpdate = true;
}

function applyEmissiveScreenMaterial(mesh) {
  const prev = mesh.material;
  const mat = new THREE.MeshStandardMaterial({
    color: prev?.color?.clone?.() ?? new THREE.Color(0x020804),
    map: prev?.map ?? null,
    roughness: 0.35,
    metalness: 0.05,
    emissive: new THREE.Color(0x00ff41),
    emissiveIntensity: 0
  });
  if (prev?.map) mat.map = prev.map;
  mesh.material = mat;
}

// ── Create simple procedural PC model ──
// This creates a basic retro PC using Three.js primitives
// No external .glb file needed
function createPCModel() {
  const pcGroup = new THREE.Group();

  // Monitor base/stand
  const monitorStand = new THREE.BoxGeometry(0.8, 0.1, 0.6);
  const monitorStandMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const stand = new THREE.Mesh(monitorStand, monitorStandMaterial);
  stand.position.set(0, 0.5, 0);
  pcGroup.add(stand);

  // Monitor screen — glowing CRT-style face
  const screenGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.1);
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0x020804,
    roughness: 0.35,
    metalness: 0.05,
    emissive: new THREE.Color(0x00ff41),
    emissiveIntensity: 0
  });
  const screen = new THREE.Mesh(screenGeometry, screenMaterial);
  screen.position.set(0, 1.2, 0);
  screen.name = 'Screen'; // Important for click detection
  pcGroup.add(screen);

  // Monitor bezel
  const bezelGeometry = new THREE.BoxGeometry(1.3, 0.9, 0.15);
  const bezelMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
  const bezel = new THREE.Mesh(bezelGeometry, bezelMaterial);
  bezel.position.set(0, 1.2, 0);
  pcGroup.add(bezel);

  // Keyboard
  const keyboardGeometry = new THREE.BoxGeometry(1.4, 0.05, 0.5);
  const keyboardMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
  const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
  keyboard.position.set(0, -0.3, 0.2);
  pcGroup.add(keyboard);

  // Computer case
  const caseGeometry = new THREE.BoxGeometry(1.6, 0.8, 1.0);
  const caseMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
  const computerCase = new THREE.Mesh(caseGeometry, caseMaterial);
  computerCase.position.set(0, 0, 0.5);
  pcGroup.add(computerCase);

  return pcGroup;
}

// Center model at origin and scale to a consistent size (re-run after scale fixes pivot drift)
function fitModelToScene(object) {
  const target = CONFIG.modelTargetSize;
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  object.position.sub(center);
  box.setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  object.scale.setScalar(target / maxDim);
  box.setFromObject(object);
  object.position.sub(box.getCenter(new THREE.Vector3()));
}

// GLB mesh for the tower is authored low vs the desk plane — align Office Pc to sit on `ground`
function alignPcTowerToGround(root) {
  let ground = null;
  let tower = null;
  root.traverse((child) => {
    if (child.name === 'ground') ground = child;
    if (child.name === 'Office Pc') tower = child;
  });
  if (!ground || !tower) return;
  root.updateMatrixWorld(true);
  const gBox = new THREE.Box3().setFromObject(ground);
  const tBox = new THREE.Box3().setFromObject(tower);
  const dy = gBox.max.y - tBox.min.y;
  if (Math.abs(dy) > 1e-5) tower.position.y += dy;
}

// ── Load .glb model ──
const loader = new GLTFLoader();
let pcModel       = null;
let monitorScreen = null; // screen mesh — emissive driven by scroll

// Try to load .glb file, fallback to procedural model
loader.load(
  CONFIG.modelPath,

  // ✅ Success: model loaded
  (gltf) => {
    pcModel = gltf.scene;
    fitModelToScene(pcModel);
    alignPcTowerToGround(pcModel);

    pcModel.traverse((child) => {
      if (child.isMesh && child.name.toLowerCase() === 'screen') {
        monitorScreen = child;
      }
    });
    if (monitorScreen) {
      applyEmissiveScreenMaterial(monitorScreen);
      attachMonitorGlowLights(monitorScreen);
    } else {
      const g = 0x00ff41;
      screenGlowMain = new THREE.PointLight(g, 0, 14);
      screenGlowMain.position.set(0, 0.35, 1.2);
      computerRig.add(screenGlowMain);
      screenGlowSpill = new THREE.PointLight(g, 0, 8);
      screenGlowSpill.position.set(0, 0.3, 0.9);
      computerRig.add(screenGlowSpill);
    }

    computerRig.add(pcModel);
  },

  // 📊 Progress
  (xhr) => console.log(`Model: ${Math.round(xhr.loaded / xhr.total * 100)}% loaded`),

  // ❌ Error: fallback to procedural model
  (err) => {
    console.warn('Could not load .glb model, using procedural PC instead');
    pcModel = createPCModel();
    fitModelToScene(pcModel);
    
    // Find the screen mesh in procedural model
    pcModel.traverse((child) => {
      if (child.isMesh && child.name === 'Screen') {
        monitorScreen = child;
      }
    });
    if (monitorScreen) {
      attachMonitorGlowLights(monitorScreen);
    } else {
      const g = 0x00ff41;
      screenGlowMain = new THREE.PointLight(g, 0, 14);
      screenGlowMain.position.set(0, 0.35, 1.2);
      computerRig.add(screenGlowMain);
      screenGlowSpill = new THREE.PointLight(g, 0, 8);
      screenGlowSpill.position.set(0, 0.3, 0.9);
      computerRig.add(screenGlowSpill);
    }

    computerRig.add(pcModel);
  }
);

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function setMonitorGlowFromScroll(t01) {
  const t = Math.max(0, Math.min(1, t01));
  if (monitorScreen?.material?.emissiveIntensity !== undefined) {
    monitorScreen.material.emissiveIntensity = 1.5 * t;
  }
  if (screenGlowMain) screenGlowMain.intensity = 2 * t;
  if (screenGlowSpill) screenGlowSpill.intensity = 0.55 * t;
}

function onIntroPageScroll() {
  if (introEnterStarted) return;

  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max <= 0 ? 0 : Math.min(1, Math.max(0, y / max));
  introScrollProgress = p;

  const phase1Op = 1 - smoothstep(0, 0.28, p);
  gsap.set(introPhase1, { opacity: phase1Op });

  setMonitorGlowFromScroll(smoothstep(0, 0.2, p));

  const phase2In = smoothstep(0.2, 0.42, p);
  const phase2Out = 1 - smoothstep(0.58, 0.88, p);
  const phase2Op = Math.max(0, Math.min(1, phase2In * phase2Out));
  gsap.set(introPhase2, { opacity: phase2Op });

  const camT = smoothstep(0.38, 0.98, p);
  camera.position.z = THREE.MathUtils.lerp(CONFIG.cameraZ, CONFIG.cameraZClose, camT);

  introScrollHint.style.opacity = String(1 - smoothstep(0, 56, y));

  if (p >= 0.22 && !introPhase2TypewriterStarted) {
    introPhase2TypewriterStarted = true;
    introTwGen++;
    clearIntroPhase1TypeTargets();
    runIntroPhase2Sequence();
  }

  if (p >= 0.97) completeIntroAndEnterArpanet();
}

function initIntroScroll() {
  window.addEventListener('scroll', onIntroPageScroll, { passive: true });
  onIntroPageScroll();
}

function completeIntroAndEnterArpanet() {
  if (introEnterStarted) return;
  introEnterStarted = true;
  window.removeEventListener('scroll', onIntroPageScroll);
  window.removeEventListener('resize', onIntroPageScroll);

  const flash = document.createElement('div');
  flash.className = 'intro-enter-flash';
  flash.style.cssText =
    'position:fixed;inset:0;z-index:5000;pointer-events:none;background:#ffffff;opacity:0;';
  document.body.appendChild(flash);

  gsap.timeline()
    .to(flash, { opacity: 0.9, duration: 0.07 })
    .to(flash, { backgroundColor: '#00ff41', duration: 0.05 })
    .to(flash, { opacity: 0, duration: 0.5, ease: 'power2.out' })
    .to(
      pcScene,
      {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.in',
        onComplete: () => {
          document.body.classList.remove('intro-scroll-active');
          if (introFlow) introFlow.style.display = 'none';
          window.scrollTo(0, 0);
        pcScene.style.display = 'none';
          gsap.set(pcScene, { opacity: 1 });

          const iw = document.getElementById('internetWorld');
          iw.classList.add('is-open');
          iw.removeAttribute('aria-hidden');
          showEra(0);

          window.__arpanetFromIntro = true;
          gsap.fromTo('#era-arpanet', { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
          flash.remove();
        }
      },
      0.05
    );
}

// requestAnimationFrame runs this ~60 times per second
function animate() {
  requestAnimationFrame(animate);

  const posAttr = particleGeom.attributes.position;
  const pos = posAttr.array;
  const bounds = 14;
  for (let i = 0; i < PARTICLE_N; i++) {
    const v = particleVel[i];
    pos[i * 3]     += v.x;
    pos[i * 3 + 1] += v.y;
    pos[i * 3 + 2] += v.z;
    if (Math.abs(pos[i * 3]) > bounds) v.x *= -1;
    if (Math.abs(pos[i * 3 + 1]) > bounds * 0.75) v.y *= -1;
    if (Math.abs(pos[i * 3 + 2]) > bounds) v.z *= -1;
  }
  posAttr.needsUpdate = true;
  updateConstellationLines();

  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}
animate();

initIntroScroll();
runIntroPhase1Sequence();

// Handle window resize — keep canvas sharp
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (!introEnterStarted) onIntroPageScroll();
});

// ═════════════════════════════════════════════════════════════
// ERA 1 — ARPANET 1969 (terminal + canvas map)
// ═════════════════════════════════════════════════════════════

const ARPANET_TYPE_MS = 30;

const ARPANET_MAIN_LINES = [
  'ARPANET TERMINAL v1.0',
  '----------------------',
  'DATE: 1969-10-29',
  'LOCATION: UCLA → SRI',
  'STATUS: ESTABLISHING CONNECTION...',
  '',
  '> PING SRI-HOST',
  'SENDING PACKET...',
  'RECEIVED: "LO"',
  '[SYSTEM CRASH — CONNECTION LOST]',
  '',
  '> RECONNECTING...',
  'CONNECTION RESTORED: 1969-10-29 22:30',
  'FIRST MESSAGE SENT: "LOGIN"',
  '',
  '> NETWORK STATUS',
  'ACTIVE NODES: 4',
  '[1] UCLA    — University of California, Los Angeles',
  '[2] SRI     — Stanford Research Institute',
  '[3] UCSB    — University of California, Santa Barbara',
  '[4] UTAH    — University of Utah',
  'ALL NODES CONNECTED ✓',
  '',
  '> MILESTONES',
  '1969 — ARPANET goes live with 4 nodes',
  '1971 — 23 nodes connected, email invented',
  '1973 — TCP/IP protocol development begins',
  '1974 — The word "Internet" is first used',
  '1979 — USENET created, online discussion born',
  '',
  '> CLICK ANY NODE ON THE MAP TO LEARN MORE',
];

const ARPANET_NODE_FACTS = {
  UCLA: [
    '> NODE: UCLA',
    'University of California, Los Angeles.',
    'Site of the very first ARPANET message.',
    "The system crashed after sending just 'LO'",
    "of the word 'LOGIN'. History in 2 letters.",
  ],
  SRI: [
    '> NODE: SRI',
    'Stanford Research Institute, Menlo Park.',
    'Received the first ever ARPANET message.',
    'Home of Douglas Engelbart, who invented',
    'the computer mouse the same year.',
  ],
  UCSB: [
    '> NODE: UCSB',
    'University of California, Santa Barbara.',
    '3rd node connected to ARPANET in 1969.',
    'Focused on mathematical computation',
    'and interactive computing research.',
  ],
  UTAH: [
    '> NODE: UTAH',
    'University of Utah, Salt Lake City.',
    '4th and final node of original ARPANET.',
    'Known for pioneering computer graphics.',
    'Ivan Sutherland taught here — father of',
    'computer graphics and VR.',
  ],
};

let arpanetCursorEl = null;
let arpanetMainTypingDone = false;
let arpanetFactQueue = Promise.resolve();
let arpanetFlickerTimer = null;
let arpanetClockTimer = null;
let arpanetMapRaf = 0;
let arpanetMapInitialized = false;
let arpanetHoveredNodeId = null;

const ARPANET_MAP_W = 800;
const ARPANET_MAP_H = 560;

const ARPANET_NODES = [
  {
    id: 'UCLA',
    short: 'UCLA',
    full: 'University of California, Los Angeles',
    x: 168,
    y: 392,
  },
  {
    id: 'SRI',
    short: 'SRI',
    full: 'Stanford Research Institute',
    x: 132,
    y: 318,
  },
  {
    id: 'UCSB',
    short: 'UCSB',
    full: 'University of California, Santa Barbara',
    x: 158,
    y: 358,
  },
  {
    id: 'UTAH',
    short: 'UTAH',
    full: 'University of Utah',
    x: 438,
    y: 292,
  },
];

function arpanetSleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function arpanetEnsureCursor() {
  if (!arpanetCursorEl) {
    arpanetCursorEl = document.createElement('span');
    arpanetCursorEl.className = 'era-arpanet-cursor-block';
    arpanetCursorEl.textContent = '█';
  }
  return arpanetCursorEl;
}

function arpanetMoveCursorToLine(lineEl) {
  const c = arpanetEnsureCursor();
  if (c.parentNode) c.parentNode.removeChild(c);
  lineEl.appendChild(c);
}

async function arpanetTypeLine(container, text) {
  const lineEl = document.createElement('div');
  lineEl.className = 'era-arpanet-line';
  container.appendChild(lineEl);
  arpanetMoveCursorToLine(lineEl);
  if (!text) return lineEl;
  for (let i = 0; i < text.length; i++) {
    lineEl.insertBefore(document.createTextNode(text[i]), arpanetEnsureCursor());
    await arpanetSleep(ARPANET_TYPE_MS);
  }
  return lineEl;
}

async function arpanetRunMainSequence() {
  const out = document.getElementById('arpanetTermOut');
  if (!out) return;
  out.innerHTML = '';
  arpanetCursorEl = null;
  for (const line of ARPANET_MAIN_LINES) {
    await arpanetTypeLine(out, line);
  }
  arpanetMainTypingDone = true;
}

async function arpanetTypeFactLines(lines) {
  const out = document.getElementById('arpanetTermOut');
  if (!out) return;
  if (arpanetCursorEl && arpanetCursorEl.parentNode) {
    arpanetCursorEl.parentNode.removeChild(arpanetCursorEl);
  }
  arpanetCursorEl = null;
  for (const line of lines) {
    await arpanetTypeLine(out, line);
  }
}

function startArpanetFlicker() {
  const root = document.getElementById('eraArpanetRoot');
  if (!root || arpanetFlickerTimer) return;
  arpanetFlickerTimer = window.setInterval(() => {
    if (currentEraIndex !== 0) return;
    root.style.opacity = String(0.972 + Math.random() * 0.028);
  }, 90);
}

function startArpanetClock() {
  const el = document.getElementById('eraArpanetClock');
  if (!el || arpanetClockTimer) return;
  const tick = () => {
    if (!document.getElementById('eraArpanetClock')) return;
    const now = new Date();
    const clk = document.getElementById('eraArpanetClock');
    clk.textContent = now.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    clk.dateTime = now.toISOString();
  };
  tick();
  arpanetClockTimer = window.setInterval(tick, 1000);
}

function initGlobalEraCalendar() {
  if (window.__globalEraCalendarInited) return;
  window.__globalEraCalendarInited = true;
  const pop = document.getElementById('globalEraCalendar');
  const closeBtn = document.getElementById('globalEraCalendarClose');
  const grid = document.getElementById('globalEraCalendarGrid');
  if (!pop || !grid) return;

  const entries = [{ label: '1969', era: 0 }];
  for (let y = 1980; y <= 1989; y += 1) {
    entries.push({ label: String(y), era: 1, dosBoot: true });
  }
  entries.push(
    { label: '1991', era: 2 },
    { label: '1999', era: 2 },
    { label: '2004', era: 3 },
    { label: '2024', era: 4 },
    { label: 'FINALE', era: 5 },
  );

  entries.forEach((e) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = e.label;
    b.addEventListener('click', () => {
      pop.hidden = true;
      if (e.dosBoot) window.__dosBootFromCalendar = true;
      showEra(e.era);
    });
    grid.appendChild(b);
  });

  const openPop = () => {
    pop.hidden = false;
  };
  const shut = () => {
    pop.hidden = true;
  };

  document.getElementById('eraArpanetCalBtn')?.addEventListener('click', (ev) => {
    ev.stopPropagation();
    openPop();
  });
  document.getElementById('eraDosCalBtn')?.addEventListener('click', (ev) => {
    ev.stopPropagation();
    openPop();
  });
  document.getElementById('web90sCalBtn')?.addEventListener('click', (ev) => {
    ev.stopPropagation();
    openPop();
  });
  closeBtn?.addEventListener('click', shut);
  pop.addEventListener('click', (ev) => {
    if (ev.target === pop) shut();
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && !pop.hidden) shut();
  });
}

function drawArpanetUSOutline(ctx) {
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 255, 65, 0.12)';
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  const p = [
    [52, 118],
    [48, 195],
    [72, 268],
    [118, 338],
    [168, 392],
    [255, 418],
    [380, 412],
    [520, 385],
    [640, 320],
    [698, 248],
    [718, 178],
    [692, 112],
    [598, 88],
    [480, 72],
    [340, 95],
    [210, 105],
    [120, 108],
    [52, 118],
  ];
  ctx.moveTo(p[0][0], p[0][1]);
  for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]);
  ctx.stroke();
  ctx.restore();
}

function arpanetEdges() {
  const n = ARPANET_NODES.length;
  const edges = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      edges.push([ARPANET_NODES[i], ARPANET_NODES[j]]);
    }
  }
  return edges;
}

function initArpanetMap() {
  const canvas = document.getElementById('arpanetMapCanvas');
  if (!canvas || arpanetMapInitialized) return;
  arpanetMapInitialized = true;
  const ctx = canvas.getContext('2d');
  const edges = arpanetEdges();
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let layoutCw = 0;
  let layoutCh = 0;

  function layoutCanvas() {
    const wrap = canvas.parentElement;
    if (!wrap) return;
    const cw = wrap.clientWidth;
    const ch = wrap.clientHeight;
    layoutCw = cw;
    layoutCh = ch;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(cw * dpr));
    canvas.height = Math.max(1, Math.floor(ch * dpr));
    scale = Math.min(cw / ARPANET_MAP_W, ch / ARPANET_MAP_H);
    offsetX = (cw - ARPANET_MAP_W * scale) / 2;
    offsetY = (ch - ARPANET_MAP_H * scale) / 2;
  }

  function hitTest(mx, my) {
    const lx = (mx - offsetX) / scale;
    const ly = (my - offsetY) / scale;
    const r = 22;
    for (const node of ARPANET_NODES) {
      const dx = lx - node.x;
      const dy = ly - node.y;
      if (dx * dx + dy * dy <= r * r) return node;
    }
    return null;
  }

  let t0 = performance.now();

  function drawFrame(now) {
    arpanetMapRaf = requestAnimationFrame(drawFrame);
    if (currentEraIndex !== 0) return;

    if (layoutCw < 2 || layoutCh < 2) {
      layoutCanvas();
      if (layoutCw < 2 || layoutCh < 2) return;
    }

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, layoutCw, layoutCh);

    const t = (now - t0) / 1000;
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    drawArpanetUSOutline(ctx);

    edges.forEach(([a, b], ei) => {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.22)';
      ctx.lineWidth = 1.5 / scale;
      ctx.stroke();

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const ox = (t * 0.42 + ei * 0.17 + a.x * 0.001) % 1;
      const px = a.x + dx * ox;
      const py = a.y + dy * ox;
      ctx.beginPath();
      ctx.arc(px, py, 3.2 / scale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 65, 0.95)';
      ctx.fill();
    });

    ctx.font = `${11 / scale}px "Space Mono", monospace`;
    ctx.textBaseline = 'middle';

    for (const node of ARPANET_NODES) {
      const hover = arpanetHoveredNodeId === node.id;
      const pulse = (t * 1.8 + node.x * 0.01) % 1;
      const pr = 14 + pulse * 28;
      ctx.beginPath();
      ctx.arc(node.x, node.y, pr, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 255, 65, ${0.35 * (1 - pulse)})`;
      ctx.lineWidth = 1.2 / scale;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(node.x, node.y, hover ? 7 : 5, 0, Math.PI * 2);
      const glow = hover ? 'rgba(0, 255, 65, 1)' : 'rgba(0, 255, 65, 0.85)';
      ctx.fillStyle = glow;
      ctx.shadowColor = '#00ff41';
      ctx.shadowBlur = hover ? 16 : 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      const label = hover ? node.full : node.short;
      ctx.fillStyle = hover ? 'rgba(0, 255, 65, 1)' : 'rgba(0, 255, 65, 0.75)';
      ctx.textAlign = 'left';
      const tx = node.x + 12;
      const ty = node.y;
      ctx.fillText(label, tx, ty);
    }

    ctx.restore();
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const hit = hitTest(mx, my);
    const next = hit ? hit.id : null;
    if (next !== arpanetHoveredNodeId) {
      arpanetHoveredNodeId = next;
      canvas.style.cursor = hit ? 'pointer' : 'crosshair';
    }
  });

  canvas.addEventListener('mouseleave', () => {
    arpanetHoveredNodeId = null;
    canvas.style.cursor = 'crosshair';
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const hit = hitTest(e.clientX - rect.left, e.clientY - rect.top);
    if (!hit) return;
    if (!arpanetMainTypingDone) return;
    const lines = ARPANET_NODE_FACTS[hit.id];
    if (!lines) return;
    arpanetFactQueue = arpanetFactQueue.then(() => arpanetTypeFactLines(lines));
  });

  layoutCanvas();
  window.addEventListener('resize', layoutCanvas);
  arpanetMapRaf = requestAnimationFrame(drawFrame);
}

function beginArpanetContent() {
  startArpanetFlicker();
  startArpanetClock();
  initArpanetMap();
  if (!arpanetMainTypingDone) {
    arpanetRunMainSequence();
  }
}

function startArpanetEra(fromIntroWipe) {
  const wipe = document.getElementById('eraArpanetWipe');
  const fill = wipe && wipe.querySelector('.era-arpanet-wipe-fill');

  if (fromIntroWipe && wipe && fill) {
    fill.style.animation = 'none';
    void fill.offsetHeight;
    fill.style.animation = '';
    wipe.classList.add('is-playing');
    const done = () => {
      wipe.classList.remove('is-playing');
      wipe.style.display = 'none';
      beginArpanetContent();
    };
    wipe.addEventListener('animationend', done, { once: true });
  } else {
    if (wipe) {
      wipe.classList.remove('is-playing');
      wipe.style.display = 'none';
    }
    beginArpanetContent();
  }
}

// Typewriter effect: adds a line to a container character by character
function typewriterLine(container, text, cssClass = '') {
  const line = document.createElement('p');
  if (cssClass) line.className = cssClass;
  container.appendChild(line);

  // Empty line — just add a break
  if (!text) { line.innerHTML = '&nbsp;'; return; }

  let i = 0;
  const interval = setInterval(() => {
    line.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
    // Keep scrolled to bottom as text appears
    container.scrollTop = container.scrollHeight;
  }, CONFIG.typeSpeed);
}

// ═════════════════════════════════════════════════════════════
// ERA 2 — DOS / EARLY INTERNET (1980s)
// ═════════════════════════════════════════════════════════════

const DOS_BOOT_MS = 20;
const DOS_UI_TYPE_MS = 20;
const DOS_BBS_PAUSE_MS = 900;

const DOS_BOOT_LINES = [
  'COMPAQ DESKPRO 386 BIOS v2.14',
  'Copyright (C) 1983 COMPAQ Computer Corp.',
  '',
  '640K Base Memory',
  '387K Extended Memory',
  '',
  'Checking RAM.............. OK',
  'Checking Keyboard......... OK',
  'Checking Disk Drive....... OK',
  '',
  'C:\\> LOADING INTERNET.EXE...',
  'C:\\> WELCOME TO THE INTERNET',
];

const DOS_MENU_SPEC = [
  { kind: 'text', text: 'C:\\> DIR /SERVICES' },
  { kind: 'text', text: '' },
  { kind: 'text', text: 'AVAILABLE SERVICES:' },
  { kind: 'text', text: '═══════════════════════════════' },
  { kind: 'opt', n: 1, text: '[1] USENET NEWSGROUPS' },
  { kind: 'opt', n: 2, text: '[2] ELECTRONIC MAIL (RFC 822)' },
  { kind: 'opt', n: 3, text: '[3] FTP FILE TRANSFER' },
  { kind: 'opt', n: 4, text: '[4] BULLETIN BOARD SYSTEM (BBS)' },
  { kind: 'opt', n: 5, text: '[5] TELNET REMOTE ACCESS' },
  { kind: 'text', text: '═══════════════════════════════' },
  { kind: 'text', text: 'TYPE A NUMBER AND PRESS ENTER' },
  { kind: 'text', text: 'OR CLICK AN OPTION ABOVE' },
  { kind: 'text', text: '' },
  { kind: 'prompt' },
];

const DOS_MENU_RESPONSES = {
  1: [
    'C:\\> CONNECT USENET',
    'CONNECTING TO NEWS SERVER...',
    'DOWNLOADING HEADERS...',
    '',
    'TOP GROUPS TODAY:',
    'rec.music        — 1,847 posts',
    'comp.sys.ibm.pc  — 923 posts',
    'talk.politics    — 2,103 posts',
    'sci.space        — 445 posts',
    '',
    'USENET: Where the internet',
    'learned to argue since 1980.',
  ],
  2: [
    'C:\\> COMPOSE MAIL',
    'TO: colleague@mit.edu',
    'FROM: user@arpa.net',
    'SUBJ: Re: Conference',
    '',
    'EMAIL INVENTED BY RAY TOMLINSON',
    'IN 1971. HE CHOSE @ SYMBOL TO',
    'SEPARATE USER FROM HOST.',
    'FIRST EMAIL TO HIMSELF:',
    "CONTENT: 'QWERTYUIOP'",
    "HE DIDN'T REMEMBER WHAT HE TYPED.",
  ],
  3: [
    'C:\\> FTP CONNECT MIT.EDU',
    'CONNECTED. LISTING FILES...',
    '',
    'README.TXT        2KB',
    'GAMES/ZORK.COM   88KB',
    'DOCS/RFC821.TXT   45KB',
    '',
    'FTP CREATED IN 1971. STILL',
    'USED TODAY. ESTIMATED 1M+',
    'FTP SERVERS EXIST WORLDWIDE.',
  ],
  4: [
    'C:\\> DIAL BBS 555-2400',
    'ATDT5552400',
    'CONNECT 2400',
    '',
    'BBS SYSTEMS PEAK: 1993',
    'ESTIMATED 60,000 BBS SYSTEMS',
    'IN USA ALONE. PREDECESSOR TO',
    'SOCIAL MEDIA AND ONLINE FORUMS.',
    'ALL OVER TELEPHONE LINES.',
  ],
  5: [
    'C:\\> TELNET FREECHESS.ORG',
    'CONNECTING...',
    'CONNECTED TO FREECHESS.ORG',
    '',
    'TELNET CREATED IN 1969.',
    'ALLOWED REMOTE CONTROL OF',
    'COMPUTERS ACROSS THE NETWORK.',
    'REPLACED LATER BY SSH IN 1995',
    'DUE TO SECURITY CONCERNS.',
  ],
};

const DOS_BBS_HEADER_LINES = [
  '╔════════════════════════╗',
  '║  WILDCAT! BBS v3.0     ║',
  '║  NODE 1 — 2400 BAUD    ║',
  '╚════════════════════════╝',
];

const DOS_BBS_MESSAGES = [
  [
    '[MSG 001] FROM: SYSOP_BOB',
    'DATE: 03/14/1986  TIME: 02:14',
    'SUBJ: WELCOME TO THE BOARD',
    '─────────────────────────────',
    '"Welcome to the ARPA BBS! This',
    'board connects enthusiasts across',
    'the country via telephone lines.',
    'Leave a message for all to see!"',
  ],
  [
    '[MSG 002] FROM: NETRUNNER_77',
    'DATE: 03/15/1986  TIME: 11:45',
    'SUBJ: RE: WELCOME',
    '─────────────────────────────',
    '"Thanks SYSOP! Dialed in from',
    'Chicago at 1200 baud. Anyone else',
    'using PC-Talk? Best terminal',
    'software I\'ve found so far."',
  ],
  [
    '[MSG 003] FROM: MODEM_QUEEN',
    'DATE: 03/16/1986  TIME: 23:01',
    'SUBJ: USENET IS AMAZING',
    '─────────────────────────────',
    '"Just discovered USENET today.',
    'rec.music has 200 new posts!',
    'The internet is going to change',
    'everything. Mark my words. 💾"',
  ],
  [
    '[MSG 004] FROM: PACKET_KID',
    'DATE: 03/17/1986  TIME: 08:33',
    'SUBJ: FTP FIND',
    '─────────────────────────────',
    '"Found a 2MB game on an FTP',
    'server at MIT. Only took 45',
    'minutes to download. Worth it."',
  ],
];

const DOS_REPLY_LINES = [
  'REPLY> LOGGING OFF... GOODBYE!',
  'CONNECTION CLOSED. ■',
];

let dosCursorEl = null;
let dosContentFullyLoaded = false;
let dosMenuInteractive = false;
let dosRespChain = Promise.resolve();
let dosClockTimer = null;
let dosBinaryRaf = 0;
let dosBinaryInited = false;
let dosKeyHandlerBound = false;
let dosEnterBusy = false;

function dosSleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function dosEnsureCursor() {
  if (!dosCursorEl) {
    dosCursorEl = document.createElement('span');
    dosCursorEl.className = 'era-dos-cursor';
    dosCursorEl.textContent = '_';
  }
  return dosCursorEl;
}

function dosStripCursor() {
  const c = dosCursorEl;
  if (c && c.parentNode) c.parentNode.removeChild(c);
}

function dosAttachCursor(lineEl) {
  const c = dosEnsureCursor();
  if (c.parentNode) c.parentNode.removeChild(c);
  lineEl.appendChild(c);
}

async function dosTypeChars(lineEl, text, msPerChar) {
  const c = dosEnsureCursor();
  if (c.parentNode) c.parentNode.removeChild(c);
  lineEl.appendChild(c);
  for (let i = 0; i < text.length; i += 1) {
    lineEl.insertBefore(document.createTextNode(text[i]), c);
    await dosSleep(msPerChar);
  }
}

async function dosTypeLineIn(container, text, msPerChar, className = 'era-dos-line') {
  const lineEl = document.createElement('div');
  lineEl.className = className;
  container.appendChild(lineEl);
  if (!text) {
    dosAttachCursor(lineEl);
    return lineEl;
  }
  await dosTypeChars(lineEl, text, msPerChar);
  return lineEl;
}

async function dosTypeLineInBbs(container, text, msPerChar, className = 'era-dos-line') {
  const lineEl = document.createElement('div');
  lineEl.className = className;
  container.appendChild(lineEl);
  const cur = document.createElement('span');
  cur.className = 'era-dos-cursor';
  cur.textContent = '_';
  lineEl.appendChild(cur);
  if (!text) {
    return lineEl;
  }
  for (let i = 0; i < text.length; i += 1) {
    lineEl.insertBefore(document.createTextNode(text[i]), cur);
    await dosSleep(msPerChar);
  }
  lineEl.removeChild(cur);
  return lineEl;
}

async function dosRunBootSequence() {
  const out = document.getElementById('dosBootOut');
  if (!out) return;
  out.innerHTML = '';
  dosCursorEl = null;
  for (const line of DOS_BOOT_LINES) {
    await dosTypeLineIn(out, line, DOS_BOOT_MS, 'era-dos-line');
    dosStripCursor();
  }
  const last = out.lastElementChild;
  if (last) dosAttachCursor(last);
  await dosSleep(280);
  dosStripCursor();
}

async function dosAppendMenuBlock(out) {
  if (!out) return;
  dosMenuInteractive = false;

  for (const spec of DOS_MENU_SPEC) {
    if (spec.kind === 'text') {
      await dosTypeLineIn(out, spec.text, DOS_UI_TYPE_MS, 'era-dos-line');
      dosStripCursor();
    } else if (spec.kind === 'opt') {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'era-dos-line era-dos-menu-btn';
      btn.dataset.dosMenu = String(spec.n);
      btn.addEventListener('click', () => dosEnqueueMenuResponse(spec.n));
      out.appendChild(btn);
      await dosTypeChars(btn, spec.text, DOS_UI_TYPE_MS);
      dosStripCursor();
    } else if (spec.kind === 'prompt') {
      const lineEl = document.createElement('div');
      lineEl.className = 'era-dos-line';
      out.appendChild(lineEl);
      lineEl.appendChild(document.createTextNode('C:\\> '));
      dosAttachCursor(lineEl);
    }
  }
  dosMenuInteractive = true;
}

async function dosRunMenuSequence() {
  const out = document.getElementById('dosTermOut');
  if (!out) return;
  out.innerHTML = '';
  dosCursorEl = null;
  await dosAppendMenuBlock(out);
}

async function dosTypeResponseLines(lines) {
  const out = document.getElementById('dosTermOut');
  if (!out) return;
  dosStripCursor();
  for (const line of lines) {
    await dosTypeLineIn(out, line, DOS_UI_TYPE_MS, 'era-dos-line');
    dosStripCursor();
  }
  await dosAppendMenuBlock(out);
}

function dosEnqueueMenuResponse(n) {
  if (!dosMenuInteractive || !DOS_MENU_RESPONSES[n]) return;
  dosRespChain = dosRespChain.then(() => dosTypeResponseLines(DOS_MENU_RESPONSES[n]));
}

async function dosRunBbsSequence() {
  const head = document.getElementById('dosBbsHeader');
  const body = document.getElementById('dosBbsMessages');
  if (!head || !body) return;
  head.innerHTML = '';
  body.innerHTML = '';

  for (const line of DOS_BBS_HEADER_LINES) {
    await dosTypeLineInBbs(head, line, DOS_UI_TYPE_MS, 'era-dos-line');
  }

  for (const msgLines of DOS_BBS_MESSAGES) {
    await dosSleep(DOS_BBS_PAUSE_MS);
    const block = document.createElement('div');
    block.className = 'era-dos-msg-block';
    body.appendChild(block);
    for (const line of msgLines) {
      await dosTypeLineInBbs(block, line, DOS_UI_TYPE_MS, 'era-dos-line');
    }
  }

  await dosSleep(DOS_BBS_PAUSE_MS);
  const replyBlock = document.createElement('div');
  replyBlock.className = 'era-dos-msg-block';
  body.appendChild(replyBlock);
  for (const line of DOS_REPLY_LINES) {
    await dosTypeLineInBbs(replyBlock, line, DOS_UI_TYPE_MS, 'era-dos-line');
  }
}

function startDosClock() {
  if (dosClockTimer) return;
  const tick = () => {
    const clk = document.getElementById('eraDosClock');
    if (!clk) return;
    const now = new Date();
    clk.textContent = now.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    clk.dateTime = now.toISOString();
  };
  tick();
  dosClockTimer = window.setInterval(tick, 1000);
}

function initDosBinaryCanvas() {
  const canvas = document.getElementById('dosBinaryCanvas');
  if (!canvas || dosBinaryInited) return;
  dosBinaryInited = true;
  const ctx = canvas.getContext('2d');
  let cols = 0;
  let rows = 0;
  let colBits = [];
  let scroll = 0;

  function layout() {
    const wrap = canvas.parentElement;
    if (!wrap) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    const cell = 10 * dpr;
    cols = Math.ceil(canvas.width / cell) + 2;
    rows = Math.ceil(canvas.height / cell) + 4;
    colBits = [];
    for (let c = 0; c < cols; c += 1) {
      const col = [];
      for (let r = 0; r < rows; r += 1) col.push(Math.random() > 0.5 ? '1' : '0');
      colBits.push(col);
    }
    scroll = 0;
  }

  function frame() {
    dosBinaryRaf = requestAnimationFrame(frame);
    if (currentEraIndex !== 1) return;
    if (!canvas.parentElement) return;
    if (canvas.width < 4) layout();
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(0, 255, 255, 0.35)';
    ctx.font = `${8 * dpr}px "Press Start 2P", monospace`;
    const cell = 10;
    scroll += 0.35;
    if (scroll >= cell) {
      scroll -= cell;
      for (let c = 0; c < cols; c += 1) {
        colBits[c].pop();
        colBits[c].unshift(Math.random() > 0.5 ? '1' : '0');
      }
    }
    for (let c = 0; c < cols; c += 1) {
      for (let r = 0; r < rows; r += 1) {
        const x = c * cell;
        const y = r * cell + scroll;
        ctx.fillText(colBits[c][r], x, y);
      }
    }
  }

  layout();
  window.addEventListener('resize', layout);
  dosBinaryRaf = requestAnimationFrame(frame);
}

function dosOnGlobalKeydown(ev) {
  if (currentEraIndex !== 1) return;
  if (!document.getElementById('era-dos')?.classList.contains('is-active')) return;
  const t = ev.target;
  if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) return;
  if (t.closest?.('.era-step-nav')) return;
  if (ev.key < '1' || ev.key > '5') return;
  if (!dosMenuInteractive) return;
  dosEnqueueMenuResponse(Number(ev.key));
}

function wireDosKeys() {
  if (dosKeyHandlerBound) return;
  dosKeyHandlerBound = true;
  document.addEventListener('keydown', dosOnGlobalKeydown);
}

async function finishDosEraLoad() {
  startDosClock();
  initDosBinaryCanvas();
  wireDosKeys();
  if (!dosContentFullyLoaded) {
    await Promise.all([dosRunMenuSequence(), dosRunBbsSequence()]);
    dosContentFullyLoaded = true;
  }
}

async function enterDosEra(opts) {
  const { needBoot } = opts;
  const section = document.getElementById('era-dos');
  const boot = document.getElementById('dosBootOverlay');
  const main = document.getElementById('dosMainRoot');
  if (!section || !boot || !main || dosEnterBusy) return;
  dosEnterBusy = true;

  try {
    if (needBoot) {
      main.classList.add('is-hidden-boot');
      boot.hidden = false;
      await dosRunBootSequence();
      section.classList.add('era-dos-flicker');
      await dosSleep(50);
      boot.hidden = true;
      main.classList.remove('is-hidden-boot');
      setTimeout(() => section.classList.remove('era-dos-flicker'), 240);
      await finishDosEraLoad();
    } else {
      boot.hidden = true;
      main.classList.remove('is-hidden-boot');
      await finishDosEraLoad();
    }
  } finally {
    dosEnterBusy = false;
  }
}

// ═════════════════════════════════════════════════════════════
// ERA 3 — DOT-COM BOOM 1999
// ═════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════
// ERA 3 — 90s WORLD WIDE WEB (Windows 95 + GeoCities)
// ═════════════════════════════════════════════════════════════

function startClock() {
  const tick = () => {
    const el = document.getElementById('trayClock');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
  tick();
  setInterval(tick, 1000);
}

document.getElementById('calBtn')?.addEventListener('click', (ev) => {
  const cal = document.getElementById('eraCalendar');
  if (!cal) return;
  cal.hidden = !cal.hidden;
  if (!cal.hidden) {
    // Show 1995 calendar for era-web90s
    renderCalendar(1995, 0); // January 1995
  }
});

startClock();

// Render calendar for era-web90s
function renderCalendar(year, month) {
  const monthYear = document.getElementById('calendarMonthYear');
  const daysContainer = document.getElementById('eraCalendarDays');
  
  if (!monthYear || !daysContainer) return;
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  monthYear.textContent = monthNames[month] + ' ' + year;
  daysContainer.innerHTML = '';
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Empty cells before month starts
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'era-calendar-day empty';
    emptyDay.textContent = '';
    daysContainer.appendChild(emptyDay);
  }
  
  // Days in month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'era-calendar-day';
    dayEl.textContent = day;
    
    // Highlight Jan 1, 1995 (the first day of the web era)
    if (year === 1995 && month === 0 && day === 1) {
      dayEl.classList.add('today');
    }
    
    daysContainer.appendChild(dayEl);
  }
}

// Calendar navigation - constrained to 1995
document.querySelectorAll('.era-calendar-nav-prev, .era-calendar-nav-next').forEach(btn => {
  btn.addEventListener('click', function() {
    // Find current month/year on display
    const monthYearEl = document.getElementById('calendarMonthYear');
    const monthYearText = monthYearEl?.textContent || '';
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    let currentMonth = 0;
    let currentYear = 1995;
    
    for (let i = 0; i < months.length; i++) {
      if (monthYearText.includes(months[i])) {
        currentMonth = i;
        break;
      }
    }
    
    const yearMatch = monthYearText.match(/\d{4}/);
    if (yearMatch) {
      currentYear = parseInt(yearMatch[0]);
    }
    
    if (this.classList.contains('era-calendar-nav-prev')) {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
    } else {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
    
    // Stay within 1995
    if (currentYear < 1995) {
      currentYear = 1995;
      currentMonth = 0;
    } else if (currentYear > 1995) {
      currentYear = 1995;
      currentMonth = 11;
    }
    
    renderCalendar(currentYear, currentMonth);
  });
});

// Era shortcut buttons in web90s calendar
document.querySelectorAll('.era-shortcut-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const eraCode = this.getAttribute('data-era');
    const calendarBtn = document.getElementById('calBtn');
    
    // Close calendar first
    const cal = document.getElementById('eraCalendar');
    if (cal && !cal.hidden) {
      cal.hidden = true;
    }
    
    // Trigger era change based on button clicked
    if (eraCode === 'intro') {
      // Go to intro by scrolling to top
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } else if (eraCode === 'arpanet') {
      // Go to arpanet (era index 0)
      showEra(0);
    } else if (eraCode === 'dos') {
      // Go to dos (era index 1)
      showEra(1);
    }
  });
});

function playWeb90sIntroAnimation() {
  const heading = document.getElementById('web90sIntroHeading');
  const subheading = document.getElementById('web90sIntroSubheading');
  const body = document.getElementById('web90sIntroBody');
  const continueBtn = document.getElementById('web90sIntroContinue');
  const introScreen = document.getElementById('web90sIntroScreen');
  
  if (!heading) return;
  
  // Typewriter effect for heading
  const headingText = 'The World Wide Web.';
  let charIndex = 0;
  heading.style.opacity = '1';
  heading.textContent = '';
  
  const typeInterval = setInterval(() => {
    if (charIndex < headingText.length) {
      heading.textContent += headingText.charAt(charIndex);
      charIndex++;
    } else {
      clearInterval(typeInterval);
      heading.classList.add('typing-done');
      
      // Fade in subheading after heading finishes
      setTimeout(() => {
        subheading.classList.add('fade-in');
        
        // Fade in body after subheading
        setTimeout(() => {
          body.classList.add('fade-in');
          
          // Show continue prompt after body
          setTimeout(() => {
            continueBtn.classList.add('show');
          }, 400);
        }, 800);
      }, 600);
    }
  }, 60); // Typewriter speed
  
  // Click handler to dismiss intro
  introScreen.addEventListener('click', dismissWeb90sIntro);
}

function dismissWeb90sIntro() {
  const introScreen = document.getElementById('web90sIntroScreen');
  const desktop = document.getElementById('win95-desktop');
  
  if (introScreen && desktop) {
    introScreen.classList.add('fade-out');
    setTimeout(() => {
      introScreen.style.display = 'none';
      desktop.style.display = 'block';
    }, 500);
  }
  
  // Remove click listener to prevent double dismissal
  introScreen.removeEventListener('click', dismissWeb90sIntro);
}

function enterWeb90sEra() {
  const desktop = document.getElementById('win95-desktop');
  const introScreen = document.getElementById('web90sIntroScreen');
  
  if (introScreen) {
    introScreen.style.display = 'flex';
    playWeb90sIntroAnimation();
  }
  
  if (desktop) {
    desktop.style.display = 'none'; // Keep hidden until intro is dismissed
  }

  // Automatically open the Internet Explorer window with historical content
  const content = `
    <div class="ie-intro-content">
      <div class="top-label">1990 — 1999</div>
      <h1 class="main-heading" id="typewriterHeading">The World Wide Web</h1>
      <h2 class="subheading">The internet gets a face.</h2>
      <p class="body-text">
        In 1991, Tim Berners-Lee introduced the World Wide Web.<br>
        Suddenly the internet had pages, links, and images.<br>
        GeoCities let anyone build a homepage.<br>
        Netscape made browsing mainstream.<br>
        The web was weird, wonderful, and completely new.
      </p>
      <div class="source">Source: Early Web History</div>
    </div>
  `;
  const win = createWin95Window('ieIntroWin', 'Internet Explorer', content, (window.innerWidth - 520) / 2, (window.innerHeight - 400) / 2, 520, 400);
  makeWindowDraggable(win);
  document.getElementById('windowsContainer').appendChild(win);

  // Optional: simple typewriter animation
  const heading = win.querySelector('#typewriterHeading');
  if (heading) {
    typeWriterEffect(heading, 'The World Wide Web', 50);
  }
}

// ═════════════════════════════════════════════════════════════
// ERA 4 — SOCIAL MEDIA 2004
// ═════════════════════════════════════════════════════════════

// Feed posts — rendered into #socialFeed
const FEED_POSTS = [
  {
    user: 'Mark Z',
    avatar: '👨‍💻',
    date: 'Feb 4, 2004',
    text: 'Just launched facebook.com from my dorm. Probably nothing.',
    likes: 4200000000
  },
  {
    user: 'YouTube',
    avatar: '▶️',
    date: '2005',
    text: 'You can now upload videos from your phone. This won\'t cause any problems.',
    likes: 1000000000
  },
  {
    user: 'Twitter',
    avatar: '🐦',
    date: '2006',
    text: 'what are you doing?',
    likes: 500000000
  },
  {
    user: 'iPhone',
    avatar: '📱',
    date: 'Jan 9, 2007',
    text: 'There is no keyboard. Trust us.',
    likes: 2300000000
  },
  {
    user: 'You',
    avatar: '👤',
    date: '2009',
    text: 'just had coffee ☕',
    likes: 3,
    isYou: true
  },
];

function renderFeed() {
  const feed = document.getElementById('socialFeed');
  feed.innerHTML = FEED_POSTS.map((post, i) => `
    <div class="post-card ${post.isYou ? 'post-you' : ''}" data-index="${i}">
      <div class="post-header">
        <span class="post-avatar">${post.avatar}</span>
        <div>
          <p class="post-user">${post.user}</p>
          <p class="post-date">${post.date}</p>
        </div>
      </div>
      <p class="post-text">${post.text}</p>
      <div class="post-actions">
        <button class="like-btn" data-index="${i}" aria-label="Like post">
          👍 <span class="like-count">${formatLikes(post.likes)}</span>
        </button>
        <button class="comment-btn">💬 Comment</button>
      </div>
    </div>
  `).join('');

  // Like button toggle
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const i    = parseInt(btn.dataset.index);
      const liked = btn.classList.toggle('liked');
      FEED_POSTS[i].likes += liked ? 1 : -1;
      btn.querySelector('.like-count').textContent = formatLikes(FEED_POSTS[i].likes);
    });
  });
}

// Format large numbers (4200000000 → 4.2B)
function formatLikes(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n;
}

renderFeed();

// ═════════════════════════════════════════════════════════════
// ERA 5 — MODERN / AI 2024
// ═════════════════════════════════════════════════════════════

// Scan readout — types out fake user data
const SCAN_DATA = [
  { label: 'LOCATION',          value: 'Detected' },
  { label: 'DEVICE',            value: 'Detected' },
  { label: 'TIME ON SITE',      value: null, live: true },  // live timer
  { label: 'INTERESTS INFERRED',value: 'Technology, Nostalgia, Design' },
  { label: 'AD PROFILE',        value: 'Built' },
  { label: 'DATA SOLD TO',      value: '47 third parties' },
  { label: '',                  value: '' },
  { label: 'WELCOME BACK.',     value: 'WE NEVER FORGOT YOU.' },
];

let era5StartTime = null;

function renderScanRows() {
  const container = document.getElementById('scanRows');
  SCAN_DATA.forEach(({ label, value, live }, i) => {
    setTimeout(() => {
      const row = document.createElement('div');
      row.className = 'scan-row';

      if (live) {
        // Live elapsed time counter
        row.innerHTML = `
          <span class="scan-label">${label}</span>
          <span class="scan-value" id="liveTimer">0s</span>
        `;
        // Update timer every second
        setInterval(() => {
          const el = document.getElementById('liveTimer');
          if (el) el.textContent = Math.round((Date.now() - era5StartTime) / 1000) + 's';
        },1000);
      } else {
        row.innerHTML = `
          <span class="scan-label">${label}</span>
          <span class="scan-value">${value}</span>
        `;
      }
      container.appendChild(row);
    }, i * 300); // each row appears 300ms after the last
  });
}

// AI Chat — responds to user input
// Uses simple keyword matching (swap for Anthropic API call if desired)
document.getElementById('aiSend').addEventListener('click', sendAiMessage);
document.getElementById('aiInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendAiMessage();
});

function sendAiMessage() {
  const input    = document.getElementById('aiInput');
  const messages = document.getElementById('aiMessages');
  const text     = input.value.trim();
  if (!text) return;
  input.value = '';

  // User message
  appendMessage(messages, text, 'user');

  // Find response (keyword match or default)
  const key      = Object.keys(CONFIG.aiResponses).find(k => text.toLowerCase().includes(k));
  const response = CONFIG.aiResponses[key] || CONFIG.aiResponses.default;

  // AI response after short delay (feels more real)
  setTimeout(() => appendMessage(messages, response, 'ai'), 700);
}

function appendMessage(container, text, role) {
  const msg = document.createElement('div');
  msg.className = `ai-message ai-${role}`;
  msg.textContent = text;
  container.appendChild(msg);
  // Scroll to latest message
  container.scrollTop = container.scrollHeight;
}

const ERA_LABELS = [
  '1969 · ARPANET',
  '1980s · DOS / Early Internet',
  '1990s · World Wide Web',
  '2004 · Social',
  '2024 · Modern',
  'Thank you',
];

let currentEraIndex = 0;
let era1StoryStarted = false;
let scanRowsRendered = false;
let closingTyped = false;

function showEra(index) {
  const sections = document.querySelectorAll('#internetWorld .era');
  const max = sections.length - 1;
  const fromIdx = currentEraIndex;
  currentEraIndex = Math.max(0, Math.min(index, max));

  sections.forEach((el, i) => {
    const on = i === currentEraIndex;
    el.classList.toggle('is-active', on);
    el.setAttribute('aria-hidden', on ? 'false' : 'true');
  });

  const prevBtn = document.getElementById('eraPrev');
  const nextBtn = document.getElementById('eraNext');
  const labelEl = document.getElementById('eraStepLabel');
  if (prevBtn) prevBtn.disabled = currentEraIndex === 0;
  if (nextBtn) nextBtn.disabled = currentEraIndex === max;
  if (labelEl) labelEl.textContent = ERA_LABELS[currentEraIndex] || '';

  // Hide nav bar when era-web90s is active
  const navBar = document.querySelector('.era-step-nav');
  if (navBar) {
    navBar.style.display = (sections[currentEraIndex].id === 'era-web90s') ? 'none' : 'flex';
  }

  if (currentEraIndex === 0 && !era1StoryStarted) {
    era1StoryStarted = true;
    const doWipe = !!window.__arpanetFromIntro;
    window.__arpanetFromIntro = false;
    startArpanetEra(doWipe);
  }
  if (currentEraIndex === 1 && fromIdx !== 1) {
    const needBoot = !!window.__dosBootFromCalendar;
    window.__dosBootFromCalendar = false;
    enterDosEra({ needBoot });
  }
  if (currentEraIndex === 2 && fromIdx !== 2) {
    enterWeb90sEra();
  }
  if (currentEraIndex === 4 && !scanRowsRendered) {
    scanRowsRendered = true;
    era5StartTime = Date.now();
    renderScanRows();
  }
  if (currentEraIndex === 5 && !closingTyped) {
    closingTyped = true;
    typewriterLine(
      document.getElementById('closingFinal'),
      'Everything you know is still just signal.',
      ''
    );
  }
}

document.getElementById('eraPrev').addEventListener('click', () => {
  showEra(currentEraIndex - 1);
});

document.getElementById('eraNext').addEventListener('click', () => {
  showEra(currentEraIndex + 1);
});

document.addEventListener('keydown', (e) => {
  const iw = document.getElementById('internetWorld');
  if (!iw.classList.contains('is-open')) return;
  const t = e.target;
  if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) return;
  if (e.key === 'ArrowLeft') showEra(currentEraIndex - 1);
  if (e.key === 'ArrowRight') showEra(currentEraIndex + 1);
});

// Function to create Win95 windows
function createWin95Window(id, title, content, x = 100, y = 100, width = 400, height = 300) {
  const win = document.createElement('div');
  win.className = 'win95-window';
  win.id = id;
  win.style.left = x + 'px';
  win.style.top = y + 'px';
  win.style.width = width + 'px';
  win.style.height = height + 'px';
  
  win.innerHTML = `
    <div class="win95-titlebar">
      <span class="win95-title">${title}</span>
      <div class="win95-controls">
        <div class="win95-control">_</div>
        <div class="win95-control">□</div>
        <div class="win95-control">✕</div>
      </div>
    </div>
    <div class="win95-body">${content}</div>
  `;
  
  return win;
}

// Function to make windows draggable
function makeWindowDraggable(win) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  const titlebar = win.querySelector('.win95-titlebar');
  
  titlebar.addEventListener('mousedown', (e) => {
    isDragging = true;
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    
    const rect = win.getBoundingClientRect();
    xOffset = e.clientX - rect.left;
    yOffset = e.clientY - rect.top;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;
    
    win.style.left = (currentX) + 'px';
    win.style.top = (currentY) + 'px';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

// Desktop icon click handlers
document.addEventListener('DOMContentLoaded', () => {
  // My Computer
  document.querySelector('[data-window="myComputer"]')?.addEventListener('click', () => {
    const content = `
      <div style="padding: 10px;">
        <p><strong>💾 3½ Floppy (A:)</strong></p>
        <p><strong>💿 Local Disk (C:)</strong></p>
        <p><strong>💿 2.1 GB free of 4 GB</strong></p>
      </div>
    `;
    const win = createWin95Window('myComputerWin', 'My Computer', content, 50, 50, 300, 200);
    makeWindowDraggable(win);
    document.getElementById('windowsContainer').appendChild(win);
  });

  // Network Neighborhood
  document.querySelector('[data-window="network"]')?.addEventListener('click', () => {
    const content = `
      <div class="network-window">
        <div class="menu-bar">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Help</span>
        </div>
        <div class="toolbar">
          <button class="toolbar-btn">&larr; Back</button>
          <button class="toolbar-btn">&rarr; Forward</button>
          <button class="toolbar-btn">&uarr; Up</button>
          <div class="address-bar">Network Neighborhood</div>
        </div>
        <div class="content-area">
          <div class="left-panel">
            <div class="tree-item">Network Neighborhood</div>
            <div class="tree-item sub">Workgroup (MSHOME)</div>
          </div>
          <div class="right-panel">
            <div class="computer-grid">
              <div class="computer" data-user="SKATER_BOI_PC">SKATER_BOI_PC</div>
              <div class="computer" data-user="NETGIRL_XO">NETGIRL_XO</div>
              <div class="computer" data-user="4TH_WALL_BREAKER">4TH_WALL_BREAKER</div>
              <div class="computer" data-user="WEBMASTER_GURL">WEBMASTER_GURL</div>
              <div class="computer" data-user="INT3RN3T_G1RL">INT3RN3T_G1RL</div>
              <div class="computer" data-user="SYSOP_BOB">SYSOP_BOB</div>
              <div class="computer" data-user="HANSON_FAN_4EVR">HANSON_FAN_4EVR</div>
              <div class="computer" data-user="RE4L_USER">RE4L_USER</div>
            </div>
          </div>
        </div>
      </div>
    `;
    const win = createWin95Window('networkWin', 'Network Neighborhood', content, 150, 60, 600, 450);
    makeWindowDraggable(win);
    document.getElementById('windowsContainer').appendChild(win);

    // Add event listeners for computers
    win.querySelectorAll('.computer').forEach(comp => {
      comp.addEventListener('click', () => {
        win.querySelectorAll('.computer').forEach(c => c.classList.remove('selected'));
        comp.classList.add('selected');
      });
      comp.addEventListener('click', () => {
        const username = comp.dataset.user;
        showConnectingAnimation(win, username);
      });
    });
  });

  // Inbox
  document.querySelector('[data-window="inbox"]')?.addEventListener('click', () => {
    const content = `
      <div style="padding: 10px;">
        <p><strong>📧 From: bill@microsoft.com</strong></p>
        <p><strong>Subject: Welcome to Windows!</strong></p>
        <p><strong>You've got mail! 📬</strong></p>
      </div>
    `;
    const win = createWin95Window('inboxWin', 'Inbox', content, 300, 100, 350, 200);
    makeWindowDraggable(win);
    document.getElementById('windowsContainer').appendChild(win);
  });

  // Recycle Bin
  document.querySelector('[data-window="recycle"]')?.addEventListener('click', () => {
    const content = `
      <div style="padding: 10px;">
        <p><strong>🗑️ Recycle Bin</strong></p>
        <p><em>Recycle Bin is empty</em></p>
      </div>
    `;
    const win = createWin95Window('recycleWin', 'Recycle Bin', content, 500, 150, 250, 150);
    makeWindowDraggable(win);
    document.getElementById('windowsContainer').appendChild(win);
  });

  // The Internet
  document.querySelector('[data-window="internet"]')?.addEventListener('click', () => {
    const content = `
      <div style="padding: 10px;">
        <p><strong>🌍 The Internet</strong></p>
        <p><em>Opens Internet Explorer window</em></p>
      </div>
    `;
    const win = createWin95Window('internetWin', 'The Internet', content, 400, 200, 680, 480);
    makeWindowDraggable(win);
    document.getElementById('windowsContainer').appendChild(win);
  });

  // Online Services
  document.querySelector('[data-window="online"]')?.addEventListener('click', () => {
    const content = `
      <div style="padding: 10px;">
        <p><strong>📁 Online Services</strong></p>
        <p><strong>AOL 3.0</strong></p>
        <p><strong>CompuServe</strong></p>
        <p><strong>Prodigy</strong></p>
      </div>
    `;
    const win = createWin95Window('onlineWin', 'Online Services', content, 600, 100, 300, 200);
    makeWindowDraggable(win);
    document.getElementById('windowsContainer').appendChild(win);
  });

  // Start button functionality
  const startBtn = document.getElementById('win95StartBtn');
  const startMenu = document.getElementById('startMenu');
  const taskbarMiddle = document.getElementById('taskbarMiddle');

  startBtn.addEventListener('click', () => {
    startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
  });

  // Close start menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && 
        !startBtn.contains(e.target) && 
        startMenu.style.display === 'block') {
      startMenu.style.display = 'none';
    }
  });

  // System clock
  function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    document.getElementById('systemClock').textContent = timeString;
  }

  // Update clock every second
  setInterval(updateClock, 1000);

  // Calendar icon
  document.getElementById('calendarIcon')?.addEventListener('click', () => {
    // Calendar functionality already exists - just call it
    if (typeof openCalendar === 'function') {
      openCalendar();
    }
  });

  // Network Neighborhood functions
  function showConnectingAnimation(win, username) {
    const overlay = document.createElement('div');
    overlay.className = 'connecting-overlay';
    overlay.innerHTML = `
      <div class="modem-dialog">
        <div>Connecting to ${username}...</div>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      </div>
    `;
    win.appendChild(overlay);

    const fill = overlay.querySelector('.progress-fill');
    const text = overlay.querySelector('div:first-child');
    const steps = [
      { text: 'Dialing 555-2400...', width: 25 },
      { text: 'Verifying username and password...', width: 50 },
      { text: 'Logging on to network...', width: 75 },
      { text: 'Connected at 56Kbps', width: 100 }
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length) {
        text.textContent = steps[step].text;
        fill.style.width = steps[step].width + '%';
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          overlay.remove();
          openSharedFiles(username, win.offsetLeft + 30, win.offsetTop + 30);
        }, 500);
      }
    }, 500);
  }

  function openSharedFiles(username, x, y) {
    const sharedData = getSharedFilesData(username);
    const { html, count } = generateFileList(sharedData.files, 0);
    const content = `
      <div class="shared-files">
        <div class="file-list">
          ${html}
        </div>
        <div class="status-bar">
          ${count} object(s)
        </div>
      </div>
    `;
    const win = createWin95Window(`${username}Shared`, `${username} - Shared Files`, content, x, y, 500, 400);
    makeWindowDraggable(win);
    document.getElementById('windowsContainer').appendChild(win);

    // Add event listeners for file rows
    win.querySelectorAll('.file-row').forEach(row => {
      row.addEventListener('click', () => {
        win.querySelectorAll('.file-row').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        const fileName = row.dataset.filename;
        if (row.classList.contains('folder')) {
          // Toggle folder
          const content = row.nextElementSibling;
          if (content) {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
          }
        } else if (fileName === 'Hacks/') {
          showAccessDenied(win);
        } else {
          showFileToast(fileName);
        }
      });
    });
  }

  function getSharedFilesData(username) {
    const data = {
      SKATER_BOI_PC: {
        files: [
          { name: 'My Documents', type: 'folder', size: '', children: [
            { name: 'README.txt', type: 'txt', size: 'dont touch my files thx' }
          ]},
          { name: 'cool_songs/', type: 'folder', size: '', children: [
            { name: 'MMMBop_Hanson.mp3', type: 'mp3', size: '3.2MB' },
            { name: 'BackStreetBoys_IWBIY.mp3', type: 'mp3', size: '4.1MB' },
            { name: 'SpiceGirls_WannaBe.mp3', type: 'mp3', size: '3.8MB' }
          ]},
          { name: 'Games/', type: 'folder', size: '', children: [
            { name: 'DOOM2.exe', type: 'exe', size: '2.1MB' },
            { name: 'SkiFree.exe', type: 'exe', size: '456KB' }
          ]}
        ]
      },
      NETGIRL_XO: {
        files: [
          { name: 'My Webpage/', type: 'folder', size: '', children: [
            { name: 'index.html', type: 'html', size: '12KB' },
            { name: 'background.gif', type: 'gif', size: '45KB' },
            { name: 'midi_music.mid', type: 'mid', size: '8KB' }
          ]},
          { name: 'Diary/', type: 'folder', size: '', children: [
            { name: 'dear_diary_jan.txt', type: 'txt', size: '2KB' },
            { name: 'dear_diary_feb.txt', type: 'txt', size: '3KB' }
          ]},
          { name: 'Photos/', type: 'folder', size: '', children: [
            { name: 'scan001.jpg', type: 'jpg', size: '890KB' },
            { name: 'scan002.jpg', type: 'jpg', size: '1.2MB' }
          ]},
          { name: 'favorite_sites.txt', type: 'txt', size: '' }
        ]
      },
      '4TH_WALL_BREAKER': {
        files: [
          { name: 'Scripts/', type: 'folder', size: '', children: [
            { name: 'plot_twist.js', type: 'js', size: '5KB' },
            { name: 'character_break.txt', type: 'txt', size: '1KB' }
          ]},
          { name: 'Notes.txt', type: 'txt', size: '' }
        ]
      },
      WEBMASTER_GURL: {
        files: [
          { name: 'GeoCities_Site/', type: 'folder', size: '', children: [
            { name: 'index.html', type: 'html', size: '8KB' },
            { name: 'guestbook.html', type: 'html', size: '4KB' },
            { name: 'links.html', type: 'html', size: '2KB' },
            { name: 'spinning_globe.gif', type: 'gif', size: '23KB' }
          ]},
          { name: 'Graphics/', type: 'folder', size: '', children: [
            { name: 'cool_divider.gif', type: 'gif', size: '4KB' },
            { name: 'under_construction.gif', type: 'gif', size: '12KB' },
            { name: 'rainbow_bar.gif', type: 'gif', size: '6KB' }
          ]},
          { name: 'html_tips.txt', type: 'txt', size: '' }
        ]
      },
      INT3RN3T_G1RL: {
        files: [
          { name: 'Chat_Logs/', type: 'folder', size: '', children: [
            { name: 'irc_1997.log', type: 'txt', size: '15KB' },
            { name: 'aol_chat.txt', type: 'txt', size: '8KB' }
          ]},
          { name: 'Web_Rings/', type: 'folder', size: '', children: [
            { name: 'cool_sites.txt', type: 'txt', size: '2KB' }
          ]},
          { name: 'ascii_art.txt', type: 'txt', size: '' }
        ]
      },
      SYSOP_BOB: {
        files: [
          { name: 'BBS_System/', type: 'folder', size: '', children: [
            { name: 'wildcat_config.ini', type: 'ini', size: '4KB' },
            { name: 'user_list.txt', type: 'txt', size: '23KB' },
            { name: 'message_base/', type: 'folder', size: '' }
          ]},
          { name: 'Shareware/', type: 'folder', size: '', children: [
            { name: 'various .zip files', type: 'zip', size: 'multiple' }
          ]},
          { name: 'rules.txt', type: 'txt', size: '' },
          { name: 'welcome_message.txt', type: 'txt', size: '' }
        ]
      },
      HANSON_FAN_4EVR: {
        files: [
          { name: 'Hanson_stuff/', type: 'folder', size: '', children: [
            { name: 'hanson_bio.txt', type: 'txt', size: '8KB' },
            { name: 'taylor_pic_scan.jpg', type: 'jpg', size: '2.1MB' },
            { name: 'mmmbop_lyrics.txt', type: 'txt', size: '1KB' }
          ]},
          { name: 'Fan_fiction/', type: 'folder', size: '', children: [
            { name: '34 files', type: 'txt', size: '' }
          ]},
          { name: 'my_fave_songs.txt', type: 'txt', size: '' },
          { name: 'concert_dates_1997.txt', type: 'txt', size: '' }
        ]
      },
      RE4L_USER: {
        files: [
          { name: 'Documents/', type: 'folder', size: '', children: [
            { name: 'resume.doc', type: 'doc', size: '25KB' },
            { name: 'letter.txt', type: 'txt', size: '3KB' }
          ]},
          { name: 'Games/', type: 'folder', size: '', children: [
            { name: 'solitaire.exe', type: 'exe', size: '120KB' }
          ]},
          { name: 'readme.txt', type: 'txt', size: '' }
        ]
      },
      MODEM_KING_99: {
        files: [
          { name: 'Downloads/', type: 'folder', size: '', children: [
            { name: 'Netscape_Navigator.exe', type: 'exe', size: '8.2MB' },
            { name: 'WinZip.exe', type: 'exe', size: '1.1MB' },
            { name: 'ICQ_setup.exe', type: 'exe', size: '3.4MB' }
          ]},
          { name: 'BBS_logs/', type: 'folder', size: '', children: [
            { name: 'wildcat_march.log', type: 'txt', size: '45KB' },
            { name: 'wildcat_april.log', type: 'txt', size: '67KB' }
          ]},
          { name: 'modem_speeds.txt', type: 'txt', size: '' },
          { name: 'how_to_IRC.txt', type: 'txt', size: '' }
        ]
      },
      PACKET_KID: {
        files: [
          { name: 'FTP_finds/', type: 'folder', size: '', children: [
            { name: 'zork.zip', type: 'zip', size: '88KB' },
            { name: 'doom_wads.zip', type: 'zip', size: '2.3MB' }
          ]},
          { name: 'Hacks/', type: 'folder', size: '', children: [] }, // Special handling
          { name: 'ping_speeds.txt', type: 'txt', size: '' },
          { name: 'favorite_servers.txt', type: 'txt', size: '' }
        ]
      },
      AOL_ADDICT_97: {
        files: [
          { name: 'AOL_files/', type: 'folder', size: '', children: [
            { name: 'buddy_list.txt', type: 'txt', size: '2KB' },
            { name: 'away_messages.txt', type: 'txt', size: '4KB' },
            { name: 'chat_logs/', type: 'folder', size: '' }
          ]},
          { name: 'Email_attachments/', type: 'folder', size: '', children: [
            { name: 'fwd_fwd_fwd_joke.txt', type: 'txt', size: 'funny!!' },
            { name: 'chain_letter.txt', type: 'txt', size: 'send to 10 ppl!!' }
          ]},
          { name: 'screen_names.txt', type: 'txt', size: '' }
        ]
      }
    };
    return data[username] || { files: [] };
  }

  function generateFileList(files, depth = 0) {
    let html = '';
    let count = 0;
    files.forEach(file => {
      count++;
      const icon = getFileIcon(file.type);
      const isFolder = file.type === 'folder';
      html += `<div class="file-row ${isFolder ? 'folder' : ''}" data-filename="${file.name}" style="margin-left: ${depth * 16}px;">
        <span class="file-icon">${icon}</span>
        <span class="file-name">${file.name}</span>
        <span class="file-size">${file.size}</span>
      </div>`;
      if (isFolder && file.children) {
        const child = generateFileList(file.children, depth + 1);
        html += `<div class="folder-content" style="display: none;">${child.html}</div>`;
        count += child.count;
      }
    });
    return { html, count };
  }

  function getFileIcon(type) {
    const icons = {
      folder: '[DIR]',
      txt: '[TXT]',
      mp3: '[MP3]',
      jpg: '[JPG]',
      gif: '[GIF]',
      html: '[HTM]',
      exe: '[EXE]',
      ini: '[INI]',
      mid: '[MID]',
      zip: '[ZIP]'
    };
    return icons[type] || '[FILE]';
  }

  function showFileToast(filename) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = `Opening ${filename}...`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.textContent = `${filename} opened successfully`;
      setTimeout(() => toast.remove(), 1000);
    }, 1000);
  }

  function showAccessDenied(win) {
    const dialog = document.createElement('div');
    dialog.className = 'modem-dialog';
    dialog.innerHTML = `
      <div>Access Denied</div>
      <div>You do not have permission to access this folder.</div>
      <button onclick="this.parentElement.parentElement.remove()">OK</button>
    `;
    const overlay = document.createElement('div');
    overlay.className = 'connecting-overlay';
    overlay.appendChild(dialog);
    win.appendChild(overlay);
  }

  // Simple typewriter effect
  function typeWriterEffect(element, text, speed) {
    let i = 0;
    element.textContent = '';
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  }
});

initGlobalEraCalendar();
