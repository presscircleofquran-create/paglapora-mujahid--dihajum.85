// শব্দ: ব্যবহারকারীর নিজের বানানো দুটি mp3 (sounds/slide.mp3, sounds/press.mp3) হুবহু বাজে।
// WebAudio বাফার ব্যবহার করা হয়েছে যাতে বাটনে চাপ দেওয়ার সাথে সাথেই শব্দ হয়।
let ctx = null; const buf = {}; let started = false;
const AC = window.AudioContext || window.webkitAudioContext;
async function load(name) {
  try { const r = await fetch('sounds/' + name + '.mp3'); const a = await r.arrayBuffer(); buf[name] = await new Promise((ok, no) => ctx.decodeAudioData(a, ok, no)); } catch (e) { /* শব্দ না পেলে চুপচাপ থাকবে */ }
}
export function initSfx() {
  if (started || !AC) return; started = true;
  try { ctx = new AC(); } catch (e) { return; }
  load('slide'); load('press'); load('correct'); load('wrong'); for (let i = 1; i <= 10; i++) { load('m' + i); load('w' + i); } load('lesson'); load('scroll'); load('firework'); load('tick');
  initScroll();
  // ব্রাউজার (ফোন, ক্রোম, সাফারি) প্রথম স্পর্শ/ক্লিকের আগে শব্দ চালাতে দেয় না; প্রথম স্পর্শেই অডিও "আনলক" করা হয়
  ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'click', 'keydown'].forEach((ev) => document.addEventListener(ev, unlock, { capture: true, passive: true }));
}
let unlocked = false, pendSlide = 0;
function unlock() {
  if (!ctx) return;
  const done = () => { if (ctx.state !== 'running') return; if (!unlocked) { unlocked = true; try { const b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource(); s.buffer = b; s.connect(ctx.destination); s.start(0); } catch (e) { /* ignore */ } }
    if (pendSlide && Date.now() - pendSlide < 1800) { pendSlide = 0; play('slide'); } pendSlide = 0; };
  if (ctx.state === 'running') { done(); return; }
  try { const r = ctx.resume(); if (r && r.then) r.then(done, () => {}); else done(); } catch (e) { /* ignore */ }
}
// name: 'slide' | 'press' | 'soft'. 'soft' = প্রেস শব্দেরই হালকা, উঁচু সুরের ছোট রূপ। vol/rate ঐচ্ছিক।
// 'slide' শুধু তখনই বাজে যখন ব্রাউজার শব্দ চালানোর অনুমতি দিয়েছে; নইলে (স্পর্শের আগে) মনে রাখে, ১.৮ সেকেন্ডের মধ্যে স্পর্শ হলে বাজে
export function play(name, vol = 1, rate = 1) {
  if (!ctx) return;
  const src = name === 'soft' ? 'press' : name; if (!buf[src]) return;
  try {
    if (name === 'slide' && ctx.state !== 'running') { pendSlide = Date.now(); return; }
    if (ctx.state === 'suspended') ctx.resume();
    const s = ctx.createBufferSource(), g = ctx.createGain(), t = ctx.currentTime; s.buffer = buf[src]; s.connect(g); g.connect(ctx.destination);
    if (name === 'soft') { s.playbackRate.value = 1.45; g.gain.setValueAtTime(.55, t); g.gain.exponentialRampToValueAtTime(.001, t + .26); s.start(t); s.stop(t + .28); }
    else { g.gain.value = vol; s.playbackRate.value = rate; s.start(t); }
  } catch (e) { /* ignore */ }
}

// জোড়া মেলানোর ধাপে ধাপে শব্দ: frac (০–১) যত বাড়ে শব্দ তত জোরালো ও লম্বা; ১ হলে পুরো শব্দ।
export function playPart(name, frac) {
  if (!ctx || !buf[name]) return;
  try {
    if (ctx.state === 'suspended') ctx.resume();
    const b = buf[name], t = ctx.currentTime, s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = b; s.connect(g); g.connect(ctx.destination);
    if (frac >= 1) { s.start(t); return; }
    const d = Math.max(.32, b.duration * frac), v = .28 + .6 * frac;
    g.gain.setValueAtTime(v, t); g.gain.setValueAtTime(v, t + d * .7); g.gain.exponentialRampToValueAtTime(.001, t + d); s.start(t); s.stop(t + d + .02);
  } catch (e) { /* ignore */ }
}

// কম্পন (ভাইব্রেশন): বাটন < সঠিক উত্তর < ভুল উত্তর
export function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { /* ignore */ } }

// স্ক্রল শব্দ: যেকোনো স্ক্রল-এলাকায় প্রতি ৮px সরলে (নিচে বা উপরে) একটি ছোট শব্দ; খুব দ্রুত স্ক্রলে ৪৫ms-এর বেশি ঘন বাজে না
let lastT = 0; const pos = new WeakMap(); let acc = 0;
function initScroll() {
  document.addEventListener('scroll', (e) => {
    const tg = e.target, y = tg === document ? (document.scrollingElement || document.documentElement).scrollTop : tg.scrollTop;
    if (typeof y !== 'number') return; const prev = pos.has(tg) ? pos.get(tg) : y; pos.set(tg, y); acc += Math.abs(y - prev);
    if (acc < 8) return; acc %= 8; const now = performance.now(); if (now - lastT < 45) return; lastT = now; play('scroll', .25);
  }, { capture: true, passive: true });
}
