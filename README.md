# 游戏系统策划拆解作品集（2077 霓虹风格）

单页求职作品集：Hero（WebGL 霓虹标题）→ 拆解视频区 → 三份在线拆解案阅读器
→ 项目信息 → 关卡演示 → 设计总览 → L0~L3 → 随笔（博客）。

**已上线**：https://blueberrrrrrry.github.io/portfolio-site/ （GitHub Pages，main 分支自动构建）

视觉风格：赛博朋克 2077 —— 霓虹三色（青 #00f0ff / 黄 #fcee0a / 品红 #fe0054）、
CRT 扫描线、网格背景、切角卡片、故障闪烁标题、加载器「INITIALIZING PORTFOLIO.SYS」。

> 站内「项目信息 / 关卡演示 / L0-L3」等区块仍为【待补充】占位，补内容后走发布三步即可。

## 本地预览

双击 `serve.bat`，或：

```bash
node serve.js
# 打开 http://127.0.0.1:8000
```

## 发布上线（三步）

```bash
git add -A
git commit -m "更新说明"
git push
```
→ GitHub Pages 约 1 分钟后自动上线，验证：`curl -s -o /dev/null -w "%{http_code}" https://blueberrrrrrry.github.io/portfolio-site/`

## 隐私提醒

- 此仓库不含简历与真实联系方式，公开发布前请确认所有【待补充】处没有泄露隐私。
- 拆解案均为「外部黑盒」公开信息反推，已标注口径与推断项。
