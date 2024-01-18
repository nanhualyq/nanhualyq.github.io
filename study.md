# Study
- [Jekyll]({% link study/jekyll.html %})
- [Liquid]({% link study/liquid.html %})

{{ site.pages | jsonify}}
	

A list of all Pages.

<hr>

{{ site.html_pages | jsonify}}
	

A subset of site.pages listing those which end in .html.

<hr>

{{ site.html_files | jsonify}}
	

A subset of site.static_files listing those which end in .html.