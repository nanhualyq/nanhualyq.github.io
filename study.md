# Study
- [Jekyll]({% link study/jekyll.html %})
- [Liquid]({% link study/liquid.html %})

{% for html in site.html_pages %}
	{% if html.path contains "study/" %}
	- <a href="{{ html.path }}">{{ html.title }}</a>
	{% endif %}
{% endfor %}