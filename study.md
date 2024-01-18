# Study
- [Jekyll]({% link study/jekyll.html %})
- [Liquid]({% link study/liquid.html %})

{% for page in site.html_pages %}
{{ page | jsonify }}

{% if page.path contains "study/" %}
- [Jekyll]({% link {{page.path}} %})
{% endif %}
{% endfor %}