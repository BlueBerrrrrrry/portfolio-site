// td-reader.js — Word 式拆解阅读器：目录 1、2、3 → 点击条目后以该条为起点展开呈现
(function () {
  const DOCS = [
    { btn: document.getElementById('td-doc-1'), file: 'assets/docs/HSR-背包系统拆解.md', title: '崩坏：星穹铁道 · 背包系统拆解' },
    { btn: document.getElementById('td-doc-2'), file: 'assets/docs/异环-商业化拆解.md', title: '异环 · 商业化与付费结构拆解' },
    { btn: document.getElementById('td-doc-3'), file: 'assets/docs/原神7.0版本活动拆解.md', title: '原神 7.0 · 版本活动系统拆解' },
  ].filter((d) => d.btn);

  if (!DOCS.length) return;

  // ---------- Markdown → Word 风格 DOM ----------
  function renderMd(md) {
    const root = document.createElement('article');
    root.className = 'wd-doc';
    const lines = md.replace(/\r\n/g, '\n').split('\n');
    let curUl = null;
    let curOl = null;
    let curBq = null;   // 当前引用块（连续 "> " 行复用同一个）
    let curBqUl = null; // 引用块内的列表
    let tableRows = [];

    const inline = (text) => {
      const frag = document.createDocumentFragment();
      const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
      let last = 0;
      for (const m of text.matchAll(re)) {
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const tok = m[0];
        if (tok.startsWith('**')) {
          const b = document.createElement('b');
          b.textContent = tok.slice(2, -2);
          frag.appendChild(b);
        } else if (tok.startsWith('`')) {
          const c = document.createElement('code');
          c.textContent = tok.slice(1, -1);
          frag.appendChild(c);
        } else {
          const mm = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (mm) {
            const a = document.createElement('a');
            a.href = mm[2];
            a.textContent = mm[1];
            a.target = '_blank';
            frag.appendChild(a);
          }
        }
        last = m.index + tok.length;
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      return frag;
    };

    const flushTables = () => {
      if (!tableRows.length) return;
      const t = document.createElement('table');
      tableRows.forEach((cells, ri) => {
        const tr = document.createElement('tr');
        cells.forEach((cell) => {
          const isHead = ri === 0 && cells.every((c) => /^\s*-{2,}\s*$/.test(c));
          const el = isHead ? document.createElement('th') : document.createElement('td');
          el.appendChild(inline(cell));
          tr.appendChild(el);
        });
        t.appendChild(tr);
      });
      root.appendChild(t);
      tableRows = [];
    };

    for (const raw of lines) {
      const s = raw.trim();
      if (!s) { flushTables(); curUl = curOl = null; curBq = curBqUl = null; continue; }
      if (s.startsWith('|')) {
        const cells = s.split('|').slice(1, -1).map((c) => c.trim());
        if (cells.some((c) => /^\s*-{2,}\s*$/.test(c))) continue;
        tableRows.push(cells);
        continue;
      }
      flushTables();
      if (s.startsWith('### ')) { curUl = curOl = null; curBq = curBqUl = null; const h = document.createElement('h3'); h.appendChild(inline(s.slice(4))); root.appendChild(h); continue; }
      if (s.startsWith('## ')) { curUl = curOl = null; curBq = curBqUl = null; const h = document.createElement('h2'); h.appendChild(inline(s.slice(3))); root.appendChild(h); continue; }
      if (s.startsWith('# ')) { curUl = curOl = null; curBq = curBqUl = null; const h = document.createElement('h1'); h.appendChild(inline(s.slice(2))); root.appendChild(h); continue; }
      if (s === '---') { curUl = curOl = null; curBq = curBqUl = null; root.appendChild(document.createElement('hr')); continue; }
      if (s.startsWith('> ')) {
        curUl = curOl = null;
        const inner = s.slice(2).trim();
        const mBq = inner.match(/^[-*]\s+(.*)$/);
        if (mBq) {
          // "> - xxx"：引用块内的列表项，渲染为语义列表而不是带 "- " 前缀的段落
          if (!curBq) { curBq = document.createElement('blockquote'); root.appendChild(curBq); curBqUl = null; }
          if (!curBqUl) { curBqUl = document.createElement('ul'); curBq.appendChild(curBqUl); }
          const li = document.createElement('li');
          li.appendChild(inline(mBq[1]));
          curBqUl.appendChild(li);
          continue;
        }
        curBq = curBqUl = null;
        const q = document.createElement('blockquote');
        q.appendChild(inline(inner));
        root.appendChild(q);
        continue;
      }
      curBq = curBqUl = null;
      const mB = s.match(/^\s*[-*]\s+(.*)$/);
      if (mB) {
        if (curUl === null) { curUl = document.createElement('ul'); root.appendChild(curUl); }
        const li = document.createElement('li');
        li.appendChild(inline(mB[1]));
        curUl.appendChild(li);
        continue;
      }
      const mO = s.match(/^\s*\d+\.\s+(.*)$/);
      if (mO) {
        if (curOl === null) { curOl = document.createElement('ol'); root.appendChild(curOl); }
        const li = document.createElement('li');
        li.appendChild(inline(mO[1]));
        curOl.appendChild(li);
        continue;
      }
      curUl = curOl = null;
      const p = document.createElement('p');
      p.appendChild(inline(s));
      root.appendChild(p);
    }
    flushTables();
    return root;
  }

  // ---------- 交互：点击目录条目 → 以该条为起点展开 ----------
  let openDoc = null;
  let openPanel = null;

  function open(doc) {
    if (openDoc === doc.btn) return;
    close();
    const panel = document.createElement('div');
    panel.className = 'td-reader';
    panel.innerHTML =
      '<div class="td-reader-bar"><span class="td-reader-title"></span>' +
      '<button class="td-reader-close" type="button">收起 ▲</button></div>' +
      '<div class="td-reader-body"><p class="td-reader-loading">正在加载拆解案…</p></div>';
    panel.querySelector('.td-reader-title').textContent = doc.title;

    doc.btn.insertAdjacentElement('afterend', panel);
    doc.btn.classList.add('is-active');
    openDoc = doc.btn;
    openPanel = panel;

    fetch(doc.file)
      .then((r) => {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      })
      .then((md) => {
        const body = panel.querySelector('.td-reader-body');
        body.innerHTML = '';
        body.appendChild(renderMd(md));
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      })
      .catch(() => {
        panel.querySelector('.td-reader-body').innerHTML =
          '<p class="td-reader-loading">拆解案加载失败（' + doc.file + '）请检查站点文件。</p>';
      });
  }

  function close() {
    if (openPanel) { openPanel.remove(); openPanel = null; }
    if (openDoc) { openDoc.classList.remove('is-active'); openDoc = null; }
  }

  DOCS.forEach((d) => d.btn.addEventListener('click', () => open(d)));
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('td-reader-close')) close();
  });
})();
