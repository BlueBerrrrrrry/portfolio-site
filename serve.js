// 极简零依赖静态服务器：node serve.js [port]
// 用于本地预览作品集网站（正式部署走 GitHub Pages）
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = Number(process.argv[2] || process.env.PORT || 8000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".m4a": "audio/mp4",
  ".mp3": "audio/mpeg",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (urlPath.endsWith("/")) urlPath += "index.html";
  const filePath = path.normalize(path.join(ROOT, urlPath));

  // 防目录穿越
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("403 Forbidden");
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      // 找不到文件：返回自定义 404
      fs.readFile(path.join(ROOT, "404.html"), (e2, data) => {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end(e2 ? "404 Not Found" : data);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    const total = stat.size;

    // ── Range 请求：视频拖动进度条依赖 206 + Content-Range ──
    const range = req.headers.range;
    if (range) {
      const m = /^bytes=(\d*)-(\d*)$/.exec(String(range).trim());
      if (m) {
        let start = m[1] === "" ? null : parseInt(m[1], 10);
        let end = m[2] === "" ? null : parseInt(m[2], 10);
        if (start === null && end !== null) {
          // bytes=-500 → 最后 500 字节
          start = Math.max(0, total - end);
          end = total - 1;
        } else {
          if (start === null) start = 0;
          if (end === null || end >= total) end = total - 1;
        }
        if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= total) {
          res.writeHead(416, { "Content-Range": `bytes */${total}` });
          res.end();
          return;
        }
        res.writeHead(206, {
          "Content-Type": type,
          "Accept-Ranges": "bytes",
          "Content-Range": `bytes ${start}-${end}/${total}`,
          "Content-Length": end - start + 1,
          "Cache-Control": "no-cache",
        });
        if (req.method === "HEAD") { res.end(); return; }
        fs.createReadStream(filePath, { start, end }).pipe(res);
        return;
      }
    }

    res.writeHead(200, {
      "Content-Type": type,
      "Accept-Ranges": "bytes",
      "Content-Length": total,
      "Cache-Control": "no-cache",
    });
    if (req.method === "HEAD") { res.end(); return; }
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`作品集网站本地预览已启动：http://127.0.0.1:${PORT}`);
});
