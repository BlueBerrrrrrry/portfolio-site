// scroll-reveal.js — 滚动驱动的文字升起陈列（ReactBits Pro 风格；滚动监听实现，稳定无 IO 依赖）
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  function splitChars(el) {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;
    el.textContent = '';
    const frag = document.createDocumentFragment();
    Array.from(text).forEach((ch, i) => {
      const w = document.createElement('span');
      w.className = 'rv-w';
      const c = document.createElement('span');
      c.className = 'rv-c';
      c.textContent = ch === ' ' ? '\u00A0' : ch;
      c.style.setProperty('--i', String(i));
      w.appendChild(c);
      frag.appendChild(w);
    });
    el.appendChild(frag);
  }

  let targets = [];
  let lastCheck = 0;

  function check() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    targets = targets.filter((el) => {
      if (!el.isConnected) return false;
      const r = el.getBoundingClientRect();
      // 元素顶部进入视口 90% 处即触发
      if (r.top < vh * 0.9 && r.bottom > 0) {
        el.classList.add('is-in');
        el.classList.remove('rv-before');
        return false;
      }
      return true;
    });
  }

  function onScroll() {
    const now = Date.now();
    if (now - lastCheck > 90) {
      lastCheck = now;
      check();
    }
  }

  function init() {
    targets = [...document.querySelectorAll('[data-reveal]')];
    if (!targets.length) return;
    targets.forEach((el) => {
      if (el.getAttribute('data-reveal') === 'chars') splitChars(el);
      el.classList.add('rv-before');
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    // 诊断出口
    window.__sr = { version: 'v3', count: targets.length, check, targets };
    // 双保险：轮询兜底（防止事件通道异常），全部触发后自动停止
    const poll = setInterval(() => {
      check();
      if (!targets.length) clearInterval(poll);
    }, 300);
    check(); // 页面初始即为锚点（#overview）时立即触发
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
