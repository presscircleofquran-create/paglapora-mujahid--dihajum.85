// পাতা, রাউটার ও Supabase লগইন। নতুন ব্যবহারকারী প্রথমে "বয়স" পাতা দেখে।
import { initSfx, play, buzz } from './sfx.js';
import { initOnboard, renderStep, getOnb, clearOnb, ORDER, NEED, leaveOnboard, logoSvg } from './onboard.js';
import { stackSvg } from './stack.js';
import { showPractice } from './practice.js';
import { showResult, showSave } from './finish.js';
import { getLang, t, tf, num, toEnDigits, setLang, applyDom, legalHtml } from './i18n.js';
import { configured, signUp, checkPassword, sendOtp, resendSignup, patchProfile, oauth, updateUser, peek, signOut, fromHash, loadUser } from './supabase.js';
const $ = (s, r = document) => r.querySelector(s);
const ids = ['practice', 'result', 'save', 'start', 'login', 'age', 'choose', 'email', 'forgot', 'reset', 'otp', 'more', 'sent', 'welcome', 'home'];
const views = Object.fromEntries(ids.map((k) => ['/' + k, $('#v-' + k)]));
ORDER.forEach((k) => { views[k] = $('#v-step'); });
const topbtn = $('#topbtn'), closeB = $('#close'), backB = $('#back');
const toEn = toEnDigits;
let age = 0; try { age = +sessionStorage.getItem('pp_age') || 0; } catch (e) {}
const BACK = { '/choose': '/age', '/email': '/choose', '/forgot': '/login' }, NOCLOSE = ['/start', '/lang', '/subject', '/level', '/goal', '/perks', '/begin', '/ready', '/practice', '/result', '/save', '/choose', '/email', '/forgot', '/reset', '/otp', '/more', '/sent', '/welcome', '/home'];

setLang(getLang());

// ---- বার্তা / ভুল ----
let st; function snack(m) { const s = $('#snack'); s.textContent = t(m); s.hidden = false; clearTimeout(st); st = setTimeout(() => { s.hidden = true; }, 3200); }
const ERR = { invalid_credentials: 'ইমেইল বা পাসওয়ার্ড ভুল', email_not_confirmed: 'আগে ইমেইলে পাঠানো লিংকে ক্লিক করে নিশ্চিত করুন', user_already_exists: 'এই ইমেইলে আগেই অ্যাকাউন্ট আছে — লগ ইন করুন', email_exists: 'এই ইমেইলে আগেই অ্যাকাউন্ট আছে — লগ ইন করুন', weak_password: 'পাসওয়ার্ড আরও শক্ত দিন (কমপক্ষে ৬ অক্ষর)', same_password: 'নতুন পাসওয়ার্ড আগেরটার মতো হতে পারবে না', over_email_send_rate_limit: 'ইমেইল পাঠানোর সীমা শেষ — কিছুক্ষণ পরে আবার চেষ্টা করুন', over_request_rate_limit: 'অনেকবার চেষ্টা হয়েছে, কিছুক্ষণ পরে আবার করুন', signup_disabled: 'এখন নতুন অ্যাকাউন্ট খোলা বন্ধ আছে', validation_failed: 'ইমেইল বা পাসওয়ার্ড ঠিক নেই', provider_disabled: 'এই পদ্ধতি এখনো চালু করা হয়নি', network: 'ইন্টারনেট সংযোগ নেই', not_configured: 'Supabase কী (anon key) এখনো বসানো হয়নি — js/config.js দেখুন', otp_expired: 'লিংকটির মেয়াদ শেষ — আবার পাঠিয়ে চেষ্টা করুন', no_session: 'সেশন শেষ — আবার লগ ইন করুন' };
const errText = (e) => t(ERR[e && e.code] || (e && e.status === 429 ? ERR.over_request_rate_limit : 'কিছু একটা ভুল হয়েছে, আবার চেষ্টা করুন'));
const bad = (el) => { el.classList.remove('bad'); void el.offsetWidth; el.classList.add('bad'); el.focus(); };
const show = (box, m) => { box.textContent = t(m); box.hidden = false; };
const busy = (btn, on) => { btn.classList.toggle('is-busy', on); btn.disabled = on; };
const isMail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const hook = (type, detail = {}) => dispatchEvent(new CustomEvent('pp:auth', { detail: { type, ...detail } }));

// ---- ইমেইল কোড (OTP) অবস্থা ----
const OTP_LEN = 6, GAP = { login: 60000, signup: 60000, reset: 300000 };
const PURP = { login: { back: '/login', title: 'লগ ইন সম্পূর্ণ করতে', btn: 'লগ ইন করুন' }, signup: { back: '/email', title: 'অ্যাকাউন্ট চালু করতে', btn: 'নিশ্চিত করুন' }, reset: { back: '/forgot', title: 'পাসওয়ার্ড রিসেট করতে', btn: 'নিশ্চিত করুন' } };
let pend = null; try { pend = JSON.parse(sessionStorage.getItem('pp_pend')); } catch (e) {}
const setPend = (o) => { pend = o; try { o ? sessionStorage.setItem('pp_pend', JSON.stringify(o)) : sessionStorage.removeItem('pp_pend'); } catch (e) {} };
// পাঠানোর সময় মনে রাখা (লগ ইন/সাইন আপ: ১ মিনিট, রিসেট: ৫ মিনিট)
const recs = () => { try { return JSON.parse(localStorage.getItem('pp_rec')) || {}; } catch (e) { return {}; } };
const stamp = (k) => { const o = recs(); o[k.toLowerCase()] = Date.now(); try { localStorage.setItem('pp_rec', JSON.stringify(o)); } catch (e) {} };
const wait = (k, gap) => Math.max(0, gap - (Date.now() - (recs()[k.toLowerCase()] || 0)));
const setIntent = (v) => { try { v ? localStorage.setItem('pp_intent', v + '|' + Date.now()) : localStorage.removeItem('pp_intent'); } catch (e) {} };
const getIntent = () => { try { const [v, t] = (localStorage.getItem('pp_intent') || '').split('|'); return v && Date.now() - (+t || 0) < 3600000 ? v : null; } catch (e) { return null; } }; // ১ ঘণ্টা পর্যন্ত
const bn = num;
const okMiss = (er) => er && (er.code === 'otp_disabled' || er.code === 'signup_disabled' || er.code === 'user_not_found'); // ইমেইল আছে কিনা বোঝানো হবে না

// ---- এই ডিভাইসে আগে লগ ইন করা অ্যাকাউন্ট ----
const LAST = 'pp_last';
const lastAcc = () => { try { const o = JSON.parse(localStorage.getItem(LAST)); return o && o.email ? o : null; } catch (e) { return null; } };
const saveAcc = (o) => { try { localStorage.setItem(LAST, JSON.stringify(o)); } catch (e) {} };
function fillWelcome() {
  const o = lastAcc(); if (!o) return; const nm = o.name || o.email.split('@')[0];
  $('#w-av').textContent = (Array.from(nm.trim())[0] || '?').toUpperCase(); $('#w-name').textContent = nm;
  const g = o.provider === 'google' || o.provider === 'facebook'; $('#w-google').hidden = !g; $('#f-welcome').hidden = g;
}
// ---- রাউটার ----
const authed = () => !!peek();
let prevR = '', lastI = 0;
function ghost(v, dir) {
  const b = v.getBoundingClientRect(); if (!b.width) return; const g = v.cloneNode(true); g.removeAttribute('id'); g.querySelectorAll('[id]').forEach((x) => x.removeAttribute('id')); g.hidden = false; g.classList.remove('pg'); g.classList.add('pg-out');
  g.style.cssText = `position:fixed;left:${b.left}px;top:${b.top}px;width:${b.width}px;height:${b.height}px;margin:0;pointer-events:none;z-index:50;--d:${dir}`; g.setAttribute('aria-hidden', 'true'); document.body.appendChild(g); setTimeout(() => g.remove(), 430);
}
function route() {
  let r = location.hash.replace('#', '') || (authed() ? '/home' : lastAcc() ? '/welcome' : '/start');
  if (!views[r]) r = '/start';
  if (ORDER.includes(r) || r === '/start') trackHist(r);
  if (NEED[r] && !getOnb()[NEED[r]] && getOnb()[NEED[r]] !== 0) r = ORDER[ORDER.indexOf(r) - 1];
  if (r === '/welcome') { if (lastAcc()) fillWelcome(); else r = '/login'; }
  if (r === '/choose' && !age) r = '/age';
  if (r === '/home' && !authed()) r = lastAcc() ? '/welcome' : '/login';
  if ((r === '/reset' || r === '/more') && !authed()) r = '/login';
  if (r === '/otp' && !pend) r = '/login';
  if (authed() && !['/reset', '/home', '/more'].includes(r)) r = '/home';
  const oldV = Object.values(views).find((v) => !v.hidden), newV = views[r], ci = history.state && typeof history.state.i === 'number' ? history.state.i : null, dir = ci !== null && ci < lastI ? -1 : 1; if (ci !== null) lastI = ci;
  if (oldV && oldV !== newV && oldV.id !== 'v-step' && newV.id !== 'v-step') ghost(oldV, dir);
  Object.values(views).forEach((v) => { v.hidden = true; }); newV.hidden = false; if (oldV !== newV && newV.id !== 'v-step') { newV.style.setProperty('--d', dir); newV.classList.remove('pg'); void newV.offsetWidth; newV.classList.add('pg'); } $('#auth').classList.toggle('is-ob', r === '/start' || r === '/practice' || r === '/result' || r === '/save' || ORDER.includes(r)); if (ORDER.includes(r)) renderStep(r); else leaveOnboard(); if (r === '/practice') showPractice(prevR !== '/practice'); if (r === '/result') showResult(prevR !== '/result'); if (r === '/save') showSave(); prevR = r;
  const bk = r === '/otp' ? PURP[pend.purpose].back : BACK[r]; closeB.hidden = NOCLOSE.includes(r); backB.hidden = !bk; backB.dataset.to = bk || '';
  topbtn.hidden = true;
  document.title = t({ '/start': 'পাগলা পড়া', '/lang': 'ভাষা', '/subject': 'বিষয়', '/level': 'স্তর', '/goal': 'দৈনিক লক্ষ্য', '/ready': 'প্রস্তুত', '/practice': 'অনুশীলন', '/login': 'লগ ইন করুন', '/age': 'সাইন আপ করুন', '/choose': 'অ্যাকাউন্ট খুলুন', '/email': 'অ্যাকাউন্ট তৈরি করুন', '/forgot': 'পাসওয়ার্ড ভুলে গিয়েছি ', '/reset': 'নতুন পাসওয়ার্ড', '/otp': 'ইমেইল কোড', '/more': 'আরও তথ্য', '/sent': 'বার্তা', '/welcome': 'আবারও স্বাগতম', '/home': 'স্বাগতম' }[r]) + ' · ' + t('পাগলা পড়া');
  if (r === '/otp') openOtp();
  if (r === '/home') loadUser().then((u) => { if (!u) { location.hash = '/login'; return; } const m = u.user_metadata || {}; if (!m.phone || !m.institution) { location.hash = '/more'; return; } saveAcc({ email: u.email || '', name: m.name || m.full_name || '', provider: (u.app_metadata || {}).provider || 'email' }); $('#h-who').textContent = (m.name || m.full_name || '') + (u.email ? ' · ' + u.email : ''); });
}
const go = (p) => { if (location.hash === '#' + p) route(); else location.hash = p; };
addEventListener('hashchange', route);
addEventListener('pp:lang', () => { applyDom(); route(); });
topbtn.addEventListener('click', () => go(topbtn.dataset.go));
backB.addEventListener('click', () => go(backB.dataset.to));
closeB.addEventListener('click', () => { if (history.length > 1 && document.referrer) history.back(); else go('/start'); });
addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (!closeB.hidden) closeB.click(); else if (!backB.hidden) backB.click(); } });
function notice(title, text, btn = 'লগ ইন পাতায় যান', to = '/login') { $('#t-sent').textContent = t(title); $('#s-text').textContent = t(text); $('#s-ok').textContent = t(btn); $('#s-ok').dataset.to = to; go('/sent'); }
$('#s-ok').addEventListener('click', (e) => go(e.currentTarget.dataset.to || '/login'));

// ---- ধাপের ইতিহাস: পেছনের তীর ঠিক আগের ধাপেই ফেরায়, ঘুরে ঘুরে সামনে নেয় না ----
const hsGet = () => { try { return JSON.parse(sessionStorage.getItem('pp_hs')) || []; } catch (e) { return []; } };
let replacing = false;
function trackHist(r) {
  let i = history.state && typeof history.state.i === 'number' ? history.state.i : null; const a = hsGet();
  if (i === null) { const last = +sessionStorage.getItem('pp_hi'); i = replacing ? (Number.isFinite(last) ? last : 0) : (Number.isFinite(last) && sessionStorage.getItem('pp_hi') !== null ? last + 1 : 0); try { history.replaceState({ i }, ''); } catch (e) {} a.length = i; }
  a[i] = r; try { sessionStorage.setItem('pp_hs', JSON.stringify(a)); sessionStorage.setItem('pp_hi', String(i)); } catch (e) {} replacing = false;
}
function stepBack(prev) {
  const i = history.state && history.state.i, a = hsGet();
  if (typeof i === 'number' && i > 0 && a[i - 1] === prev) history.back(); else { replacing = true; location.replace('#' + prev); }
}
initOnboard((p) => go(p), stepBack);
$('#t-start').innerHTML = logoSvg('wm');
{ // শুরুর ইন্ট্রো: আকাশি পর্দায় শুধু লেখা, তারপর বাঁয়ে সরে অ্যাপ দেখা যায়
  const el = $('#intro');
  if (el) { $('#intro-wm').innerHTML = logoSvg('wm'); requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
    setTimeout(() => { el.classList.add('go'); play('slide'); }, 1900); setTimeout(() => el.remove(), 2700); }
} $('#st-art').innerHTML = stackSvg();
$('#s-go').addEventListener('click', () => { try { sessionStorage.removeItem('pp_have'); } catch (e) {} clearOnb(); go('/lang'); });
$('#s-have').addEventListener('click', () => { try { sessionStorage.setItem('pp_have', '1'); } catch (e) {} go('/login'); });

// ---- বয়স ----
const ageIn = $('#a-age'), ageBtn = $('#a-next'), ageErr = $('#a-err'), okAge = (v) => v >= 3 && v <= 120;
ageIn.addEventListener('input', () => { const v = ageIn.value.replace(/[^0-9০-৯]/g, '').slice(0, 3); ageIn.value = v; ageBtn.disabled = !okAge(+toEn(v)); ageErr.hidden = true; ageIn.classList.remove('bad'); });
$('#f-age').addEventListener('submit', (e) => { e.preventDefault(); const n = +toEn(ageIn.value); if (!okAge(n)) { show(ageErr, 'সঠিক বয়স লিখুন (৩ থেকে ১২০)'); return bad(ageIn); } age = n; try { sessionStorage.setItem('pp_age', String(n)); } catch (er) {} go('/choose'); });
if (age) { ageIn.value = String(age); ageBtn.disabled = false; }

// ---- পাসওয়ার্ড: শক্ত নিয়ম, মিটার, প্রস্তাব ----
const RULES = [['len', 'কমপক্ষে ৬ অক্ষর', (p) => p.length >= 6], ['up', 'বড় হাতের ইংরেজি অক্ষর (A–Z)', (p) => /[A-Z]/.test(p)], ['lo', 'ছোট হাতের ইংরেজি অক্ষর (a–z)', (p) => /[a-z]/.test(p)], ['num', 'সংখ্যা (0–9)', (p) => /[0-9]/.test(p)], ['sym', 'চিহ্ন (যেমন ! @ # $ % ^ &)', (p) => /[^A-Za-z0-9]/.test(p)]];
const strongOk = (p) => RULES.every((r) => r[2](p));
function genPw() {
  const U = 'ABCDEFGHJKLMNPQRSTUVWXYZ', L = 'abcdefghijkmnopqrstuvwxyz', D = '23456789', S = '!@#$%^&*?+=', all = U + L + D + S;
  const rnd = (n) => { const x = new Uint32Array(1); crypto.getRandomValues(x); return x[0] % n; }, pick = (s) => s[rnd(s.length)];
  const c = [pick(U), pick(D), pick(S), pick(L), pick(U), pick(L), pick(D), pick(S)]; while (c.length < 12) c.push(pick(all));
  for (let i = c.length - 1; i > 0; i--) { const j = rnd(i + 1); [c[i], c[j]] = [c[j], c[i]]; } return c.join('');
}
function pwWidget(input, mount, mate) {
  mount.className = 'pw-ui';
  const wrap = input.parentElement;
  const sg = document.createElement('div'); sg.className = 'pw-sg'; sg.hidden = true;
  sg.innerHTML = '<button type="button" class="use"></button><button type="button" class="gen" aria-label="নতুন পাসওয়ার্ড"></button>';
  wrap.after(sg);
  const use = sg.querySelector('.use'), gen = sg.querySelector('.gen');
  const draw = () => { mount.innerHTML = '<div class="meter"><div class="meter-bar"><i></i></div><span class="meter-t"></span></div><ul class="rules">' + RULES.map((r) => '<li data-r="' + r[0] + '">' + t(r[1]) + '</li>').join('') + '</ul>'; upd(); };
  const upd = () => {
    const bar = mount.querySelector('.meter-bar i'), tx = mount.querySelector('.meter-t'); if (!bar) return;
    const p = input.value; let n = 0; [...mount.querySelectorAll('.rules li')].forEach((li, i) => { const ok = RULES[i][2](p); li.classList.toggle('ok', ok); if (ok) n++; });
    const all = n === RULES.length, pct = !p ? 0 : all ? (p.length >= 10 ? 100 : 80) : Math.max(12, n * 14);
    bar.style.width = pct + '%'; bar.style.background = all ? '#58cc02' : n >= 3 ? '#ffb020' : 'var(--err)';
    tx.textContent = !p ? '' : t(all ? (p.length >= 10 ? 'অনেক শক্ত' : 'শক্ত') : n >= 3 ? 'মোটামুটি' : 'দুর্বল'); tx.style.color = bar.style.background;
  };
  const fresh = () => { use.textContent = genPw(); };
  const apply = () => { input.value = use.textContent; if (mate) mate.value = use.textContent; [input, mate].forEach((x) => { if (x) { x.type = 'text'; const eye = x.parentElement.querySelector('.eye'); if (eye) eye.classList.add('on'); } }); upd(); sg.hidden = true; };
  sg.addEventListener('mousedown', (e) => e.preventDefault());
  use.addEventListener('click', apply);
  gen.addEventListener('click', () => { fresh(); gen.classList.remove('spin'); void gen.offsetWidth; gen.classList.add('spin'); });
  input.addEventListener('focus', () => { if (!input.value) { fresh(); sg.hidden = false; } });
  input.addEventListener('input', () => { sg.hidden = !!input.value; upd(); });
  input.addEventListener('blur', () => { setTimeout(() => { sg.hidden = true; }, 120); });
  addEventListener('pp:lang', () => { gen.setAttribute('aria-label', t('নতুন পাসওয়ার্ড')); draw(); });
  draw();
}
document.querySelectorAll('.eye').forEach((b) => b.addEventListener('click', () => { const i = b.previousElementSibling; const show = i.type === 'password'; i.type = show ? 'text' : 'password'; b.classList.toggle('on', show); b.setAttribute('aria-label', t(show ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখান')); }));

// ---- মোবাইল নম্বর ----
const normPhone = (v) => { let d = toEn(v).replace(/[\s\-().]/g, ''); if (d.startsWith('+880')) d = '0' + d.slice(4); else if (d.startsWith('880')) d = '0' + d.slice(3); return /^01[3-9][0-9]{8}$/.test(d) ? d : ''; };

// ---- ইমেইল লিংক পাতা (কোড নয়, ইমেইলের লিংকে ক্লিক করলেই ঢুকে যাবে) ----
const oRes = $('#o-resend');
let ot;
function tickOtp() {
  clearInterval(ot); if (!pend) return; const k = pend.purpose + ':' + pend.email;
  const run = () => { const w = wait(k, GAP[pend.purpose]); if (w <= 0) { clearInterval(ot); oRes.disabled = false; oRes.textContent = t('আবার পাঠান'); return; } const tt = Math.ceil(w / 1000); oRes.disabled = true; oRes.textContent = tf('resendIn', bn(Math.floor(tt / 60)) + ':' + bn(String(tt % 60).padStart(2, '0'))); };
  run(); if (wait(k, GAP[pend.purpose]) > 0) ot = setInterval(run, 1000);
}
function openOtp() { const P = PURP[pend.purpose]; $('#o-mail').textContent = pend.email; $('#o-text').textContent = tf('otp', t(P.title)); tickOtp(); }
function beginOtp(purpose, email) { setPend({ purpose, email }); go('/otp'); }
// লিংকটি অন্য ট্যাবে খুললে এই ট্যাবও নিজে থেকে এগিয়ে যায়
addEventListener('storage', (e) => { if (e.key === 'pp_session' && e.newValue && pend) { const p = pend.purpose; setPend(null); go(p === 'reset' ? '/reset' : '/home'); } });
oRes.addEventListener('click', async () => {
  if (!pend) return; const k = pend.purpose + ':' + pend.email; if (wait(k, GAP[pend.purpose]) > 0) return; busy(oRes, true);
  try { if (pend.purpose === 'signup') await resendSignup(pend.email); else { try { await sendOtp(pend.email); } catch (er) { if (!okMiss(er)) throw er; } } stamp(k); snack('নতুন লিংক পাঠানো হয়েছে'); } catch (er) { snack(errText(er)); }
  oRes.disabled = false; busy(oRes, false); tickOtp();
});

// ---- লগ ইন: ইমেইল + পাসওয়ার্ড ঠিক হলে ইমেইলে কোড যায় ----
async function startLogin(em, pw) {
  await checkPassword(em, pw); const k = 'login:' + em;
  if (wait(k, GAP.login) <= 0) { await sendOtp(em); stamp(k); } // ১ মিনিটের মধ্যে আবার চাপলে আগের কোডই চলবে
  setIntent(null); beginOtp('login', em);
}
const lErr = $('#l-err'), lEmail = $('#l-email'), lPass = $('#l-pass');
[lEmail, lPass].forEach((i) => i.addEventListener('input', () => { lErr.hidden = true; i.classList.remove('bad'); }));
$('#f-login').addEventListener('submit', async (e) => {
  e.preventDefault(); const em = lEmail.value.trim().toLowerCase(), pw = lPass.value, b = e.submitter || $('#f-login .btn-primary');
  if (!isMail(em)) { show(lErr, 'সঠিক ইমেইল ঠিকানা লিখুন'); return bad(lEmail); }
  if (!pw) { show(lErr, 'পাসওয়ার্ড লিখুন'); return bad(lPass); }
  busy(b, true); try { await startLogin(em, pw); lPass.value = ''; } catch (er) { show(lErr, errText(er)); } busy(b, false);
});
$('#forgot').addEventListener('click', () => { $('#f-mail').value = isMail(lEmail.value.trim()) ? lEmail.value.trim() : ''; go('/forgot'); });

// ---- পাসওয়ার্ড ভুলে গিয়েছি: ইমেইলে কোড, ৫ মিনিটে একবার ----
const fErr = $('#f-err'), fMail = $('#f-mail'), fBtn = $('#f-forgot .btn-primary'), COOL = GAP.reset;
let ct; function tickCool() {
  clearInterval(ct); const em = fMail.value.trim().toLowerCase(); if (!isMail(em)) { fBtn.disabled = false; return; } const k = 'reset:' + em;
  const run = () => { const w = wait(k, COOL); if (w <= 0) { clearInterval(ct); fErr.hidden = true; fBtn.disabled = false; return; } const tt = Math.ceil(w / 1000); fErr.textContent = tf('cool', bn(Math.floor(tt / 60)), bn(tt % 60)); fErr.hidden = false; fBtn.disabled = true; };
  run(); if (wait(k, COOL) > 0) ct = setInterval(run, 1000);
}
fMail.addEventListener('input', () => { fErr.hidden = true; fMail.classList.remove('bad'); fBtn.disabled = false; tickCool(); });
addEventListener('hashchange', () => { if (location.hash === '#/forgot') tickCool(); });
$('#f-forgot').addEventListener('submit', async (e) => {
  e.preventDefault(); const em = fMail.value.trim().toLowerCase(), b = e.submitter || fBtn;
  if (!isMail(em)) { show(fErr, 'সঠিক ইমেইল ঠিকানা লিখুন'); return bad(fMail); }
  const k = 'reset:' + em; if (wait(k, COOL) > 0) return tickCool();
  busy(b, true); try { try { await sendOtp(em); } catch (er) { if (!okMiss(er)) throw er; } stamp(k); setIntent('reset'); beginOtp('reset', em); } catch (er) { show(fErr, errText(er)); } busy(b, false);
});

// ---- নতুন পাসওয়ার্ড (কোড বা লিংক থেকে এলে) ----
const rErr = $('#r-err'), rPass = $('#r-pass'), rPass2 = $('#r-pass2'); pwWidget(rPass, $('#r-pw-ui'), rPass2);
[rPass, rPass2].forEach((i) => i.addEventListener('input', () => { rErr.hidden = true; i.classList.remove('bad'); }));
$('#f-reset').addEventListener('submit', async (e) => {
  e.preventDefault(); const pw = rPass.value, b = e.submitter || $('#f-reset .btn-primary');
  if (!strongOk(pw)) { show(rErr, 'পাসওয়ার্ড সব নিয়ম মানেনি — নিচের তালিকা দেখুন'); return bad(rPass); }
  if (pw !== rPass2.value) { show(rErr, 'দুই ঘরের পাসওয়ার্ড মেলেনি'); return bad(rPass2); }
  busy(b, true); try { await updateUser({ password: pw }); setIntent(null); rPass.value = rPass2.value = ''; snack('পাসওয়ার্ড বদলেছে'); go('/home'); } catch (er) { show(rErr, errText(er)); } busy(b, false);
});

// ---- ইমেইল দিয়ে অ্যাকাউন্ট: নাম, মোবাইল, প্রতিষ্ঠান, ইমেইল, শক্ত পাসওয়ার্ড ----
const eErr = $('#e-err'), eName = $('#e-name'), ePhone = $('#e-phone'), eInst = $('#e-inst'), eMail = $('#e-mail'), ePass = $('#e-pass'); pwWidget(ePass, $('#e-pw-ui'));
[eName, ePhone, eInst, eMail, ePass].forEach((i) => i.addEventListener('input', () => { eErr.hidden = true; i.classList.remove('bad'); }));
$('#c-mail').addEventListener('click', () => go('/email'));
$('#f-email').addEventListener('submit', async (e) => {
  e.preventDefault(); const nm = eName.value.trim(), ph = normPhone(ePhone.value), ins = eInst.value.trim(), em = eMail.value.trim().toLowerCase(), pw = ePass.value, b = e.submitter || $('#f-email .btn-primary');
  if (nm.length < 2) { show(eErr, 'আপনার নাম লিখুন'); return bad(eName); }
  if (!ph) { show(eErr, 'সঠিক মোবাইল নম্বর দিন (যেমন 01712345678)'); return bad(ePhone); }
  if (ins.length < 2) { show(eErr, 'প্রতিষ্ঠানের নাম লিখুন'); return bad(eInst); }
  if (!isMail(em)) { show(eErr, 'সঠিক ইমেইল ঠিকানা লিখুন'); return bad(eMail); }
  if (!strongOk(pw)) { show(eErr, 'পাসওয়ার্ড সব নিয়ম মানেনি — নিচের তালিকা দেখুন'); return bad(ePass); }
  busy(b, true);
  try { const r = await signUp(em, pw, Object.assign({ name: nm, age, phone: ph, institution: ins }, getOnb())); hook('signup', { email: em }); if (r.needsConfirm) { stamp('signup:' + em); beginOtp('signup', em); } else go('/home'); }
  catch (er) { show(eErr, errText(er)); } busy(b, false);
});

// ---- আরও তথ্য (গুগল দিয়ে ঢুকলে) ----
const mErr = $('#m-err'), mPhone = $('#m-phone'), mInst = $('#m-inst');
[mPhone, mInst].forEach((i) => i.addEventListener('input', () => { mErr.hidden = true; i.classList.remove('bad'); }));
$('#f-more').addEventListener('submit', async (e) => {
  e.preventDefault(); const ph = normPhone(mPhone.value), ins = mInst.value.trim(), b = e.submitter || $('#f-more .btn-primary');
  if (!ph) { show(mErr, 'সঠিক মোবাইল নম্বর দিন (যেমন 01712345678)'); return bad(mPhone); }
  if (ins.length < 2) { show(mErr, 'প্রতিষ্ঠানের নাম লিখুন'); return bad(mInst); }
  busy(b, true); try { const u = await updateUser({ data: { phone: ph, institution: ins } }); try { await patchProfile(u.id, { phone: ph, institution: ins }); } catch (er2) {} go('/home'); } catch (er) { show(mErr, errText(er)); } busy(b, false);
});

// ---- গুগল ----
document.querySelectorAll('[data-oauth]').forEach((b) => b.addEventListener('click', () => { try { oauth(b.dataset.oauth); } catch (er) { snack(errText(er)); } }));

// ---- আবারও স্বাগতম ----
$('#w-other').addEventListener('click', () => go('/login'));
const wErr = $('#w-err'), wPass = $('#w-pass'); wPass.addEventListener('input', () => { wErr.hidden = true; wPass.classList.remove('bad'); });
$('#w-forgot').addEventListener('click', () => { const o = lastAcc(); $('#f-mail').value = o ? o.email : ''; go('/forgot'); });
$('#f-welcome').addEventListener('submit', async (e) => {
  e.preventDefault(); const o = lastAcc(), pw = wPass.value, b = e.submitter || $('#f-welcome .btn-primary'); if (!o) return go('/login');
  if (!pw) { show(wErr, 'পাসওয়ার্ড লিখুন'); return bad(wPass); }
  busy(b, true); try { await startLogin(o.email.toLowerCase(), pw); wPass.value = ''; } catch (er) { show(wErr, errText(er)); } busy(b, false);
});

// ---- বের হওয়া ----
$('#h-out').addEventListener('click', async () => { await signOut(); hook('logout'); go(lastAcc() ? '/welcome' : '/login'); });

// ---- শুরু: গুগল / ইমেইল-লিংক থেকে ফিরলে ----
(async function start() {
  const cb = fromHash();
  if (cb && cb.error) { snack(ERR[cb.error] || 'লগ ইন সম্পন্ন হয়নি — আবার চেষ্টা করুন'); }
  else if (cb) {
    setPend(null);
    if (cb.type === 'recovery' || (cb.type === 'magiclink' && getIntent() === 'reset')) location.hash = '/reset';
    else { if (age) { try { const u = await loadUser(); if (u && !(u.user_metadata || {}).age) await updateUser({ data: Object.assign({ age }, getOnb()) }); } catch (e) {} } location.hash = '/home'; }
  }
  route();
})();

// ---- বোতামে চাপলে হালকা কাঁপুনি (যে ফোনে সম্ভব) ----
initSfx();
document.addEventListener('click', (e) => { const bt = e.target.closest('button:not(:disabled), .btn, [role=button]'); if (bt && bt.closest('#v-practice')) { if (bt.matches('.pr-snd')) play('soft'); buzz(18); } else if (bt) { play(bt.matches('.btn, #ob-next, #s-go, #s-have') ? 'press' : 'soft'); buzz(18); } }, true);
