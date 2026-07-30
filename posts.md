---
layout: default
title: Posts
permalink: /posts/
nav_exclude: true
has_toc: false
posts_page: true
---

{% assign articles = site.html_pages | where_exp: "item", "item.date" | sort: "date" | reverse %}

<header class="index-page-hero">
  <p class="index-page-kicker">WRITING</p>
  <h1>Posts</h1>
  <p>按发表时间浏览全部文章。</p>
</header>

<div class="post-index">
  {% for article in articles %}
    {% assign article_category = article.grand_parent | default: article.parent %}
    <a class="post-index-item" href="{{ article.url | relative_url }}">
      <time datetime="{{ article.date | date_to_xmlschema }}">{{ article.date | date: "%Y.%m.%d" }}</time>
      <span class="post-index-copy">
        <strong>{{ article.title }}</strong>
        {% if article_category %}
          <span>{{ article_category }}</span>
        {% endif %}
      </span>
      <span class="post-index-arrow" aria-hidden="true">→</span>
    </a>
  {% endfor %}
</div>
