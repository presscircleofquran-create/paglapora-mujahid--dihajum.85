// Supabase Auth (GoTrue) REST — কোনো লাইব্রেরি ছাড়া। সেশন localStorage-এ থাকে।
import { URL_ as BASE, KEY_ as KEY } from './config.js';
const LS = 'pp_session';
export const configured = () => !!(BASE && KEY);
const load = () => { try { return JSON.parse(localStorage.getItem(LS) || 'null'); } catch (e) { return null; } };
let sess = load();
const save = (s) => { sess = s; try { s ? localStorage.setItem(LS, JSON.stringify(s)) : localStorage.removeItem(LS); } catch (e) {} };
async function call(path, { method = 'POST', body, token } = {}) {
  if (!configured()) throw { code: 'not_configured' };
  let r; try { r = await fetch(BASE + path, { method, headers: Object.assign({ apikey: KEY, 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}), body: body ? JSON.stringify(body) : undefined }); } catch (e) { throw { code: 'network' }; }
  let j = {}; try { j = await r.json(); } catch (e) {}
  if (!r.ok) throw { code: j.error_code || j.code || j.error || 'http_' + r.status, status: r.status, msg: j.msg || j.message || j.error_description || '' };
  return j;
}
const adopt = (j) => { const s = { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: j.expires_at || Math.floor(Date.now() / 1000) + (j.expires_in || 3600), user: j.user || (sess && sess.user) }; save(s); return s; };
export const signUp = async (email, password, data) => {
  const j = await call('/auth/v1/signup?redirect_to=' + encodeURIComponent(location.origin + location.pathname), { body: { email, password, data } });
  if (Array.isArray(j.identities) && !j.identities.length) throw { code: 'user_already_exists' }; // আগেই আছে
  return j.access_token ? { session: adopt(j) } : { needsConfirm: true };
};
// পাসওয়ার্ড ঠিক কিনা দেখে — সেশন সেভ করে না (ওটিপি দেওয়ার পরই লগ ইন হবে)
export const checkPassword = (email, password) => call('/auth/v1/token?grant_type=password', { body: { email, password } });
// ইমেইলে ৬ সংখ্যার কোড (এবং লিংক) পাঠায়
export const sendOtp = (email) => call('/auth/v1/otp?redirect_to=' + encodeURIComponent(location.origin + location.pathname), { body: { email, create_user: false } });
export const resendSignup = (email) => call('/auth/v1/resend?redirect_to=' + encodeURIComponent(location.origin + location.pathname), { body: { type: 'signup', email } });
export const verifyOtp = async (email, token, type) => adopt(await call('/auth/v1/verify', { body: { email, token, type } }));
export async function patchProfile(uid, attrs) {
  const s = await getSession(); if (!s || !uid) throw { code: 'no_session' };
  let r; try { r = await fetch(BASE + '/rest/v1/profiles?id=eq.' + encodeURIComponent(uid), { method: 'PATCH', headers: { apikey: KEY, Authorization: 'Bearer ' + s.access_token, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(attrs) }); } catch (e) { throw { code: 'network' }; }
  if (!r.ok) throw { code: 'http_' + r.status };
}
export const signIn = async (email, password) => adopt(await call('/auth/v1/token?grant_type=password', { body: { email, password } }));
export const recover = (email) => call('/auth/v1/recover?redirect_to=' + encodeURIComponent(location.origin + location.pathname), { body: { email } });
export const oauth = (provider) => { if (!configured()) throw { code: 'not_configured' }; location.href = BASE + '/auth/v1/authorize?provider=' + provider + '&redirect_to=' + encodeURIComponent(location.origin + location.pathname); };
export async function updateUser(attrs) { const s = await getSession(); if (!s) throw { code: 'no_session' }; const u = await call('/auth/v1/user', { method: 'PUT', body: attrs, token: s.access_token }); save(Object.assign({}, s, { user: u })); return u; }
export async function getSession() {
  if (!sess) return null; const now = Math.floor(Date.now() / 1000);
  if (sess.expires_at - now < 60) { try { return adopt(await call('/auth/v1/token?grant_type=refresh_token', { body: { refresh_token: sess.refresh_token } })); } catch (e) { if (e.code !== 'network') save(null); return e.code === 'network' ? sess : null; } }
  return sess;
}
export const peek = () => sess;
export async function signOut() { const s = sess; save(null); if (s) { try { await call('/auth/v1/logout', { token: s.access_token }); } catch (e) {} } }
// গুগল/ফেসবুক/রিসেট-লিংক থেকে ফিরলে URL-এর # অংশে টোকেন থাকে
export function fromHash() {
  const h = location.hash.replace(/^#\/?/, ''); if (!/(access_token|error)=/.test(h)) return null; const p = new URLSearchParams(h);
  try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  if (p.get('error')) return { error: p.get('error_code') || p.get('error'), msg: p.get('error_description') || '' };
  adopt({ access_token: p.get('access_token'), refresh_token: p.get('refresh_token'), expires_at: +p.get('expires_at') || 0, expires_in: +p.get('expires_in') || 3600 });
  return { type: p.get('type') || 'login', need: true };
}
export async function loadUser() { if (!sess) return null; try { const s = await getSession(); if (!s) return null; const u = await call('/auth/v1/user', { method: 'GET', token: s.access_token }); save(Object.assign({}, s, { user: u })); return u; } catch (e) { return sess && sess.user; } }
