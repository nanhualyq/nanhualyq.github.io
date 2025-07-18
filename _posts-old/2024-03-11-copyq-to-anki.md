---
title: 提升 Anki 的录入效率
# published: false
---

## 背景
这些年用 Anki 学习各种各样的材料，一直都是手动输入添加的，后来了解到有个批量导入文本的功能，用了一段时间，感觉还是有点麻烦，往往要做一些预处理或者格式化的工作，数量不多的话真没什么必要。

在网上也找到过一些工具，大概就是这两种类型：
- 浏览器扩展
- 词典

基本都是针对学习外语使用的，可以把查询的单词或句子提取出几个关键字段，然后一键添加进 Anki 里面，如果只是需要复制词典内容，那么这些工具的确够用了。

但我还是有些贪心，不满足的地方在于：
1. 浏览器扩展没办法用在其他地方，比如电子书阅读器
2. 词典都是添加单条信息，没办法批量导入
3. 除了外语，还有很多其他类型的材料

既然没有满意的工具，那就自己造个轮子吧。

## 动手
了解其他工具的运作原理，就知道其实都是借助了 anki 的一个插件“anki-connect”，根据需要往这个插件的服务上发送 http 请求来实现自动添加材料的。

一开始我是用 electon 做的，主要是想着绑定全局快捷键比较方便，然后发现内置的 API 好像没办法获取到聚焦窗口的信息，所以又写了个浏览器扩展把聚焦的网页信息发送过来，基本能满足了。

后面突然想起 copyq 好象是可以判断窗口信息的，比如检测到从密码管理器复制密码时，自动清理历史记录中的密码。然后又去爬了一遍文档，发现真的可以，还能获取到网页的 url ,不过是带有 moz 的，不知道是不是只有火狐支持。

所以决定不用 electron ,直接用 node 脚本从 copyq 的 API 获取信息，然后发送请求到 anki-connect 一样能完成，而且借助于 copyq 的跨平台特性，理论上代码是通用的。

这就是 [copyq-to-anki](https://github.com/nanhualyq/copyq-to-anki)

## copyq-to-anki
![o](https://github.com/nanhualyq/copyq-to-anki/assets/6212850/a90833a7-6045-4087-ab56-21fc8cdd1d69)

最基本的用法就是用来增量阅读，碰到想学习的地方，选中文本按下快捷键就可以添加卡片了。

---

学习编程需要贴上代码，所以可以带上 HTML 样式：

![o](https://github.com/nanhualyq/copyq-to-anki/assets/6212850/afb16f5a-79e0-4728-84e6-e276189f1d00)

---

增量阅读最好还是加上来源，方便日后追根溯源：

![o](https://github.com/nanhualyq/copyq-to-anki/assets/6212850/d63d89bb-5033-4b2f-ba1e-1d62f9391c91)

---

学英语的话，从有道词典上爬解释和音标，从 google 上下载朗读音频，有道朗读句子的时候经常把缩写当成单词，感觉怪怪的。

![o](https://github.com/nanhualyq/copyq-to-anki/assets/6212850/1264c06f-68f8-4c45-bde6-08272a16764a)

为了专项练习英语，我会用 AI 生成句子来刷：

![o](https://github.com/nanhualyq/copyq-to-anki/assets/6212850/35c79ace-9c39-445c-aa26-fb87c88eadb6)

---

程序员刷 API 文档经常需要爬表格：

![o](https://github.com/nanhualyq/copyq-to-anki/assets/6212850/94233280-8c06-4f9f-beb7-58c4331a5674)


## 后记
东西很粗糙，刚好够解决我的这点需求，以后冒出新需求再继续更新，欢迎批评指正。

## 2024-06-06 补充
刚刚用 Svelte 重写了一版，代码见地址：https://github.com/nanhualyq/quick-menu-svelte