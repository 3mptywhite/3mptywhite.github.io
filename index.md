---
layout: home
title: Frank 的笔记本
---

欢迎，这里是我的个人笔记和博客。

## 笔记目录

{% for page in site.pages %}
- [{{ page.title }}]({{ page.url | relative_url }})
{% endfor %}

## 最近文章

{% for post in site.posts limit:5 %}
- [{{ post.title }}]({{ post.url | relative_url }}) — *{{ post.date | date: "%Y-%m-%d" }}*
{% endfor %}

{% if site.posts.size == 0 %}
> 还没有文章，去 `_posts/` 目录下新建 `yyyy-mm-dd-标题.md` 写第一篇吧。
{% endif %}
