---
title: Games
---

- [贪吃蛇](/games/snake)

{% assign directories = Dir.glob("games/*") %}

<ul>
  {% for directory in directories %}
      <li><a href="{{ site.baseurl }}/{{ directory | split:'/' | last }}">{{ directory | split:'/' | last }}</a></li>
  {% endfor %}
</ul>
