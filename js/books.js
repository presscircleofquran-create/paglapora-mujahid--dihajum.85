// বইয়ের আইকন: আসল বইয়ের কভারের রং ও নকশা থেকে অনুপ্রাণিত, ছোট ও কার্টুন ধাঁচের (কোনো লেখা বা বোর্ডের লোগো নেই)
let bid = 0;
const hexc = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (h, t, to) => '#' + hexc(h).map((v) => Math.round(v + (to - v) * t).toString(16).padStart(2, '0')).join('');

// কভারের ভেতরের নকশা (স্থানাঙ্ক ০–৪৪ × ০–৬৬)
const flower = (cx, cy, c) => '<g fill="' + c + '">' + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => '<circle cx="' + (cx + 6.200 * Math.cos(a * Math.PI / 180)).toFixed(2) + '" cy="' + (cy + 6.200 * Math.sin(a * Math.PI / 180)).toFixed(2) + '" r="3.300"/>').join('') + '<circle cx="' + cx + '" cy="' + cy + '" r="7"/></g>';
const waves = (c) => '<path d="M16 43Q22 38 28 43M14.500 47.500Q22 41.500 29.500 47.500M16.500 52Q22 47.500 27.500 52" fill="none" stroke="' + c + '" stroke-width="1.700" stroke-linecap="round"/>';
const chev = (o) => '<rect width="44" height="66" fill="' + o.bg + '"/>' + flower(22, 45.500, o.blob) + waves(o.ink) +
  '<polygon points="0,0 44,0 44,23.500 22,36 0,23.500" fill="' + o.edge + '"/><polygon points="0,0 44,0 44,21 22,33.500 0,21" fill="' + o.top + '"/>' +
  '<rect x="10" y="7" width="24" height="3" rx="1.500" fill="' + (o.t1 || '#fff') + '"/><rect x="14" y="13" width="16" height="2.400" rx="1.200" fill="' + (o.t2 || '#ffe800') + '"/>' +
  '<rect y="55" width="44" height="11" fill="' + o.band + '"/>';
const tiles = (bg, a, b) => {
  let s = '<rect width="44" height="66" fill="' + bg + '"/><rect x="10" y="6" width="24" height="3.200" rx="1.600" fill="#243e48"/><rect x="14" y="12" width="16" height="2.400" rx="1.200" fill="#243e48" opacity=".7"/>';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { const white = (r + c) % 2 === 0 && !(r === 1 && c === 1) || (r === 1 && c === 1); s += '<rect x="' + (4 + c * 12) + '" y="' + (22 + r * 12) + '" width="12" height="12" fill="' + (white ? '#fff' : ((r * 3 + c) % 4 === 1 ? a : b)) + '"/>'; }
  return s;
};
const hexa = (cx, cy, r) => '<polygon points="' + [0, 1, 2, 3, 4, 5].map((i) => (cx + r * Math.cos((60 * i - 90) * Math.PI / 180)).toFixed(2) + ',' + (cy + r * Math.sin((60 * i - 90) * Math.PI / 180)).toFixed(2)).join(' ') + '" fill="none" stroke="#1f5560" stroke-width="1.100" stroke-linejoin="round"/>';
const inf = (x, y, c) => '<path d="M' + x + ' ' + y + 'c0-3.500 4-3.500 6 0s6 3.500 6 0-4-3.500-6 0-6 3.500-6 0z" fill="none" stroke="' + c + '" stroke-width="1.500" stroke-linecap="round" stroke-linejoin="round"/>';
const orbit = (a) => '<ellipse cx="22" cy="40" rx="15" ry="5.500" transform="rotate(' + a + ' 22 40)" fill="none" stroke="#8e4c92" stroke-width="1"/>';

// পরমাণু (রসায়ন): নিউক্লিয়াস, তিন কক্ষপথ, ইলেকট্রন — মাঝখানে
const atom = () => {
  let g = '', e = '';
  [0, 60, 120].forEach((a, i) => {
    g += '<ellipse cx="22" cy="40" rx="15.500" ry="5.600" transform="rotate(' + a + ' 22 40)" fill="none" stroke="#8c4f93" stroke-width="1.100"/>';
    [[.9, 1], [3.9, 1]].forEach(([t]) => { const th = t + i * 0.7, x = 15.500 * Math.cos(th), y = 5.600 * Math.sin(th), r = a * Math.PI / 180;
      e += '<circle cx="' + (22 + x * Math.cos(r) - y * Math.sin(r)).toFixed(2) + '" cy="' + (40 + x * Math.sin(r) + y * Math.cos(r)).toFixed(2) + '" r="1.900" fill="#b574b8"/>'; });
  });
  return g + e + '<circle cx="20.500" cy="41.500" r="2.300" fill="#b574b8"/><circle cx="24" cy="41.500" r="2.300" fill="#b574b8"/><circle cx="22" cy="38.500" r="2.300" fill="#a65aa8"/><circle cx="22" cy="40.800" r="3.300" fill="#8e2f8e"/><circle cx="21" cy="39.700" r="1" fill="#e6b4e6"/>';
};
// বাল্ব (পদার্থ): নীল আলো
const bulb = () => '<path d="M12.500 34A9.500 9.500 0 1 1 31.500 34C31.500 38.500 27.500 40 26.800 44.500H17.200C16.500 40 12.500 38.500 12.500 34Z" fill="#8ec3ea"/>' +
  '<path d="M17.200 44.500H26.800V50Q26.800 52 24.800 52H19.200Q17.200 52 17.200 50Z" fill="#5f9bd3"/><rect x="19.500" y="51" width="5" height="3.200" rx="1.600" fill="#5f9bd3"/>' +
  '<path d="M19 44.500L17.500 35.500M25 44.500L26.500 35.500" stroke="#2f4254" stroke-width=".8" stroke-linecap="round"/><path d="M17.500 35.500H20L21 32.200L22.700 35.500H26.500" fill="none" stroke="#5f9bd3" stroke-width="1.300" stroke-linecap="round" stroke-linejoin="round"/>';
// তালপাতার মতো পাতা (বাংলা): ডান থেকে বাঁয়ে ঝুঁকে, আগা বাঁ-উপরে
const frond = () => {
  const P = [[48, 59], [34, 57], [16, 53], [4, 43]], B = (t) => { const u = 1 - t; return [0, 1].map((k) => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]); };
  const T = (t) => { const a = B(Math.max(0, t - .01)), b = B(Math.min(1, t + .01)); const d = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / d, (b[1] - a[1]) / d]; };
  let g = '';
  const blade = (t, side, len, ang) => { const p = B(t), u = T(t), c = Math.cos(ang * side), s = Math.sin(ang * side), dx = u[0] * c - u[1] * s, dy = u[0] * s + u[1] * c, nx = -dy * side, ny = dx * side, w = len * .13;
    const m = [p[0] + dx * len * .5, p[1] + dy * len * .5], e = [p[0] + dx * len, p[1] + dy * len];
    return '<path d="M' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + 'Q' + (m[0] + nx * w * 1.6).toFixed(1) + ' ' + (m[1] + ny * w * 1.6).toFixed(1) + ' ' + e[0].toFixed(1) + ' ' + e[1].toFixed(1) + 'Q' + (m[0] - nx * w * .4).toFixed(1) + ' ' + (m[1] - ny * w * .4).toFixed(1) + ' ' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + 'Z" fill="#cdbd8c"/>'; };
  for (let i = 0; i < 13; i++) { const t = .16 + i * .063, l = 8.500 + 11 * Math.sin((.1 + i / 12 * .85) * Math.PI); g += blade(t, 1, l, .62); if (i > 1) g += blade(t + .02, -1, l * .55, .5); }
  return '<path d="M48 59C34 57 16 53 4 43" fill="none" stroke="#cdbd8c" stroke-width="1.300" stroke-linecap="round"/>' + g;
};
// নিউটনের দোলক (পদার্থ)
const cradle = () => {
  let s = '<rect x="6" y="25" width="32" height="2.600" rx="1.300" fill="#3b6c99"/>';
  [0, 1, 2, 3, 4].forEach((i) => {
    const x = 10 + i * 6, sw = i === 0, bx = sw ? x - 7 : x, by = sw ? 44 : 47;
    s += '<path d="M' + x + ' 27L' + bx + ' ' + (by - 4.500) + '" stroke="#3b6c99" stroke-width="1" stroke-linecap="round"/><circle cx="' + bx + '" cy="' + by + '" r="3.200" fill="' + (sw ? '#1f78c8' : '#5b9bd5') + '"/>';
  });
  return '<g transform="translate(22 40) scale(.6) translate(-22 -38)">' + s + '</g>';
};
// ডিএনএ (জীববিজ্ঞান): দুই পাঁচানো সুতো ও ধাপ
const dna = () => {
  const X = (y, ph) => 22 + 6 * Math.sin((y - 27) / 25 * Math.PI * 2 + ph), a = [], b = [];
  for (let y = 27; y <= 53; y += 1) { a.push(X(y, 0).toFixed(2) + ' ' + y); b.push(X(y, Math.PI).toFixed(2) + ' ' + y); }
  let r = '';
  [30, 33.500, 36.500, 43.500, 46.500, 49.500].forEach((y) => { r += '<path d="M' + X(y, 0).toFixed(2) + ' ' + y + 'L' + X(y, Math.PI).toFixed(2) + ' ' + y + '" stroke="#e8f0c4" stroke-width="1.500" stroke-linecap="round"/>'; });
  return r + '<path d="M' + a.join('L') + '" fill="none" stroke="#6b8f3a" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round"/><path d="M' + b.join('L') + '" fill="none" stroke="#4e6f24" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round"/>';
};
const ART = {
  bangla1: () => '<rect width="44" height="66" fill="#0f6b4b"/><circle cx="8" cy="64" r="28" fill="#0b5a40"/>' + frond() + '<circle cx="22" cy="15" r="25.500" fill="#1aa0be"/><circle cx="22" cy="15" r="22.500" fill="#ffe000"/><circle cx="22" cy="15" r="20" fill="#ea2a33"/><rect x="11" y="10" width="22" height="3" rx="1.500" fill="#fff"/><rect x="15" y="16" width="14" height="2.400" rx="1.200" fill="#fff" opacity=".8"/>',
  bangla2: () => '<rect width="44" height="66" fill="#0a8466"/>' + [0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => '<ellipse cx="22" cy="43" rx="3.200" ry="7.200" transform="rotate(' + a + ' 22 51)" fill="' + (i % 2 ? '#ffd23f' : '#ee3b96') + '"/>').join('') + '<circle cx="22" cy="51" r="6.200" fill="#4fc3f7"/><circle cx="22" cy="51" r="3.200" fill="#ffd23f"/><circle cx="22" cy="14" r="26" fill="#78cc9c"/><circle cx="22" cy="14" r="23" fill="#fff"/><circle cx="22" cy="14" r="20.500" fill="#fbae1c"/><rect x="11" y="9" width="22" height="3" rx="1.500" fill="#4a2f10" opacity=".75"/><rect x="15" y="15" width="14" height="2.400" rx="1.200" fill="#4a2f10" opacity=".55"/>',
  english1: () => '<rect width="44" height="66" fill="#f7941d"/><path d="M0 54Q12 46 24 55T44 50V66H0Z" fill="#2f8f3f"/><path d="M0 60Q14 54 26 60T44 58V66H0Z" fill="#1f7a34"/><circle cx="26" cy="15" r="27" fill="#fff6a8"/><circle cx="26" cy="15" r="24" fill="#f7941d"/><circle cx="26" cy="15" r="21.500" fill="#fff6a8"/><circle cx="26" cy="15" r="19" fill="#8e3f96"/><rect x="14" y="10" width="22" height="3" rx="1.500" fill="#ffe94d"/><rect x="18" y="16" width="14" height="2.400" rx="1.200" fill="#fff" opacity=".85"/>',
  english2: () => '<rect width="44" height="66" fill="#f79a56"/><path d="M0 22C2 46 20 56 44 34V66H0Z" fill="#4a2c24"/><path d="M0 38C8 54 28 58 44 46V66H0Z" fill="#8a5430"/><path d="M0 50C12 60 30 58 44 52V66H0Z" fill="#5e3432"/><rect y="58" width="44" height="8" fill="#b01028"/><circle cx="28" cy="15" r="25" fill="#f79a56"/><circle cx="28" cy="15" r="22" fill="#fff4a8"/><circle cx="28" cy="15" r="19.500" fill="#fff200"/><rect x="15" y="9" width="24" height="3.200" rx="1.600" fill="#e0262e"/><rect x="18" y="15" width="18" height="3.200" rx="1.600" fill="#e0262e"/>',
  math: () => tiles('#88c5cc', '#6eb1b7', '#6eb1b7') + hexa(22, 40, 13) + hexa(22, 40, 8.500) + hexa(22, 40, 4),
  physics: () => tiles('#90c6ec', '#d6ecf8', '#d6ecf8') + bulb(),
  chemistry: () => tiles('#c093c8', '#f5e1f3', '#f5e1f3') + atom(),
  biology: () => tiles('#b5d67a', '#d6d8a0', '#e8f0c4') + dna(),
  hmath: () => tiles('#f0b46e', '#fbcb92', '#fbcb92') + '<path d="M11 31H33" stroke="#0057a8" stroke-width="4.500" stroke-linecap="round"/><path d="M16 31V45C16 47 14 48 12.500 48M28 31V43C28 46 30 48 32.500 48" fill="none" stroke="#0057a8" stroke-width="4.200" stroke-linecap="round"/>',
  quran: () => chev({ bg: '#9bd8f5', top: '#ee2347', edge: '#f6c58a', blob: '#62bff0', ink: '#1d2340', band: '#0b6fb4' }),
  aqaid: () => chev({ bg: '#9ad4a0', top: '#f26a4b', edge: '#ffffff', blob: '#5c7f64', ink: '#ffee00', band: '#5e5a2f' }),
  arabic1: () => chev({ bg: '#f7c783', top: '#0b70bb', edge: '#d51f45', blob: '#c4895a', ink: '#ffffff', band: '#a34246' }),
  arabic2: () => chev({ bg: '#2fb89c', top: '#e6e29a', edge: '#86c340', blob: '#0e6f8f', ink: '#ffee00', band: '#1b8a68', t1: '#3a3a2a', t2: '#d63a3a' }),
  hadith: () => chev({ bg: '#a23a9e', top: '#f01565', edge: '#ffffff', blob: '#6c2a6c', ink: '#ffe800', band: '#8b0c3a' }),
  gk: () => '<rect width="44" height="66" fill="#ff9600"/><rect x="10" y="7" width="24" height="3" rx="1.500" fill="#fff"/><rect x="14" y="13" width="16" height="2.400" rx="1.200" fill="#fff" opacity=".8"/><circle cx="22" cy="38" r="16" fill="#1cb0f6" stroke="#fff" stroke-width="2"/><path d="M12 33Q17 27 23 31Q22 37 15 38Z" fill="#58cc02"/><path d="M26 41Q33 39 33.500 46Q30 52 26 48Z" fill="#58cc02"/><ellipse cx="22" cy="38" rx="6.500" ry="16" fill="none" stroke="#fff" stroke-width="1" opacity=".6"/><path d="M6 38H38" stroke="#fff" stroke-width="1" opacity=".6"/>',
};

// s: বিষয় (id ও রং) অথবা শুধু রঙের কোড
export function bookSvg(s, cls = 'bk', noShadow = false) {
  const k = 'bc' + (++bid), id = typeof s === 'string' ? '' : s.id, c = typeof s === 'string' ? s : s.c;
  const inner = ART[id] ? ART[id]() : '<rect width="44" height="66" fill="' + c + '"/><rect x="10" y="16" width="16" height="3.600" rx="1.800" fill="' + mix(c, .55, 255) + '"/><rect x="10" y="24" width="11" height="3.600" rx="1.800" fill="' + mix(c, .55, 255) + '" opacity=".7"/>';
  return '<svg class="' + cls + '" viewBox="0 0 56 80" aria-hidden="true" focusable="false"><defs><clipPath id="' + k + '"><rect x="6" y="4" width="44" height="66" rx="7"/></clipPath><linearGradient id="' + k + 'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient></defs>' +
    (noShadow ? '' : '<ellipse cx="28" cy="76" rx="20" ry="3.200" fill="#000" opacity=".14"/>') +
    '<g clip-path="url(#' + k + ')"><g transform="translate(6 4)">' + inner + '</g><rect x="6" y="4" width="44" height="66" fill="url(#' + k + 'g)"/></g>' +
    '<rect x="6" y="4" width="44" height="66" rx="7" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="1"/>' +
    '</svg>';
}
