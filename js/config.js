// Supabase সংযোগ। anon public key গোপন নয় (ব্রাউজারে থাকাই নিয়ম) — কিন্তু service_role key কখনো এখানে দেবে না।
export const SUPABASE_URL = 'https://racgkmdgyrxdernojscq.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhY2drbWRneXJ4ZGVybm9qc2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3MjE2NjksImV4cCI6MjEwOTI5NzY2OX0.YFQH4ilVt7G_dSEagNI2Swyg4iidmD2BLVrAcgPde8o';
// শুধু টেস্টের জন্য: localStorage.pp_dev_sb = "url|key"
let dev = null; try { dev = (localStorage.getItem('pp_dev_sb') || '').split('|'); } catch (e) {}
export const URL_ = (dev && dev[0]) || SUPABASE_URL;
export const KEY_ = (dev && dev[1]) || SUPABASE_ANON_KEY;
