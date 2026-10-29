const FRAME_COUNT = 240;
const FRAME_DIR = 'ezgif-5bb4a3ff9f632b92-jpg';
const EASE = 0.1;
// source rows that hold the picture; the bottom rows of each frame carry a watermark
const CROP_TOP = 0;
const CROP_BOTTOM = 1250;
// vertical anchor for cover fitting, as a fraction of the cropped picture (subject sits near 0.45)
const FOCUS_Y = 0.45;

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d', { alpha: false });
const frames = new Array(FRAME_COUNT);

let target = 0;
let current = 0;
let lastDrawn = -1;
let lastTick = 0;

const framePath = (i) =>
  `${FRAME_DIR}/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;

function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  lastDrawn = -1;
}

function draw(index) {
  // fall back to the nearest decoded frame while others are still loading
  let img = frames[index];
  for (let d = 1; !img && d < FRAME_COUNT; d++) {
    img = frames[index - d] || frames[index + d];
  }
  if (!img) return;

  const cw = canvas.width;
  const ch = canvas.height;
  const sw = img.width;
  const sh = CROP_BOTTOM - CROP_TOP;
  const scale = Math.max(cw / sw, ch / sh);
  const w = sw * scale;
  const h = sh * scale;
  const y = Math.min(0, Math.max(ch - h, ch * FOCUS_Y - h * FOCUS_Y));
  ctx.drawImage(img, 0, CROP_TOP, sw, sh, (cw - w) / 2, y, w, h);
}

function readScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
  target = progress * (FRAME_COUNT - 1);
}

function tick(now) {
  // EASE is the fraction covered per 60 Hz frame; scale by elapsed time so any refresh rate eases the same
  const dt = lastTick ? Math.min(now - lastTick, 100) : 1000 / 60;
  lastTick = now;
  current += (target - current) * (1 - Math.pow(1 - EASE, dt / (1000 / 60)));
  if (Math.abs(target - current) < 0.001) current = target;

  const index = Math.round(current);
  if (index !== lastDrawn) {
    draw(index);
    lastDrawn = index;
  }
  requestAnimationFrame(tick);
}

// decode each frame up front into a bitmap so drawing never waits on a JPEG decode
for (let i = 0; i < FRAME_COUNT; i++) {
  const img = new Image();
  img.src = framePath(i);
  img.decode()
    .then(() => createImageBitmap(img))
    .then((bitmap) => {
      frames[i] = bitmap;
      lastDrawn = -1;
    });
}

window.addEventListener('resize', () => { resize(); readScroll(); });
window.addEventListener('load', readScroll);
window.addEventListener('scroll', readScroll, { passive: true });

resize();
readScroll();
requestAnimationFrame(tick);
