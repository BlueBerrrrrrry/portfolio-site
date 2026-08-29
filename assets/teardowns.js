// teardowns.js — 拆解作品集交互：视频播放列表 + 空态检测（原生 JS，无依赖）
(function () {
  const video = document.getElementById('td-video');
  const empty = document.getElementById('td-video-empty');
  const items = Array.from(document.querySelectorAll('.td-pl-item'));
  if (!video || !items.length) return;

  let failed = new Set();

  function markEmpty() {
    if (video.getAttribute('data-empty') === '1') return;
    video.setAttribute('data-empty', '1');
    if (empty) empty.style.display = 'flex';
    video.style.display = 'none';
  }

  function markOk() {
    if (video.getAttribute('data-empty') !== '1') return;
    video.removeAttribute('data-empty');
    video.style.display = '';
    if (empty) empty.style.display = 'none';
  }

  function play(src) {
    if (failed.has(src)) { markEmpty(); return; }
    // 校验资源可访问性：文件缺失时 <video> 触发 error 事件
    video.src = src;
    video.load();
    markOkRemovedAll();
  }

  function markOkRemovedAll() {
    // 切台时先不判断；error 事件里统一处理
  }

  video.addEventListener('error', () => {
    failed.add(video.src);
    markEmpty();
  });

  // 已存在可用源时（浏览器加载缓存）隐藏空态
  video.addEventListener('loadeddata', () => markOk());

  items.forEach((btn) => {
    btn.addEventListener('click', () => {
      items.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      play(btn.dataset.video);
    });
  });

  // 初始：无视频文件 → 显示空态占位
  const first = items[0];
  video.addEventListener('canplay', markOk, { once: true });
  setTimeout(() => {
    if (!video.readyState || video.readyState < 2) {
      // 无文件时 video 无帧数据：若 <video> error 未触发（部分浏览器），走 readyState 兜底
      if (!video.videoWidth) markEmpty();
    }
  }, 1200);
})();
