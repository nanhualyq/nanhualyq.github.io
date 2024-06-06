---
title: Games
---

- [贪吃蛇](/games/snake)

{% assign directories = Dir.glob("_site/games/*") %}

<ul>
  {% for directory in directories %}
    {% if directory != "_site" and directory != "_site/assets" and directory != "_site/css" and directory != "_site/js" and directory != "_site/img" and directory != "_site/fonts" and directory != "_site/404.html" and directory != "_site/sitemap.xml" and directory != "_site/robots.txt" %}
      <li><a href="{{ site.baseurl }}/{{ directory | split:'/' | last }}">{{ directory | split:'/' | last }}</a></li>
    {% endif %}
  {% endfor %}
</ul>