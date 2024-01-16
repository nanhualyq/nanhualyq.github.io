# Study
- <a href="study/jekyll.html">Jekyll</a>

<ul>
  {% for file in site.static_files %}
    <li>
      <a href="{{ file.path }}">{{ file.name }}</a>
    </li>
  {% endfor %}
</ul>