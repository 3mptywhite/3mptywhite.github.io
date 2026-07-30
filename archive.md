---
layout: default
title: Archive
permalink: /archive/
nav_exclude: true
has_toc: false
archive_page: true
---

{% assign articles = site.html_pages | where_exp: "item", "item.date" | sort: "date" | reverse %}
{% assign current_year = "" %}

<header class="index-page-hero">
  <p class="index-page-kicker">TIMELINE</p>
  <h1>Archive</h1>
  <p>沿时间回看写作与学习轨迹。</p>
</header>

<div class="archive-index">
  {% for article in articles %}
    {% assign article_year = article.date | date: "%Y" %}
    {% if article_year != current_year %}
      {% unless current_year == "" %}</div></section>{% endunless %}
      <section class="archive-year">
        <h2>{{ article_year }}</h2>
        <div class="archive-year-items">
      {% assign current_year = article_year %}
    {% endif %}
          <a class="archive-item" href="{{ article.url | relative_url }}">
            <time datetime="{{ article.date | date_to_xmlschema }}">{{ article.date | date: "%m.%d" }}</time>
            <span>{{ article.title }}</span>
          </a>
  {% endfor %}
  {% unless current_year == "" %}</div></section>{% endunless %}
</div>
