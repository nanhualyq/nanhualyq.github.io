# Study
- [Jekyll]({% link study/jekyll.html %})
- [Liquid]({% link study/liquid.html %})

{% for page in site.html_pages %}
	- [{{ page.title }}]({% link {{ page.path }} %})
{% endfor %}