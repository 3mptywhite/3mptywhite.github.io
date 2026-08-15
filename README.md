# 3mptywhite 的 Obsidian 笔记博客

这个仓库同时是博客源码和 Obsidian 内容仓库。网站由 Quartz 5 生成，Markdown、Wiki 链接、反向链接、搜索、关系图和 `.canvas` 都会自动发布到 <https://3mptywhite.github.io/>。

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

## 恢复旧版

改造前的 Jekyll / Just the Docs 版本保留在 `legacy/jekyll-20260815` 分支。
