---
title: 解决 Google Analytics（谷歌统计）无数据问题的经历
# published: false
---

## 背景
这段时间心血来潮，想尽量多写一些博客，然后又想着加个统计看看，追踪下有没有人进来，哪些文章被看得多，哪些流量来源的占比高等等。
虽然这个博客内容又水又少，数据肯定是一片0无疑了，但还是怀着好奇，勇于直面惨淡。

## 开始
这个博客用的主题是 [minima](https://jekyll.github.io/minima/)，在文档中找到了[开启谷歌统计的方式](https://github.com/jekyll/minima#enabling-google-analytics)，其实就是在 _config.yml 中加入下面这样一行即可：
```yaml
google_analytics: UA-NNNNNNNN-N
```

改好配置重新生成之后，查看首页的源码，看到了引入js和初始化谷歌统计的代码，相关功能的[源码](https://github.com/jekyll/minima/blob/4032b2258a9f3e823c54f8364672261b4b8dc69f/_includes/google-analytics.html)如下：
{% raw %}
```html
<script async src="https://www.googletagmanager.com/gtag/js?id={{ site.google_analytics }}"></script>
<script>
  window['ga-disable-{{ site.google_analytics }}'] = window.doNotTrack === "1" || navigator.doNotTrack === "1" || navigator.doNotTrack === "yes" || navigator.msDoNotTrack === "1";
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '{{ site.google_analytics }}');
</script>
```
{% endraw %}

## 无数据
引入好之后，就时不时的打开统计页面，数据一直都是0，我知道没人看，我心里这点 B-tree 还是有的，但我自己点的总要有个1吧。

<img width="534" alt="image" src="https://github.com/nanhualyq/nanhualyq.github.io/assets/6212850/4d7e6ec7-3ec3-4fb0-ba70-b29dd8c4dc89">

看到有个提示说，新引入的站点可能需要24~48小时后才会看到数据，所以就先放下了。第二天看了还是0，想着可能要48小时，又放下了。第三天再看还是0，我就觉得不对劲了。

## AdBlocker
打开博客首页，浏览器打开控制台，赫然出现一条黄色警告：
```
Loading failed for the <script> with source “https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX”.
```

居然没能成功加载js文件，抬头一看浏览器插件 AdBlocker 上面显示着已屏蔽的广告数量，恍然大悟，赶紧关掉插件，再刷新网页，控制台就看不到这个警告了。

PS：有点好奇广告插件为什么要屏蔽统计脚本，这并不会渲染什么广告啊。

## Cookies
刷新网页后，控制台又冒出一堆黄色的警告，类似这样：
```
Some cookies are misusing the recommended “SameSite“ attribute
Cookie “_ga_XXXXXXXX” has been rejected for invalid domain.
Cookie “_ga” has been rejected for invalid domain.
```

这个是 Firefox 阻止了 cookies 发出去，因为博客的域名和Google统计的域名不一样，跨域了。

然后搜到了[方法](https://stackoverflow.com/a/62569420)，需要在初始化的代码中增加两项配置，域名改成自己的，标志改成允许跨域。

要做到这个，只能用自己的代码覆盖主题源码的这个部分了，新建 _includes/google-analytics.html 文件，[代码](https://github.com/nanhualyq/nanhualyq.github.io/blob/76afb322b3a8c10e7e1adbcc721c5a24361f512b/_includes/google-analytics.html#L13)如下：
{% raw %}
```html
<!-- Google tag (gtag.js) -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id={{ site.google_analytics }}"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());

  gtag("config", "{{ site.google_analytics }}", { // 这里就是增加的配置
    cookie_domain: location.host,
    cookie_flags: "SameSite=None;Secure",
  });
</script>
```
{% endraw %}

## 成功
解决完上面的阻碍之后，再次刷新页面，控制台没有警告了，打开统计页面，终于看到那个梦寐以求的，等了好几天的，迟来的**1**了。

<img width="534" alt="image" src="https://github.com/nanhualyq/nanhualyq.github.io/assets/6212850/0ca8857c-ed8b-4013-bfe1-9043156e5486">