# 关卡设计师作品集（占位版）

复刻自 colorsleveldesign.com 视觉语言的作品集单页：
深色沉浸式、Loading 进度、自定义光标、侧边点状导航、按关卡逐层拆解
（设计总览 → L0~L3：流线播放器 / 情绪曲线 / 设计亮点）。

> 当前为**占位版**：不含任何个人信息与真实简历，所有内容均标记为【待补充】。

## 本地预览

双击 `serve.bat`，或：

```bash
node serve.js
# 打开 http://127.0.0.1:8000
```

## 部署（任选其一，均免费）

### Cloudflare Pages（推荐，国内访问相对稳定）
1. 登录 [Cloudflare](https://dash.cloudflare.com) → Workers & Pages → Create → Pages
2. 选 **Upload assets**，把本文件夹内容拖入
3. 得到 `https://xxx.pages.dev` 公开地址

### GitHub Pages
1. GitHub 新建仓库，把文件推到根目录
2. Settings → Pages → Source 选 `main` 根目录

### Vercel / Netlify
直接拖拽本文件夹。

## 待你补充的内容

- `index.html`：
  - `.hero-sub`：自我介绍与项目一句话简介
  - `#info`：项目类型/引擎/团队/周期/职责
  - `#overview-design`：核心机制 / 空间动线 / 情绪曲线 / 机制递进
  - `#l0` ~ `#l3`：每关的流线播放器段落、情绪曲线说明、设计亮点
  - 底部联系邮箱与 GitHub
- 关卡演示：`#demo` 占位区替换为视频/截图/GIF
- 项目名：`L1/L2/L3` 的关卡名改为真实名称

## 隐私提醒

- 此仓库不含简历与个人信息，公开发布前请自行确认所有【待补充】处没有泄露隐私。
