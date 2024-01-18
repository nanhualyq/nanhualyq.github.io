# Study
- [Jekyll]({% link study/jekyll.html %})
- [Liquid]({% link study/liquid.html %})

{% for html in site.html_pages %}
	- [{{ html.title }}]({% link {{ html.path }} %})
{% endfor %}