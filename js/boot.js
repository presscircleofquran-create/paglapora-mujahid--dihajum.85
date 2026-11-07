/* head-এ আগে চলে (ঝলকানি ছাড়া থিম): এখন শুধু ডার্ক।
   পেজ খোলা থাকলেও সময় বদলালে নিজে থেকে বদলে যায়। ?theme=light|dark দিয়ে জোর করা যায় (পরীক্ষার জন্য)। */
(function () {
  var d = document.documentElement, q = /[?&]theme=(light|dark)/.exec(location.search), force = null;
  try { force = q ? q[1] : null; } catch (e) {}
  function pick() { return force || 'dark'; } /* আপাতত সবসময় ডার্ক; লাইট মোড ওয়েবসাইটের কাজ শেষে চালু হবে (?theme=light শুধু পরীক্ষার জন্য) */
  function apply() {
    var t = pick(); if (d.getAttribute('data-theme') !== t) d.setAttribute('data-theme', t);
    var m = document.querySelector('meta[name=theme-color]'); if (m) m.content = t === 'dark' ? '#131f24' : '#ffffff';
  }
  apply(); document.addEventListener('DOMContentLoaded', apply);
})();
