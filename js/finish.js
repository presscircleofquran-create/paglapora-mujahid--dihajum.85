// অনুশীলন শেষের পাতা: "লেসন কমপ্লিট!" (পয়েন্ট + শতকরা, তারাবাজি) এবং "প্রোফাইল তৈরি করুন" পাতা।
import { getLang, num } from './i18n.js';
import { play, buzz } from './sfx.js';
const $ = (s, r = document) => r.querySelector(s);
const IX = { bn: 0, en: 1, ar: 2 }, L = (a) => a[IX[getLang()]];
const T = {
  done: ['লেসন কমপ্লিট!', 'Lesson complete!', 'اكتمل الدرس!'],
  pts: ['মোট পয়েন্ট', 'Total points', 'مجموع النقاط'], tm: ['সময়', 'Time', 'الوقت'],
  rev: ['লেসন রিভিউ করুন', 'Review lesson', 'مراجعة الدرس'], go: ['চালিয়ে যান', 'Continue', 'متابعة'],
  sT: ['সময় হয়েছে নতুন একটি প্রোফাইল তৈরি করার!', 'Time to create a new profile!', 'حان الوقت لإنشاء ملف شخصي جديد!'],
  sX: ['কতটুকু শিখলেন তার হিসাব রাখতে চান? তাহলে এখনই নিজের একটি প্রোফাইল তৈরি করুন এবং শিখুন সম্পূর্ণ বিনা মূল্যে।', 'Want to keep track of what you have learned? Create your own profile now and learn completely free.', 'هل تريد متابعة ما تعلّمته؟ أنشئ ملفك الشخصي الآن وتعلّم مجانًا بالكامل.'],
  sG: ['প্রোফাইল তৈরি করুন', 'Create profile', 'إنشاء ملف شخصي'], sL: ['কিছুক্ষণ পর', 'Maybe later', 'لاحقًا'],
};
const GRADE = [[90, ['চমৎকার!', 'Excellent!', 'ممتاز!']], [70, ['দারুণ!', 'Great!', 'رائع!']], [50, ['ভালো!', 'Good!', 'جيد!']], [0, ['চেষ্টা চালিয়ে যান!', 'Keep trying!', 'واصل المحاولة!']]];
const BOLT = '<svg viewBox="0 0 24 32" aria-hidden="true"><path d="M14.5 1 3 18.2h7.3L8.6 31 21 12.8h-7.4z" fill="#ffc800"/><path d="M13.6 4.6 6.4 16h5.1z" fill="#ffe27a" opacity=".85"/></svg>';
const TARGET = '<svg viewBox="0 0 34 34" aria-hidden="true"><g class="tg-all"><circle cx="15" cy="19" r="13" fill="#4fb400"/><circle cx="15" cy="19" r="9.8" fill="#eaffd0"/><circle cx="15" cy="19" r="6.6" fill="#58cc02"/><circle cx="15" cy="19" r="3.3" fill="#eaffd0"/><g transform="translate(15 19)"><g class="tg-a"><g transform="rotate(-45)"><path d="M0 0H15" stroke="#e9f1f5" stroke-width="1.9" stroke-linecap="round"/><path d="M8.6 -.9 11.4 -4.8 16.6 -4.8 14 -.9Z" fill="#ff6b3d"/><path d="M8.6 .9 11.4 4.8 16.6 4.8 14 .9Z" fill="#ff6b3d"/><path d="M12.6 -.9 15.2 -4.8 16.6 -4.8 14 -.9Z" fill="#ffb199"/><path d="M12.6 .9 15.2 4.8 16.6 4.8 14 .9Z" fill="#ffb199"/><rect x="14.6" y="-1.2" width="2.2" height="2.4" rx="1" fill="#e9f1f5"/></g></g></g></g></svg>';
const CLOCK = '<svg viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="14.5" fill="#49c0f8"/><circle cx="17" cy="17" r="10.6" fill="#d8f2ff"/><g class="ck-h"><path d="M17 17 22.8 11.4" stroke="#1899d6" stroke-width="3" stroke-linecap="round"/><path d="M17 17 14.6 19.4" stroke="#1899d6" stroke-width="3" stroke-linecap="round"/></g><circle cx="17" cy="17" r="1.7" fill="#1899d6"/></svg>';
let root, sroot, cntT = [], fwT = [], raf = 0, cv, cx, W = 0, H = 0, bs = [], last = 0, live = false, lastTick = 0, leaving = false;
// ভিডিওর মতো পটকা: ৮টি সরু দাগ (৪টি লম্বা সোজা, ৪টি ছোট কোনাকুনি), দুই রঙের জোড়া; শিরোনামের ওপরের নির্দিষ্ট জায়গায় এলোমেলো ফোটে
const BC = [['#ffd21f', '#ff6b8b'], ['#ffd21f', '#ff9a3c'], ['#b6ee3a', '#7ad63a'], ['#c779f3', '#49c0f8'], ['#ff9a3c', '#ffd21f'], ['#ff6b8b', '#c779f3'], ['#49c0f8', '#9be32b'], ['#9be32b', '#ffd21f']];
const BLASTS = [.5, .9, 1.2, 1.75, 2.15, 2.65, 3.1, 3.6, 4.1, 4.7, 5.3, 6];
function fit() { const r = root.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1); W = r.width; H = r.height; cv.width = Math.round(W * d); cv.height = Math.round(H * d); cx.setTransform(d, 0, 0, d, 0, 0); }
function launch() {
  if (root.hidden || !W) return; const fx = $('#rs-fx'); if (!fx) return; const r = fx.getBoundingClientRect(), rr = root.getBoundingClientRect(), R = W < 700 ? 21 : 27;
  const aw = Math.min(W - 2 * R - 8, 21 * 16), x0 = W / 2 - aw / 2, y0 = r.top - rr.top + R * .6, y1 = r.bottom - rr.top - R * .6; let x = 0, y = 0;
  for (let k = 0; k < 10; k++) { x = x0 + Math.random() * aw; y = y0 + Math.random() * Math.max(10, y1 - y0); if (bs.every((b) => Math.hypot(b.x - x, b.y - y) > R * 1.9)) break; }
  bs.push({ x, y, R, c: BC[Math.floor(Math.random() * BC.length)], t: 0, life: 1.15, rot: Math.random() * .2 - .1 });
  play('firework'); buzz(60);
  if (!live) { live = true; last = performance.now(); raf = requestAnimationFrame(frame); }
}
const lerp = (a, b, t) => a + (b - a) * t;
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now; if (root.hidden) { live = false; cx.clearRect(0, 0, W, H); return; }
  cx.clearRect(0, 0, W, H); cx.lineCap = 'round';
  bs = bs.filter((b) => {
    b.t += dt; const u = b.t / b.life; if (u >= 1) return false;
    const pop = Math.min(1, u / .12), e = Math.max(0, (u - .35) / .65), al = u < .55 ? 1 : 1 - (u - .55) / .45, R = b.R * (.45 + .55 * (1 - Math.pow(1 - pop, 2)));
    cx.save(); cx.translate(b.x, b.y); cx.rotate(b.rot); cx.globalAlpha = al; cx.lineWidth = (b.R > 22 ? 3.4 : 2.8) * (1 - .45 * e);
    for (let i = 0; i < 8; i++) {
      const lg = i % 2 === 0, ro = (lg ? 1 : .62) * R, ri = .33 * R, rin = lerp(ri, ro * 1.02, e * e), rout = lerp(ro, ro * 1.1, e), a = i * Math.PI / 4;
      cx.strokeStyle = lg ? b.c[0] : b.c[1]; cx.beginPath(); cx.moveTo(Math.cos(a) * rin, Math.sin(a) * rin); cx.lineTo(Math.cos(a) * rout, Math.sin(a) * rout); cx.stroke();
    }
    cx.restore(); return true;
  });
  if (bs.length || fwT.length) raf = requestAnimationFrame(frame); else { live = false; cx.clearRect(0, 0, W, H); }
}
function fireworks() {
  fwT.forEach(clearTimeout); fwT = []; bs = []; if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  BLASTS.forEach((b) => { const id = setTimeout(() => { fwT = fwT.filter((x) => x !== id); launch(); }, b * 1000); fwT.push(id); });
}
// সংখ্যা ০ থেকে বাড়ে; প্রতিটি নতুন সংখ্যায় একটি করে "টিক" (খুব দ্রুত)
function count(el, to, delay, fmt) {
  const ms = Math.max(450, Math.min(1300, to * 16)), t0 = performance.now() + delay; let shown = -1; el.textContent = fmt(0);
  const tick = (now) => {
    if (root.hidden) return; const p = Math.max(0, Math.min(1, (now - t0) / ms)), e = 1 - Math.pow(1 - p, 2), v = Math.round(to * e);
    if (v !== shown) { shown = v; el.textContent = fmt(v); if (p > 0 && now - lastTick >= 14) { lastTick = now; play('tick', .3, .85); } }
    if (p < 1) cntT.push(requestAnimationFrame(tick));
  };
  cntT.push(requestAnimationFrame(tick));
}
function leave(hash) { if (leaving) return; leaving = true; setTimeout(() => { leaving = false; location.hash = hash; play('slide'); }, 180); }
const clock = (sec) => num(Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'));
export function showResult(fresh) {
  root = $('#v-result'); let r = { r: 0, w: 0, ms: 0 }; try { r = JSON.parse(sessionStorage.getItem('pp_res')) || r; } catch (e) {}
  const tot = r.r + r.w, pc = tot ? Math.round(r.r / tot * 100) : 100, g = GRADE.find((x) => pc >= x[0])[1], sec = Math.max(1, Math.round((r.ms || 0) / 1000));
  root.classList.toggle('still', !fresh);
  root.innerHTML = `<canvas class="rs-cv" id="rs-cv" aria-hidden="true"></canvas><div class="rs-main"><div class="rs-fx" id="rs-fx" aria-hidden="true"></div><h1 class="rs-t">${L(T.done)}</h1>
    <div class="rs-box xpc"><div class="rs-h"><span>${L(g)}</span></div><div class="rs-v">${TARGET}<b id="rs-c"></b></div></div>
    <div class="rs-box xpt"><div class="rs-h"><span>${L(T.pts)}</span></div><div class="rs-v">${BOLT}<b id="rs-p"></b></div></div>
    <div class="rs-box xtm"><div class="rs-h"><span>${L(T.tm)}</span></div><div class="rs-v">${CLOCK}<b id="rs-tm"></b></div></div></div>
    <div class="rs-foot"><div class="rs-fin"><button class="btn btn-outline" id="rs-rv" type="button">${L(T.rev)}</button><button class="btn btn-primary" id="rs-go" type="button">${L(T.go)}</button></div></div>`;
  $('#rs-rv').onclick = () => { try { sessionStorage.removeItem('pp_res'); } catch (e) {} leave('#/practice'); };
  $('#rs-go').onclick = () => leave('#/save');
  cntT.forEach(cancelAnimationFrame); cntT = []; fwT.forEach(clearTimeout); fwT = []; cv = $('#rs-cv'); cx = cv.getContext('2d'); bs = [];
  const pf = (v) => num(v + '%'), nf = (v) => num(v);
  if (fresh) {
    play('lesson'); fit(); count($('#rs-c'), pc, 500, pf); count($('#rs-p'), 20, 2200, nf); count($('#rs-tm'), sec, 3100, clock); fireworks();
    [400, 2100, 3000].forEach((d) => fwT.push(setTimeout(() => { if (!root.hidden) buzz(30); }, d)));
  } else { $('#rs-p').textContent = nf(20); $('#rs-c').textContent = pf(pc); $('#rs-tm').textContent = clock(sec); }
}
const PHONE = `<svg viewBox="0 0 180 210" aria-hidden="true"><ellipse class="sv-sh" cx="90" cy="196" rx="34" ry="5" fill="#000" opacity=".3"/><g class="sv-ph"><rect x="58" y="24" width="64" height="108" rx="10" fill="#fff" stroke="#59676f" stroke-width="5"/><rect x="78" y="29" width="24" height="5" rx="2.5" fill="#59676f"/><circle cx="90" cy="64" r="9" fill="#1cb0f6"/><circle cx="79" cy="86" r="8" fill="#ff4b4b"/><circle cx="101" cy="86" r="8" fill="#ffc800"/>
<rect class="cf c1" x="26" y="22" width="12" height="12" rx="2" fill="#7a3a42" transform="rotate(-18 32 28)"/><rect class="cf c2" x="46" y="52" width="7" height="7" rx="1.5" fill="#8a6a1c" transform="rotate(25 49 55)"/><rect class="cf c3" x="136" y="40" width="14" height="14" rx="2" fill="#1f5a7a" transform="rotate(28 143 47)"/><rect class="cf c4" x="124" y="16" width="7" height="7" rx="1.5" fill="#7a3a42" transform="rotate(-30 127 19)"/></g></svg>`;
export function showSave() {
  sroot = $('#v-save');
  sroot.innerHTML = `<div class="sv-in"><div class="sv-art">${PHONE}</div><h1 class="sv-t">${L(T.sT)}</h1><p class="sv-x">${L(T.sX)}</p><div class="sv-b"><button class="btn btn-primary" id="sv-go" type="button">${L(T.sG)}</button><button class="btn btn-outline" id="sv-later" type="button">${L(T.sL)}</button></div></div>`;
  $('#sv-go').onclick = () => { try { sessionStorage.removeItem('pp_have'); } catch (e) {} leave('#/age'); };
  $('#sv-later').onclick = () => leave('#/login');
}
