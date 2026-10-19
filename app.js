"use strict";

// ── Loading 遮罩：0→100% 后收起 ──
(function () {
  const loader = document.getElementById("loader");
  const pct = document.getElementById("loader-pct");
  if (!loader) return;
  let v = 0;
  const timer = setInterval(() => {
    v += Math.floor(Math.random() * 18) + 4;
    if (v >= 100) {
      v = 100;
      clearInterval(timer);
      setTimeout(() => loader.classList.add("done"), 300);
      return;
    }
    if (pct) pct.textContent = String(v).padStart(2, "0");
  }, 110);
})();

// ── 自定义光标 ──
(function () {
  const cursor = document.getElementById("cursor");
  if (!cursor || window.matchMedia("(hover: none)").matches) return;
  let x = 0, y = 0, cx = 0, cy = 0;
  window.addEventListener("mousemove", (e) => {
    x = e.clientX; y = e.clientY;
    cursor.classList.add("ready");
  });
  (function loop() {
    cx += (x - cx) * 0.18;
    cy += (y - cy) * 0.18;
    cursor.style.left = cx + "px";
    cursor.style.top = cy + "px";
    requestAnimationFrame(loop);
  })();
  const hoverSel = "a, button, .project-row, .fp-seg, .hero-link";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest && e.target.closest(hoverSel)) cursor.classList.add("hovering");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest && e.target.closest(hoverSel)) cursor.classList.remove("hovering");
  });
})();

// ── 侧边导航：滚动高亮 ──
(function () {
  const nav = document.getElementById("side-nav");
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll(".nav-link"));
  const targets = links
    .map((a) => document.getElementById(a.dataset.target))
    .filter(Boolean);
  const map = {};
  links.forEach((a) => { map[a.dataset.target] = a; });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        if (en.target.id === "hero") {
          // 回到首屏：清除高亮，避免导航标签与 Hero 文案重叠
          links.forEach((l) => l.classList.remove("active"));
          return;
        }
        links.forEach((l) => l.classList.remove("active"));
        const a = map[en.target.id];
        if (a) a.classList.add("active");
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );
  targets.forEach((t) => io.observe(t));
  const hero = document.getElementById("hero");
  if (hero) io.observe(hero);
})();

// ── 页脚年份 ──
(function () {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();

// ── 跨页面锚点兜底：带 #hash 进入时，load 后立即精确定位 ──
// （Chromium 会等布局完全稳定才做自动锚点滚动，期间 scrollRestoration=auto 还会拉回顶部）
(function () {
  if (!location.hash) return;
  const id = decodeURIComponent(location.hash.slice(1));
  const target = document.getElementById(id);
  if (!target) return;
  history.scrollRestoration = "manual";
  const go = () => target.scrollIntoView({ behavior: "instant", block: "start" });
  if (document.readyState === "complete") setTimeout(go, 350);
  else window.addEventListener("load", () => setTimeout(go, 350));
})();

// ── 博客页主题按钮（浅色占位：仅切换属性，样式仍为深色主题）──
(function () {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const root = document.documentElement;
    root.setAttribute("data-theme", root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    btn.textContent = root.getAttribute("data-theme") === "dark" ? "☾" : "☀";
  });
})();

// ── 返回顶部 ──
(function () {
  const btn = document.getElementById("to-top");
  if (!btn) return;
  const sync = () => btn.classList.toggle("is-visible", window.scrollY > 600);
  window.addEventListener("scroll", sync, { passive: true });
  sync();
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });
})();

// ── 进入页面默认回到顶部（除非 URL 带锚点） ──
(function () {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (location.hash) return;
  const toTop = () => window.scrollTo(0, 0);
  toTop();
  window.addEventListener("load", toTop);
  window.addEventListener("pageshow", toTop);
})();
