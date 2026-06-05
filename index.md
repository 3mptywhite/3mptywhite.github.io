---
layout: home
title: 目录
---

## 笔记

### Python
- [装饰器](notes/python/decorator)
- [生成器](notes/python/generator)

### Git
- [常用命令](notes/git/commands)

### 杂项
- [待整理](notes/misc/index)

---

## 最近文章

<ul>
{% for post in site.posts limit:5 %}
  <li>
    <a href="{{ post.url }}">{{ post.title }}</a>
    <small>{{ post.date | date: "%Y-%m-%d" }}</small>
  </li>
{% endfor %}
</ul>
