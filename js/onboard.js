// শুরুর ধাপ: ভাষা → বিষয় (বই) → কতটুকু জানেন → দৈনিক লক্ষ্য → প্রস্তুত
import { getLang, setLang, t, num, LANG_LIST } from './i18n.js';
import { bookSvg } from './books.js';
const $ = (s, r = document) => r.querySelector(s);
const KEY = 'pp_onb';
try { localStorage.removeItem(KEY); } catch (e) {} // পুরোনো সংরক্ষণ মুছে ফেলা
const TTL = 20 * 60 * 1000; // ২০ মিনিট পর আগের বাছাই আর মনে রাখা হয় না (ব্রাউজার চালু করার পর পুরোনো সবুজ বাছাই থাকে না)
export const getOnb = () => { try { const o = JSON.parse(sessionStorage.getItem(KEY)) || {}; if (Date.now() - (o._t || 0) > TTL) { sessionStorage.removeItem(KEY); return {}; } const { _t, ...r } = o; return r; } catch (e) { return {}; } };
const setOnb = (o) => { try { sessionStorage.setItem(KEY, JSON.stringify({ ...o, _t: Date.now() })); } catch (e) {} };
export const clearOnb = () => { try { sessionStorage.removeItem(KEY); } catch (e) {} };
export const ORDER = ['/lang', '/subject', '/level', '/goal', '/perks', '/begin', '/ready'];
export const NEED = { '/subject': 'lang', '/level': 'subject', '/goal': 'level', '/perks': 'goal', '/begin': 'goal', '/ready': 'begin' };
const L = (bn, en, ar) => ({ bn, en, ar }[getLang()]);
const reduce = () => matchMedia('(prefers-reduced-motion:reduce)').matches;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- লোগো (গোল-মাথা মোটা রেখার অক্ষর) ----
export const logoSvg = (cls = 'wm') => '<svg class="' + cls + '" viewBox="0 0 405 101" role="img" aria-label="paglapora"><g fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><circle cx="22" cy="50" r="17"/><path d="M5 33V91"/><circle cx="73" cy="50" r="17"/><path d="M90 33V67"/><circle cx="124" cy="50" r="17"/><path d="M141 33V76c0 9-7 15-16 15h-8"/><path d="M158 10V67"/><circle cx="192" cy="50" r="17"/><path d="M209 33V67"/><circle cx="243" cy="50" r="17"/><path d="M226 33V91"/><circle cx="294" cy="50" r="17"/><path d="M328 33V67M328 52C328 40 336 33 349 33"/><circle cx="383" cy="50" r="17"/><path d="M400 33V67"/></g></svg>';

// ---- পতাকা (কার্টুন ধাঁচ, SVG) ----
let fid = 0;
export function flagSvg(id, cls = 'flag') {
  const k = 'fc' + (++fid), head = '<svg class="' + cls + '" viewBox="0 0 40 28" aria-hidden="true" focusable="false"><defs><clipPath id="' + k + '"><rect width="40" height="28" rx="4.500"/></clipPath></defs><g clip-path="url(#' + k + ')">';
  let b = '';
  if (id === 'en') {
    for (let i = 0; i < 7; i++) b += '<rect y="' + i * 4 + '" width="40" height="4" fill="' + (i % 2 ? '#f4eeee' : '#ff5a5a') + '"/>';
    b += '<rect width="19" height="16" fill="#1cb0f6"/>';
    [[4, 4.500], [9.500, 4.500], [15, 4.500], [4, 10.500], [9.500, 10.500], [15, 10.500]].forEach((p) => { const x = p[0], y = p[1]; b += '<path d="M' + x + ' ' + (y - 2.200) + 'l.7 1.500 1.600.200-1.200 1.100.300 1.600L' + x + ' ' + (y + 1.200) + 'l-1.400.800.300-1.600-1.200-1.100 1.600-.200z" fill="#fff"/>'; });
  } else if (id === 'ar') {
    b += '<rect width="40" height="28" fill="#27a65a"/><path d="M9 11.500c2.200-3 3.400 2.600 5.200-.3s3 2.600 4.800-.2 3 2.600 4.800-.2 3 2.600 4.200 0" fill="none" stroke="#fff" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15.500c1.800-2 3 1.400 4.600-.4s2.800 1.400 4.400-.3" fill="none" stroke="#fff" stroke-width="1.500" stroke-linecap="round" opacity=".85"/><rect x="9.500" y="19.600" width="21" height="1.700" rx=".85" fill="#fff"/><path d="M9.500 18.700l-2 1.800 2 1.800z" fill="#fff"/>';
  } else {
    b += '<rect width="40" height="28" fill="#169b5c"/><circle cx="17.500" cy="14" r="6.400" fill="#ff4b4b"/>';
  }
  return head + b + '</g></svg>';
}

// ---- ১৫টি বই — আলাদা আলাদা রং (ডুয়োলিংগোর রঙের পরিবার থেকে) ----
export const SUBJECTS = [
  { id: 'quran', c: '#58cc02', n: ['কুরআন', 'Quran', 'القرآن'] },
  { id: 'hadith', c: '#00cd9c', n: ['হাদিস', 'Hadith', 'الحديث'] },
  { id: 'aqaid', c: '#ff86d0', n: ['আকাইদ-ফিকাহ', 'Aqaid & Fiqh', 'العقائد والفقه'] },
  { id: 'arabic1', c: '#2b70c9', n: ['আরবি প্রথম', 'Arabic 1', 'العربية 1'] },
  { id: 'arabic2', c: '#6c63ff', n: ['আরবি দ্বিতীয়', 'Arabic 2', 'العربية 2'] },
  { id: 'bangla1', c: '#ff9600', n: ['বাংলা প্রথম', 'Bangla 1', 'البنغالية 1'] },
  { id: 'bangla2', c: '#ffc800', n: ['বাংলা দ্বিতীয়', 'Bangla 2', 'البنغالية 2'] },
  { id: 'english1', c: '#ce82ff', n: ['ইংরেজি প্রথম', 'English 1', 'الإنجليزية 1'] },
  { id: 'english2', c: '#e04fb4', n: ['ইংরেজি দ্বিতীয়', 'English 2', 'الإنجليزية 2'] },
  { id: 'math', c: '#ff7a45', n: ['সাধারণ গণিত', 'General Math', 'الرياضيات العامة'] },
  { id: 'biology', c: '#2fc0c8', n: ['জীববিজ্ঞান', 'Biology', 'الأحياء'] },
  { id: 'physics', c: '#1cb0f6', n: ['পদার্থবিজ্ঞান', 'Physics', 'الفيزياء'] },
  { id: 'chemistry', c: '#89e219', n: ['রসায়ন', 'Chemistry', 'الكيمياء'] },
  { id: 'hmath', c: '#ff4b4b', n: ['উচ্চতর গণিত', 'Higher Math', 'الرياضيات العليا'] },
  { id: 'gk', c: '#b97a3c', n: ['সাধারণ জ্ঞান', 'General Knowledge', 'الثقافة العامة'] },
];
const sName = (s) => L(...s.n);
export const LEVELS = [
  { t: ['আমি এই বিষয়ে একদম নতুন', "I'm brand new to this subject", 'أنا مبتدئ تمامًا في هذه المادة'], s: ['নতুন', 'Beginner', 'مبتدئ'], say: ['ঠিক আছে — শুরুটা আজই!', "Alright — let's start today!", 'حسنًا — لنبدأ اليوم!'] },
  { t: ['কিছু প্রাথমিক বিষয় জানি', 'I know some basics', 'أعرف بعض الأساسيات'], s: ['প্রাথমিক', 'Basic', 'أساسي'], say: ['বেশ! এগিয়ে যাওয়া যাক।', "Nice! Let's move ahead.", 'جيد! لنتقدّم.'] },
  { t: ['মৌলিক বিষয়গুলো বুঝি', 'I understand the fundamentals', 'أفهم الأساسيات'], s: ['মৌলিক', 'Intermediate', 'متوسط'], say: ['বাহ! দারুণ তো!', 'Wow, great!', 'رائع!'] },
  { t: ['বেশিরভাগ অধ্যায় ভালো পারি', "I'm good at most chapters", 'أُجيد معظم الفصول'], s: ['ভালো', 'Good', 'جيد'], say: ['চমৎকার! তুমি তো প্রায় তৈরি।', "Excellent! You're almost ready.", 'ممتاز! أنت شبه جاهز.'] },
  { t: ['প্রায় সবকিছুই আত্মবিশ্বাসের সাথে পারি', "I'm confident in almost everything", 'أنا واثق في كل شيء تقريبًا'], s: ['দক্ষ', 'Advanced', 'متقدم'], say: ['দারুণ! তাহলে পাগলের মতো ছুটবে!', "Great! You'll race ahead!", 'رائع! ستنطلق بقوة!'] },
];
export const GOALS = [{ m: 3, q: 25, t: ['সহজ', 'Easy', 'سهل'] }, { m: 10, q: 50, t: ['নিয়মিত', 'Regular', 'منتظم'] }, { m: 15, q: 75, t: ['দৃঢ়প্রতিজ্ঞ', 'Committed', 'ملتزم'] }, { m: 30, q: 100, t: ['কর্মঠ', 'Active', 'نشيط'] }];
const minText = (m) => L(num(m) + ' মিনিট/দিন', num(m) + ' min / day', num(m) + ' دقيقة / يوم');
const GOAL_MSG = { 3: ['প্রতিদিন মাত্র ৩ মিনিট — এটুকুতেই অভ্যাস গড়ে ওঠে।', 'Just 3 minutes a day — that is enough to build the habit.', 'ثلاث دقائق فقط يوميًا — تكفي لبناء العادة.'], 10: ['১০ মিনিট রোজ — ধীরে ধীরে বিরাট পরিবর্তন আসবে।', 'Ten minutes every day — big change comes step by step.', 'عشر دقائق يوميًا — يأتي التغيير الكبير خطوة بخطوة.'], 15: ['১৫ মিনিটের নিয়মিত পড়া — সফলতার সবচেয়ে মজবুত সিঁড়ি।', 'Fifteen steady minutes — the strongest ladder to success.', 'خمس عشرة دقيقة منتظمة — أقوى سلّم نحو النجاح.'], 30: ['৩০ মিনিট রোজ! তুমি সত্যিই কর্মঠ — ফলাফল চোখে পড়ার মতো হবে।', '30 minutes a day! You are truly active — the results will show.', 'ثلاثون دقيقة يوميًا! أنت نشيط حقًا — ستظهر النتائج.'] };

// ---- বই: নকশা js/books.js-এ ----
// ---- আইকন (SVG): কথা, কার্ড, ঘড়ি, বই, কম্পাস ----
export const ICON = {
  chat: '<svg viewBox="0 0 56 56" aria-hidden="true" focusable="false"><path d="M8 9h25a5 5 0 0 1 5 5v13a5 5 0 0 1-5 5H20l-8 6v-6H8a5 5 0 0 1-5-5V14a5 5 0 0 1 5-5z" fill="#e7c9ff"/><path d="M24 21h24a5 5 0 0 1 5 5v13a5 5 0 0 1-5 5h-3v6l-8-6H24a5 5 0 0 1-5-5V26a5 5 0 0 1 5-5z" fill="#ce82ff"/><rect x="26" y="29" width="18" height="3.200" rx="1.600" fill="#fff" opacity=".9"/><rect x="26" y="35" width="11" height="3.200" rx="1.600" fill="#fff" opacity=".7"/></svg>',
  cards: '<svg viewBox="0 0 56 56" aria-hidden="true" focusable="false"><rect x="21" y="8" width="28" height="38" rx="6" transform="rotate(10 35 27)" fill="#1899d6"/><rect x="7" y="9" width="30" height="38" rx="6" transform="rotate(-8 22 28)" fill="#8fd8ff"/><path d="M15.500 36l6.500-17 6.500 17M17.700 31h8.600" transform="rotate(-8 22 28)" fill="none" stroke="#fff" stroke-width="3.600" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  watch: '<svg viewBox="0 0 56 56" aria-hidden="true" focusable="false"><rect x="19" y="3" width="18" height="10" rx="3" fill="#ffb020"/><rect x="19" y="43" width="18" height="10" rx="3" fill="#ffb020"/><rect x="10" y="12" width="36" height="32" rx="11" fill="#fff4d6" stroke="#ff9600" stroke-width="4.500"/><rect x="46" y="24" width="4" height="8" rx="2" fill="#ff9600"/><path d="M28 21v8h7" fill="none" stroke="#ff9600" stroke-width="3.600" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  one: '<svg viewBox="0 0 56 56" aria-hidden="true" focusable="false"><rect x="10" y="5" width="34" height="46" rx="5" fill="#ffc800"/><rect x="43" y="5" width="3.500" height="46" rx="1.700" fill="#e5a900"/><path d="M33 5v13l-4-3-4 3V5z" fill="#ff4b4b"/><path d="M22 34l5-4v16" fill="none" stroke="#c98a00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  compass: '<svg viewBox="0 0 56 56" aria-hidden="true" focusable="false"><circle cx="28" cy="28" r="23" fill="#fff" stroke="#1c7fd1" stroke-width="5"/><g transform="rotate(45 28 28)"><path d="M28 12l7 16h-14z" fill="#ff4b4b"/><path d="M28 44l-7-16h14z" fill="#c9ced3"/></g><circle cx="28" cy="28" r="2.600" fill="#fff"/></svg>',
};
const sig = (n) => '<span class="sig" aria-hidden="true">' + [0, 1, 2, 3].map((i) => '<i class="' + (i < n ? 'on' : '') + '"></i>').join('') + '</span>';

// ---- মেসেজ-বক্স: অক্ষর একটা একটা করে টাইপ হয় ----
const seg = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
const graphemes = (s) => (seg ? [...seg.segment(s)].map((x) => x.segment) : Array.from(s));
let btok = 0;
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
async function setBubble(parts, animate = true) { // parts: [[text, 'hl'?], ...]
  const my = ++btok, b = $('#ob-bubble'), gh = $('.gh', b), ty = $('.ty', b);
  const html = (arr) => arr.map((p) => (p[1] ? '<b class="' + p[1] + '">' + esc(p[0]) + '</b>' : esc(p[0]))).join('');
  gh.innerHTML = html(parts); b.setAttribute('aria-label', parts.map((p) => p[0]).join(''));
  if (!animate || reduce()) { ty.innerHTML = html(parts); return; }
  ty.innerHTML = ''; const cells = []; parts.forEach((p) => graphemes(p[0]).forEach((g) => cells.push([g, p[1]])));
  const out = []; await sleep(60);
  for (let i = 0; i < cells.length; i++) {
    if (my !== btok) return; const [g, c] = cells[i], last = out[out.length - 1];
    if (last && last[1] === c) last[0] += g; else out.push([g, c]); ty.innerHTML = html(out); await sleep(g === ' ' ? 14 : 24);
  }
}

let go = () => {}, cur = null, shown = false, lastIdx = -1, tok = 0, ddOpen = false;
const wide = () => matchMedia('(min-width:48em)').matches;
export function leaveOnboard() { shown = false; cur = null; lastIdx = -1; closeDd(); }
// প্রশ্নের বক্স: বর্ডার ও নিচের কোণা একটাই রেখায় আঁকা (জোড়া নেই)
function drawBubble() {
  const b = $('#ob-bubble'); if (!b) return; const w = b.offsetWidth, h = b.offsetHeight; if (!w || !h) return;
  const side = $('#ob-say').classList.contains('with-bk'), n = (v) => +v.toFixed(1);
  const r = side ? 14 : 18, x0 = 1, y0 = 1, x1 = w - 1, y1 = h - 1;
  let d;
  if (side) { // বইয়ের দিকে (বাঁয়ে) ছোট কোণা: বক্সের বর্ডারের সঙ্গে একটানা
    const cy = h / 2;
    d = ['M', x0 + r, y0, 'H', x1 - r, 'A', r, r, 0, 0, 1, x1, y0 + r, 'V', y1 - r, 'A', r, r, 0, 0, 1, x1 - r, y1, 'H', x0 + r, 'A', r, r, 0, 0, 1, x0, y1 - r,
      'V', cy + 8.5, 'Q', x0, cy + 6, x0 - 4.5, cy + 3.2, 'L', x0 - 9.5, cy + 1, 'Q', x0 - 13, cy, x0 - 9.5, cy - 1, 'L', x0 - 4.5, cy - 3.2, 'Q', x0, cy - 6, x0, cy - 8.5,
      'V', y0 + r, 'A', r, r, 0, 0, 1, x0 + r, y0, 'Z'];
  } else { // নিচের মাঝখানে ছোট কোণা
    const cx = w / 2;
    d = ['M', x0 + r, y0, 'H', x1 - r, 'A', r, r, 0, 0, 1, x1, y0 + r, 'V', y1 - r, 'A', r, r, 0, 0, 1, x1 - r, y1,
      'H', cx + 17, 'Q', cx + 12, y1, cx + 9.5, y1 + 5.5, 'L', cx + 4.8, y1 + 13.5, 'Q', cx, y1 + 21, cx - 4.8, y1 + 13.5, 'L', cx - 9.5, y1 + 5.5, 'Q', cx - 12, y1, cx - 17, y1,
      'H', x0 + r, 'A', r, r, 0, 0, 1, x0, y1 - r, 'V', y0 + r, 'A', r, r, 0, 0, 1, x0 + r, y0, 'Z'];
  }
  const pa = $('.b-bg path', b);
  pa.setAttribute('d', d.map((v) => (typeof v === 'number' ? n(v) : v)).join(' '));
}
export function initOnboard(nav, back) {
  go = nav;
  if (window.ResizeObserver) new ResizeObserver(drawBubble).observe($('#ob-bubble')); addEventListener('resize', drawBubble);
  const goBack = () => { const i = ORDER.indexOf(cur), prev = i > 0 ? ORDER[i - 1] : '/start'; (back || go)(prev); };
  $('#ob-back').addEventListener('click', goBack);
  document.addEventListener('click', (e) => { if (e.target.closest('.ob-site .ob-back')) goBack(); });
  $('#ob-next').addEventListener('click', () => { const i = ORDER.indexOf(cur); if (cur === '/lang') { const x = getOnb(); x.lang = getLang(); setOnb(x); } go(i < ORDER.length - 1 ? ORDER[i + 1] : '/practice'); });
  $('.ob-scroll').addEventListener('scroll', (e) => $('#v-step').classList.toggle('scrolled', e.target.scrollTop > 2), { passive: true });
  document.addEventListener('click', (e) => { if (ddOpen && !e.target.closest('.ob-lang-wrap')) closeDd(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDd(); });
}
function closeDd() { ddOpen = false; const w = $('.ob-lang-wrap'); if (w) { w.classList.remove('open'); const b = $('.ob-lang', w); if (b) b.setAttribute('aria-expanded', 'false'); } }

// সাইটের ভাষা — আসল ড্রপডাউন (তালিকা LANG_LIST থেকে)
function paintSite(r) {
  const site = $('.ob-site'); if (r === '/lang') { site.innerHTML = '<span class="sl"><button class="ob-back" type="button" aria-label="' + t('পেছনে যান') + '"></button><span class="wordmark sm">' + logoSvg('wm') + '</span></span>'; return; }
  const me = LANG_LIST.find((x) => x.id === getLang()) || LANG_LIST[0];
  site.innerHTML = '<span class="sl"><button class="ob-back" type="button" aria-label="' + t('পেছনে যান') + '"></button><span class="wordmark sm">' + logoSvg('wm') + '</span></span><div class="ob-lang-wrap"><button class="ob-lang" type="button" aria-haspopup="listbox" aria-expanded="false">' + L('সাইটের ভাষা', 'Site language', 'لغة الموقع') + ': ' + me.name + '<i class="caret"></i></button><div class="dd" role="listbox" hidden>' +
    LANG_LIST.map((x) => '<button class="dd-i' + (x.id === getLang() ? ' sel' : '') + '" type="button" role="option" data-id="' + x.id + '" aria-selected="' + (x.id === getLang()) + '">' + flagSvg(x.id, 'flag sm') + '<span>' + x.name + '</span></button>').join('') + '</div></div>';
  const wrap = $('.ob-lang-wrap', site), btn = $('.ob-lang', wrap), dd = $('.dd', wrap);
  btn.addEventListener('click', (e) => { e.stopPropagation(); ddOpen = !ddOpen; dd.hidden = !ddOpen; wrap.classList.toggle('open', ddOpen); btn.setAttribute('aria-expanded', ddOpen); });
  dd.addEventListener('click', (e) => { const i = e.target.closest('.dd-i'); if (!i) return; closeDd(); setLang(i.dataset.id); });
  dd.hidden = true;
}

export async function renderStep(r) {
  const my = ++tok, sec = $('#v-step'), idx = ORDER.indexOf(r), same = r === cur, dir = idx >= lastIdx ? 1 : -1;
  sec.style.setProperty('--d', same ? 0 : dir);
  if (shown && !same && !reduce()) { sec.classList.add('out'); await sleep(210); if (my !== tok) return; sec.classList.remove('out'); }
  paint(r, !shown || !same); shown = true; cur = r; lastIdx = idx;
  if (!same && !reduce()) { sec.classList.add('in'); setTimeout(() => sec.classList.remove('in'), 520); }
}
function paint(r, typeIt) {
  const sec = $('#v-step'), o = getOnb(), body = $('#ob-body'), next = $('#ob-next'), i = ORDER.indexOf(r);
  sec.dataset.step = r.slice(1); $('#ob-bar').style.width = (i >= 2 ? 14 + (i - 2) * (86 / (ORDER.length - 3)) : 0) + '%'; $('.ob-scroll').scrollTop = 0; sec.classList.remove('scrolled');
  next.textContent = t(r === '/goal' ? 'আমি পারবই' : 'চালিয়ে যান'); next.disabled = true; body.className = 'ob-body'; body.innerHTML = '';
  $('#ob-h').textContent = r === '/lang' ? L('আপনি কোন ভাষায় কথা বলেন?', 'Which language do you speak?', 'ما اللغة التي تتحدثها؟') : r === '/subject' ? L('আপনি কোন বিষয়ে শিখতে চান?', 'What would you like to learn?', 'ماذا تريد أن تتعلّم؟') : ''; paintSite(r);
  const sd = ['/level', '/goal', '/perks', '/begin'].includes(r), sb = SUBJECTS.find((x) => x.id === o.subject) || SUBJECTS[0];
  $('#ob-say').classList.toggle('with-bk', sd); $('#say-bk').innerHTML = sd ? bookSvg(sb, 'bk say', true) : ''; requestAnimationFrame(drawBubble);
  const say = (parts, anim = true) => setBubble(parts, anim);
  const pick = (key, val, react) => { const x = getOnb(); if (key === 'subject' && x.subject !== val) { delete x.level; delete x.begin; } x[key] = val; setOnb(x); body.querySelectorAll('.opt').forEach((e) => { const on = e.dataset.v === String(val); e.classList.toggle('sel', on); e.setAttribute('aria-pressed', on); }); next.disabled = false; if (react) say(react); };
  if (r === '/lang') {
    const sel = o.lang || getLang(); say([[L('আপনি কোন ভাষায় কথা বলেন?', 'Which language do you speak?', 'ما اللغة التي تتحدثها؟')]], typeIt);
    const nm = { en: ['ইংরেজি', 'English', 'الإنجليزية'], ar: ['আরবি', 'Arabic', 'العربية'], bn: ['বাংলা', 'Bangla', 'البنغالية'] };
    body.innerHTML = '<div class="opts">' + LANG_LIST.map((l) => '<button class="opt" type="button" data-v="' + l.id + '">' + flagSvg(l.id) + '<span>' + L(...(nm[l.id] || [l.name, l.name, l.name])) + '</span></button>').join('') + '</div>';
    body.querySelectorAll('.opt').forEach((e) => e.addEventListener('click', () => { const x = getOnb(); x.lang = e.dataset.v; setOnb(x); body.querySelectorAll('.opt').forEach((b) => b.classList.toggle('sel', b === e)); if (e.dataset.v !== getLang()) setLang(e.dataset.v); setTimeout(() => { if (cur === '/lang') go('/subject'); }, 260); }));
    const e = body.querySelector('.opt[data-v="' + sel + '"]'); if (e) { e.classList.add('sel'); next.disabled = false; }
  } else if (r === '/subject') {
    say([[L('আপনি কোন বিষয়ে শিখতে চান?', 'What would you like to learn?', 'ماذا تريد أن تتعلّم؟')]], typeIt);
    body.innerHTML = '<div class="books">' + SUBJECTS.map((s) => '<button class="opt book" type="button" data-v="' + s.id + '">' + bookSvg(s) + '<span class="bn">' + sName(s) + '</span></button>').join('') + '</div>';
    body.querySelectorAll('.opt').forEach((e) => e.addEventListener('click', () => { pick('subject', e.dataset.v); setTimeout(() => { if (cur === '/subject') go('/level'); }, 240); }));
    if (o.subject) { const e = body.querySelector('.opt[data-v="' + o.subject + '"]'); if (e) { e.classList.add('sel'); next.disabled = false; } }
  } else if (r === '/level') {
    const s = SUBJECTS.find((x) => x.id === o.subject) || SUBJECTS[0];
    say([[L('এই বিষয়ে আপনি কতটুকু জানেন?', 'How much do you know about this subject?', 'ما مدى معرفتك بهذه المادة؟')]], typeIt);
    body.innerHTML = '<div class="opts">' + LEVELS.map((l, k) => '<button class="opt" type="button" data-v="' + k + '">' + sig(k) + '<span>' + L(...l.t) + '</span></button>').join('') + '</div>';
    body.querySelectorAll('.opt').forEach((e) => e.addEventListener('click', () => pick('level', +e.dataset.v, [[L(...LEVELS[+e.dataset.v].say)]])));
    if (typeof o.level === 'number') { const e = body.querySelector('.opt[data-v="' + o.level + '"]'); if (e) { e.classList.add('sel'); next.disabled = false; say([[L(...LEVELS[o.level].say)]], false); } }
  } else if (r === '/goal') {
    say([[L('আপনার দৈনিক লক্ষ্য কী?', "What's your daily goal?", 'ما هدفك اليومي؟')]], typeIt);
    const react = (g) => [[L('প্রথম সপ্তাহেই সমাধান করতে পারবেন ', 'In your very first week you can solve ', 'في أسبوعك الأول يمكنك حل ')], [L(num(g.q) + 'টি প্রশ্ন', num(g.q) + ' questions', num(g.q) + ' سؤالًا'), 'hl'], [L('!', '!', '!')]];
    body.innerHTML = '<div class="opts">' + GOALS.map((g) => '<button class="opt" type="button" data-v="' + g.m + '"><span>' + minText(g.m) + '</span><span class="r">' + L(...g.t) + '</span></button>').join('') + '</div>';
    body.querySelectorAll('.opt').forEach((e) => e.addEventListener('click', () => pick('goal', +e.dataset.v, react(GOALS.find((g) => g.m === +e.dataset.v)))));
    if (o.goal) { const g = GOALS.find((x) => x.m === o.goal); const e = body.querySelector('.opt[data-v="' + o.goal + '"]'); if (e && g) { e.classList.add('sel'); next.disabled = false; say(react(g), false); } }
  } else if (r === '/perks') {
    say([[L('চলুন দেখি, এখান থেকে আপনি কী পাবেন!', "Let's see what you will get from here!", 'لنرَ ما الذي ستحصل عليه هنا!')]], typeIt);
    const P = [['chat', ['আত্মবিশ্বাসের সাথে পরীক্ষা দিন', 'Walk into the exam with confidence', 'ادخل الاختبار بثقة'], ['বোর্ড বইয়ের অধ্যায় ধরে ধরে প্রশ্ন-উত্তরের অনুশীলন', 'Chapter-by-chapter practice from your board books', 'تدريب على كل فصل من كتب المنهج']], ['cards', ['মূল ধারণা মজবুত করুন', 'Make the key ideas stick', 'ثبّت الأفكار الأساسية'], ['গুরুত্বপূর্ণ সংজ্ঞা, সূত্র ও শব্দের নিয়মিত চর্চা', 'Regular practice of key definitions, formulas and words', 'مراجعة منتظمة للتعريفات والقوانين والكلمات']], ['watch', ['পড়ার অভ্যাস গড়ে তুলুন', 'Build a daily study habit', 'كوّن عادة الدراسة اليومية'], ['দৈনিক লক্ষ্য, রিমাইন্ডার আর মজার চ্যালেঞ্জ', 'Daily goals, reminders and fun challenges', 'أهداف يومية وتذكيرات وتحديات ممتعة']]];
    body.innerHTML = '<ul class="perks">' + P.map((p) => '<li><span class="ic">' + ICON[p[0]] + '</span><div><b>' + L(...p[1]) + '</b><span>' + L(...p[2]) + '</span></div></li>').join('') + '</ul>';
    next.disabled = false;
  } else if (r === '/begin') {
    const s = SUBJECTS.find((x) => x.id === o.subject) || SUBJECTS[0];
    say([[L('চলুন দেখি, কোথা থেকে শুরু করলে সবচেয়ে ভালো হয়!', "Let's see where it is best to start!", 'لنرَ من أين يكون البدء أفضل!')]], typeIt);
    const B = [['start', 'one', ['প্রথম থেকে শুরু', 'Start from the beginning', 'ابدأ من البداية'], [sName(s) + L(' বইয়ের একদম প্রাথমিক অংশ থেকে শুরু করুন', ': start from the very first basics', ': ابدأ من الأساسيات الأولى')]], ['test', 'compass', ['আপনার লেভেল জানুন', 'Find your level', 'اعرف مستواك'], [L('কয়েকটি প্রশ্নের উত্তরে বুঝে নিই কোথা থেকে শুরু করবেন', 'Answer a few questions and we will find where you should begin', 'أجب عن بضعة أسئلة لنعرف من أين تبدأ')]]];
    body.innerHTML = '<div class="opts">' + B.map((x) => '<button class="opt card" type="button" data-v="' + x[0] + '"><span class="ic">' + ICON[x[1]] + '</span><span class="tx"><b>' + L(...x[2]) + '</b><span>' + x[3][0] + '</span></span></button>').join('') + '</div>';
    body.querySelectorAll('.opt').forEach((e) => e.addEventListener('click', () => pick('begin', e.dataset.v)));
    if (o.begin) { const e = body.querySelector('.opt[data-v="' + o.begin + '"]'); if (e) { e.classList.add('sel'); next.disabled = false; } }
  } else {
    const s = SUBJECTS.find((x) => x.id === o.subject) || SUBJECTS[0], test = o.begin === 'test';
    say([[L('সব প্রস্তুত! চলুন শুরু করি।', "All set! Let's get started.", 'كل شيء جاهز! لنبدأ.')]], typeIt); next.disabled = false; body.classList.add('ready');
    body.innerHTML = '<div class="r-art"><span class="r-glow"></span>' + bookSvg(s, 'bk big', true) + '<span class="r-sh"></span><i class="m-sp s1 rs r1"></i><i class="m-sp s2 rs r2"></i><i class="m-sp s3 rs r3"></i><i class="m-sp s2 rs r4"></i></div>' +
      '<h2 class="r-h">' + L('চমৎকার সিদ্ধান্ত!', 'Great decision!', 'قرار رائع!') + '</h2><p class="r-p">' + (test ? L('আপনি আপনার লেভেল জানতে চেয়েছেন।', 'You chose to find your level.', 'اخترت أن تعرف مستواك.') + '<br>' + L('চলুন আপনার লেভেলটি জানা যাক!', "Let's find out your level!", 'لنعرف مستواك!') : L('আপনি শুরু থেকে শুরু করতে চেয়েছেন।', 'You chose to start from the beginning.', 'اخترت أن تبدأ من البداية.') + '<br>' + L('চলুন শুরু থেকে শুরু করা যাক!', "Let's start from the beginning!", 'لنبدأ من البداية!')) + '</p>';
  }
}
