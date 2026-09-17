# Obsidian 笔记博客

这个仓库同时是博客源码和 Obsidian 内容仓库。网站由 Quartz 5 生成，Markdown、Wiki 链接、搜索和 `.canvas` 都会自动发布到 <https://3mptywhite.github.io/>。

## 最简单的日常维护

1. 用 Obsidian 打开 `content/` 文件夹，把它当作一个 Vault。
2. 在里面新增或修改 `.md`、`.canvas` 和图片；不用手工维护侧边栏。
3. 提交并推送到 `master`，GitHub Pages 会自动更新网站。

Obsidian Git 插件也可以完成第 3 步。私密内容放在 `content/private/`，模板放在 `content/templates/`，它们不会发布。

## 本地预览

需要 Node.js 22 或更高版本：

```bash
npm install
npm run dev
```

浏览器打开终端里显示的本地地址。正式构建使用：

```bash
npm run build
```

## 内容约定

一篇最小笔记只需要：

```markdown
---
title: 笔记标题
tags:
  - 主题
---

正文里可以直接使用 [[另一篇笔记]]、![[图片.png]]、数学公式、Mermaid 和 Obsidian Callout。
```

Canvas 无需转换：把 `.canvas` 放进 `content/`，Quartz 会直接生成可平移、缩放和点击的网页视图。

## 作品集

作品集入口为 `/portfolio/`，源文件位于根目录 `portfolio/`。`npm run build` 完成后，`postbuild` 将其复制到 `public/portfolio/`。

这个目录不参与 Quartz 内容解析，因此不会出现在博客的侧栏、搜索、最近发布、RSS 或站点地图中。作品集和两篇技术笔记均带有 `noindex` 标记。它们是公开可访问但不列出入口的页面，不提供密码保护；不要将这个机制当作访问控制。

视频位于 `portfolio/media/`，使用本地 MP4 和原生播放控件，点击后加载。维护时保持媒体路径相对当前页面，不依赖内网链接。

## 恢复旧版

改造前的 Jekyll / Just the Docs 版本保留在 `legacy/jekyll-20260815` 分支。
