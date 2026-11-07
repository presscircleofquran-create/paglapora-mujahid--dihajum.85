// ভাষা: ইংরেজি (ডিফল্ট), বাংলা, আরবি। কোডে/HTML-এ মূল লেখা বাংলা — সেটাই "চাবি"; বাছাই করা ভাষা অনুযায়ী বদলে যায়।
const KEY = 'pp_lang', OK = ['en', 'bn', 'ar'];
let cur = 'en'; try { const s = localStorage.getItem(KEY); if (OK.includes(s)) cur = s; } catch (e) {}
export const getLang = () => cur;
// নতুন ভাষা যোগ করতে এই তালিকায় একটি লাইন দিন (আর T-তে অনুবাদ) — ড্রপডাউনে নিজে থেকে দেখাবে
export const LANG_LIST = [{ id: 'en', name: 'English' }, { id: 'ar', name: 'العربية' }, { id: 'bn', name: 'বাংলা' }];
const AR_D = '٠١٢٣٤٥٦٧٨٩', BN_D = '০১২৩৪৫৬৭৮৯';
export const num = (n) => String(n).replace(/[0-9]/g, (d) => (cur === 'bn' ? BN_D[d] : cur === 'ar' ? AR_D[d] : d));
export const toEnDigits = (s) => String(s).replace(/[০-৯]/g, (d) => BN_D.indexOf(d)).replace(/[٠-٩]/g, (d) => AR_D.indexOf(d));

const T = [
  // [বাংলা, English, العربية]
  ['Google দিয়ে সাইন ইন করুন', 'Sign in with Google', 'تسجيل الدخول عبر Google'],
  ['Google-এর সাহায্যে অ্যাকাউন্ট খুলুন', 'Create an account with Google', 'إنشاء حساب عبر Google'],
  ['অথবা', 'or', 'أو'],
  ['অন্য অ্যাকাউন্ট থেকে লগ ইন করুন', 'Log in with another account', 'تسجيل الدخول بحساب آخر'],
  ['অ্যাকাউন্ট তৈরি করুন', 'Create account', 'إنشاء حساب'],
  ['অ্যাকাউন্ট নেই?', "Don't have an account?", 'ليس لديك حساب؟'],
  ['অ্যাপের ভেতরের অংশ পরের ধাপে বানানো হবে।', 'The inside of the app will be built in the next step.', 'سيتم بناء داخل التطبيق في الخطوة التالية.'],
  ['আগেই অ্যাকাউন্ট করা আছে?', 'Already have an account?', 'لديك حساب بالفعل؟'],
  ['আপনার ইমেইল দিন — আমরা একটি লিংক পাঠাব। সেই লিংকে ক্লিক করে নতুন পাসওয়ার্ড বানাতে পারবেন।', 'Enter your email — we will send you a link. Click it to create a new password.', 'أدخل بريدك الإلكتروني — سنرسل لك رابطًا. اضغط عليه لإنشاء كلمة مرور جديدة.'],
  ['আপনার বয়স কত?', 'How old are you?', 'كم عمرك؟'],
  ['আপনার বয়স জানতে পারলে আমরা আপনার পাগলা পড়া ব্যবহারের অভিজ্ঞতাকে আরও উন্নত করতে পারব।', 'Knowing your age helps us make your Paglapora experience even better.', 'معرفة عمرك تساعدنا على تحسين تجربتك مع Paglapora.'],
  ['আবার পাঠান', 'Resend', 'إعادة الإرسال'],
  ['আবারও স্বাগতম!', 'Welcome back!', 'مرحبًا بعودتك!'],
  ['আমার আগে থেকেই অ্যাকাউন্ট আছে', 'I already have an account', 'لدي حساب بالفعل'],
  ['আমি শিখতে চাই...', 'I want to learn...', 'أريد أن أتعلّم...'],
  ['আর একটু তথ্য দিন', 'A little more about you', 'بعض المعلومات الإضافية'],
  ['ইমেইল চেক করুন', 'Check your email', 'تحقّق من بريدك الإلكتروني'],
  ['ইমেইল দিয়ে চালিয়ে যান', 'Continue with email', 'المتابعة بالبريد الإلكتروني'],
  ['ইমেইলে একটি লিংকও গেছে — চাইলে লিংকে ক্লিক করলেও হবে। ইনবক্সে না পেলে স্প্যাম ফোল্ডার দেখুন।', "We also emailed a link — you can click it instead. Can't find it? Check your spam folder.", 'أرسلنا أيضًا رابطًا — يمكنك الضغط عليه بدلًا من ذلك. إن لم تجده فتحقّق من مجلد الرسائل غير المرغوب فيها.'],
  ['এই অ্যাপ চালাতে জাভাস্ক্রিপ্ট চালু করুন।', 'Please enable JavaScript to run this app.', 'يرجى تفعيل JavaScript لتشغيل هذا التطبيق.'],
  ['পরের ধাপে যেতে যে কোনও', 'Choose any one', 'اختر أيًّا من الخيارات'],
  ['একটি বেছে নিন!', 'to continue!', 'للمتابعة!'],
  ['চালিয়ে যান', 'Continue', 'متابعة'],
  ['আমি পারবই', "I can do it!", 'أستطيع!'],
  ['জমা দিন', 'Submit', 'إرسال'],
  ['নিশ্চিত করুন', 'Confirm', 'تأكيد'],
  ['পরের ধাপে যান', 'Next', 'التالي'],
  ['পাগলের মতো পড়ো, মজা করে শেখো!', 'Learn like crazy, have fun while you do!', 'تعلّم بشغف، واستمتع أثناء ذلك!'],
  ['পাসওয়ার্ড ভুলে গিয়েছি', 'Forgot password', 'نسيت كلمة المرور'],
  ['পাসওয়ার্ড রিসেট করুন', 'Reset password', 'إعادة تعيين كلمة المرور'],
  ['মনে নেই?', 'Forgot?', 'نسيتها؟'],
  ['মোবাইল নম্বর আর প্রতিষ্ঠানের নাম দিলেই শেষ!', "Just add your mobile number and institution — that's it!", 'أضف رقم جوالك واسم مؤسستك فقط — وينتهي الأمر!'],
  ['লগ আউট', 'Log out', 'تسجيل الخروج'],
  ['লগ ইন করুন', 'Log in', 'تسجيل الدخول'],
  ['লগ ইন পাতায় যান', 'Go to log in', 'الذهاب إلى تسجيل الدخول'],
  ['শুরু করুন', 'Get started', 'ابدأ'],
  ['সাইটের ভাষা: বাংলা', 'Site language: English', 'لغة الموقع: العربية'],
  ['সাইন আপ করুন', 'Sign up', 'إنشاء حساب'],
  ['স্বাগতম!', 'Welcome!', 'مرحبًا!'],
  // placeholder / aria-label
  ['ইমেইল', 'Email', 'البريد الإلكتروني'],
  ['নতুন লিংক পাঠানো হয়েছে', 'A new link has been sent', 'تم إرسال رابط جديد'],
  ['লিংকে ক্লিক করলেই আপনি ঢুকে যাবেন। ইনবক্সে না পেলে স্প্যাম ফোল্ডার দেখুন।', 'Just click the link and you are in. If it is not in your inbox, check your spam folder.', 'اضغط على الرابط وستدخل مباشرة. إن لم تجده في الوارد فتحقق من البريد العشوائي.'],
  ['অনুশীলন', 'Practice', 'التدريب'],
  ['নতুন পাসওয়ার্ড', 'New password', 'كلمة مرور جديدة'],
  ['নতুন পাসওয়ার্ড কনফার্ম করুন', 'Confirm new password', 'تأكيد كلمة المرور الجديدة'],
  ['নাম', 'Name', 'الاسم'],
  ['পাসওয়ার্ড', 'Password', 'كلمة المرور'],
  ['পাসওয়ার্ড দেখান', 'Show password', 'إظهار كلمة المرور'],
  ['পাসওয়ার্ড লুকান', 'Hide password', 'إخفاء كلمة المرور'],
  ['পেছনে যান', 'Go back', 'رجوع'],
  ['প্রতিষ্ঠান', 'Institution', 'المؤسسة'],
  ['প্রতিষ্ঠানের নাম (স্কুল / মাদরাসা)', 'Institution name (school / madrasah)', 'اسم المؤسسة (مدرسة / مدرسة دينية)'],
  ['বন্ধ করুন', 'Close', 'إغلاق'],
  ['বয়স', 'Age', 'العمر'],
  ['মোবাইল নম্বর', 'Mobile number', 'رقم الجوال'],
  ['মোবাইল নম্বর (01XXXXXXXXX)', 'Mobile number (01XXXXXXXXX)', 'رقم الجوال (01XXXXXXXXX)'],
  ['শুরুর ধাপ', 'Getting started', 'البدء'],
  ['৬ সংখ্যার কোড', '6-digit code', 'رمز من 6 أرقام'],
  // বার্তা / ভুল
  ['ইমেইল বা পাসওয়ার্ড ভুল', 'Wrong email or password', 'البريد الإلكتروني أو كلمة المرور غير صحيحة'],
  ['আগে ইমেইলে পাঠানো লিংকে ক্লিক করে নিশ্চিত করুন', 'Please confirm using the link we emailed first', 'يرجى التأكيد أولًا عبر الرابط المرسل إلى بريدك'],
  ['এই ইমেইলে আগেই অ্যাকাউন্ট আছে — লগ ইন করুন', 'An account with this email already exists — log in', 'يوجد حساب بهذا البريد بالفعل — سجّل الدخول'],
  ['পাসওয়ার্ড আরও শক্ত দিন (কমপক্ষে ৬ অক্ষর)', 'Use a stronger password (at least 6 characters)', 'استخدم كلمة مرور أقوى (6 أحرف على الأقل)'],
  ['নতুন পাসওয়ার্ড আগেরটার মতো হতে পারবে না', "The new password can't be the same as the old one", 'لا يمكن أن تكون كلمة المرور الجديدة مثل القديمة'],
  ['ইমেইল পাঠানোর সীমা শেষ — কিছুক্ষণ পরে আবার চেষ্টা করুন', 'Email limit reached — try again in a while', 'تم الوصول إلى حد إرسال البريد — حاول مجددًا بعد قليل'],
  ['অনেকবার চেষ্টা হয়েছে, কিছুক্ষণ পরে আবার করুন', 'Too many attempts — try again shortly', 'محاولات كثيرة — حاول مجددًا بعد قليل'],
  ['এখন নতুন অ্যাকাউন্ট খোলা বন্ধ আছে', 'New sign-ups are closed right now', 'التسجيل الجديد مغلق حاليًا'],
  ['ইমেইল বা পাসওয়ার্ড ঠিক নেই', 'Email or password is not valid', 'البريد الإلكتروني أو كلمة المرور غير صالحة'],
  ['এই পদ্ধতি এখনো চালু করা হয়নি', "This method isn't enabled yet", 'هذه الطريقة غير مفعّلة بعد'],
  ['ইন্টারনেট সংযোগ নেই', 'No internet connection', 'لا يوجد اتصال بالإنترنت'],
  ['Supabase কী (anon key) এখনো বসানো হয়নি — js/config.js দেখুন', 'Supabase key (anon key) is not set yet — see js/config.js', 'لم يتم ضبط مفتاح Supabase (anon key) بعد — راجع js/config.js'],
  ['কোডটি ভুল অথবা মেয়াদ শেষ — আবার পাঠিয়ে চেষ্টা করুন', 'Wrong or expired code — resend and try again', 'الرمز خاطئ أو منتهي — أعد الإرسال وحاول مجددًا'],
  ['সেশন শেষ — আবার লগ ইন করুন', 'Session ended — please log in again', 'انتهت الجلسة — سجّل الدخول مجددًا'],
  ['কিছু একটা ভুল হয়েছে, আবার চেষ্টা করুন', 'Something went wrong — please try again', 'حدث خطأ ما — حاول مرة أخرى'],
  ['লগ ইন সম্পন্ন হয়নি — আবার চেষ্টা করুন', "Login didn't complete — please try again", 'لم يكتمل تسجيل الدخول — حاول مجددًا'],
  ['সঠিক ইমেইল ঠিকানা লিখুন', 'Enter a valid email address', 'أدخل عنوان بريد إلكتروني صحيحًا'],
  ['পাসওয়ার্ড লিখুন', 'Enter your password', 'أدخل كلمة المرور'],
  ['আপনার নাম লিখুন', 'Enter your name', 'أدخل اسمك'],
  ['সঠিক মোবাইল নম্বর দিন (যেমন 01712345678)', 'Enter a valid mobile number (e.g. 01712345678)', 'أدخل رقم جوال صحيحًا (مثل 01712345678)'],
  ['প্রতিষ্ঠানের নাম লিখুন', 'Enter your institution name', 'أدخل اسم مؤسستك'],
  ['পাসওয়ার্ড সব নিয়ম মানেনি — নিচের তালিকা দেখুন', "Your password doesn't meet all the rules — see the list below", 'كلمة المرور لا تستوفي كل الشروط — راجع القائمة أدناه'],
  ['দুই ঘরের পাসওয়ার্ড মেলেনি', "The two passwords don't match", 'كلمتا المرور غير متطابقتين'],
  ['সঠিক বয়স লিখুন (৩ থেকে ১২০)', 'Enter a valid age (3 to 120)', 'أدخل عمرًا صحيحًا (من 3 إلى 120)'],
  ['পাসওয়ার্ড বদলেছে', 'Password changed', 'تم تغيير كلمة المرور'],
  ['নতুন কোড পাঠানো হয়েছে', 'New code sent', 'تم إرسال رمز جديد'],
  // পাসওয়ার্ডের নিয়ম
  ['কমপক্ষে ৬ অক্ষর', 'At least 6 characters', '6 أحرف على الأقل'],
  ['বড় হাতের ইংরেজি অক্ষর (A–Z)', 'An uppercase letter (A–Z)', 'حرف كبير (A–Z)'],
  ['ছোট হাতের ইংরেজি অক্ষর (a–z)', 'A lowercase letter (a–z)', 'حرف صغير (a–z)'],
  ['সংখ্যা (0–9)', 'A number (0–9)', 'رقم (0–9)'],
  ['চিহ্ন (যেমন ! @ # $ % ^ &)', 'A symbol (e.g. ! @ # $ % ^ &)', 'رمز (مثل ! @ # $ % ^ &)'],
  ['দুর্বল', 'Weak', 'ضعيفة'], ['মোটামুটি', 'Fair', 'متوسطة'], ['শক্ত', 'Strong', 'قوية'], ['অনেক শক্ত', 'Very strong', 'قوية جدًا'],
  ['প্রস্তাবিত শক্ত পাসওয়ার্ড', 'Suggested strong passwords', 'كلمات مرور قوية مقترحة'],
  ['নতুন দেখুন', 'Refresh', 'اقتراحات جديدة'],
  ['ট্যাপ করলে পাসওয়ার্ড বসে যাবে — কোথাও লিখে রাখুন।', 'Tap one to use it — and write it down somewhere safe.', 'اضغط على واحدة لاستخدامها — ودوّنها في مكان آمن.'],
  // কোডের পাতার শিরোনাম
  ['লগ ইন সম্পূর্ণ করতে', 'To finish logging in,', 'لإكمال تسجيل الدخول،'],
  ['অ্যাকাউন্ট চালু করতে', 'To activate your account,', 'لتفعيل حسابك،'],
  ['পাসওয়ার্ড রিসেট করতে', 'To reset your password,', 'لإعادة تعيين كلمة المرور،'],
  // ট্যাব শিরোনাম
  ['পাগলা পড়া', 'Paglapora', 'Paglapora'], ['ভাষা', 'Language', 'اللغة'], ['বিষয়', 'Subject', 'المادة'], ['স্তর', 'Level', 'المستوى'], ['দৈনিক লক্ষ্য', 'Daily goal', 'الهدف اليومي'], ['প্রস্তুত', 'Ready', 'جاهز'],
  ['অ্যাকাউন্ট খুলুন', 'Create account', 'إنشاء حساب'], ['ইমেইল কোড', 'Email code', 'رمز البريد'], ['আরও তথ্য', 'More info', 'مزيد من المعلومات'], ['বার্তা', 'Message', 'رسالة'], ['আবারও স্বাগতম', 'Welcome back', 'مرحبًا بعودتك'], ['স্বাগতম', 'Welcome', 'مرحبًا'],
  ['নতুন পাসওয়ার্ড', 'New password', 'كلمة مرور جديدة'],
  ['পাসওয়ার্ড ভুলে গিয়েছি ', 'Forgot password', 'نسيت كلمة المرور'],
];
const D = {}; T.forEach(([b, e, a]) => { D[b] = { en: e, ar: a }; });
export const t = (bn) => (cur === 'bn' ? bn : (D[bn] && D[bn][cur]) || bn);

// জোড়া-লাগানো বাক্য (ভাষাভেদে ক্রম আলাদা)
const F = {
  resendIn: { bn: (x) => 'আবার পাঠাতে ' + x, en: (x) => 'Resend in ' + x, ar: (x) => 'إعادة الإرسال بعد ' + x },
  cool: { bn: (m, s) => 'এই ইমেইলে এইমাত্র লিংক পাঠানো হয়েছে। আবার পাঠাতে ' + m + ' মিনিট ' + s + ' সেকেন্ড অপেক্ষা করুন।', en: (m, s) => 'A link was just sent to this email. Please wait ' + m + ' min ' + s + ' sec to send again.', ar: (m, s) => 'تم إرسال رابط إلى هذا البريد للتو. انتظر ' + m + ' دقيقة و' + s + ' ثانية لإعادة الإرسال.' },
  otp: { bn: (p) => p + ' আপনার ইমেইলে পাঠানো লিংকে ক্লিক করুন।', en: (p) => p + ' click the link we sent to your email.', ar: (p) => p + ' اضغط على الرابط المرسل إلى بريدك الإلكتروني.' },
  box: { bn: (n) => 'কোডের ' + n + ' নম্বর ঘর', en: (n) => 'Code box ' + n, ar: (n) => 'خانة الرمز ' + n },
};
export const tf = (k, ...a) => F[k][cur](...a);

const LEGAL = {
  bn: '<p>পাগলা পড়ায় সাইন ইন করার মাধ্যমে আপনি আমাদের <b>শর্তাবলি</b> এবং <b>প্রাইভেসি পলিসি</b> মেনে চলতে সম্মতি জানাচ্ছেন।</p><p>পাগলা পড়া — পাগলের মতো পড়ো, মজা করে শেখো, রোজ একটু একটু করে এগিয়ে যাও!</p>',
  en: '<p>By signing in to Paglapora, you agree to our <b>Terms</b> and <b>Privacy Policy</b>.</p><p>Paglapora — learn like crazy, have fun, and move ahead a little every single day!</p>',
  ar: '<p>بتسجيل الدخول إلى Paglapora فإنك توافق على <b>الشروط</b> و<b>سياسة الخصوصية</b>.</p><p>Paglapora — تعلّم بشغف، واستمتع، وتقدّم قليلًا كل يوم!</p>',
};
export const legalHtml = () => LEGAL[cur];

// ---- পাতার লেখা বদলানো ----
const origT = new WeakMap(), ATTRS = ['placeholder', 'aria-label', 'title'];
export function applyDom(root = document.getElementById('auth')) {
  if (!root) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => { const p = n.parentElement; return !p || /^(SCRIPT|STYLE)$/.test(p.tagName) || p.closest('[data-notr],[data-legal],svg') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; } });
  for (let n; (n = w.nextNode());) {
    if (!origT.has(n)) origT.set(n, n.nodeValue); const o = origT.get(n), k = o.trim(); if (!k) continue;
    const v = cur === 'bn' ? k : (D[k] && D[k][cur]) || k; n.nodeValue = o.replace(k, v);
  }
  root.querySelectorAll('[placeholder],[aria-label],[title]').forEach((el) => ATTRS.forEach((a) => {
    if (!el.hasAttribute(a)) return; const ds = 'o' + a.replace(/-./g, (m) => m[1].toUpperCase()); if (!el.dataset[ds]) el.dataset[ds] = el.getAttribute(a);
    const k = el.dataset[ds]; el.setAttribute(a, cur === 'bn' ? k : (D[k] && D[k][cur]) || k);
  }));
  document.querySelectorAll('[data-legal]').forEach((n) => { n.innerHTML = LEGAL[cur]; });
  const snack = document.getElementById('snack'); if (snack) snack.hidden = true;
}
export function setLang(l, apply = true) {
  if (!OK.includes(l)) return; cur = l; try { localStorage.setItem(KEY, l); } catch (e) {}
  const d = document.documentElement; d.lang = l; d.dir = 'ltr'; d.toggleAttribute('data-rtl', l === 'ar'); /* ডিজাইন কখনো মিরর হয় না; শুধু লেখা ডান-থেকে-বামে */ if (apply) applyDom(); dispatchEvent(new CustomEvent('pp:lang', { detail: l }));
}
