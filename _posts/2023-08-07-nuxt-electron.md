---
title:  "把Nuxt3装进Electron"
---

## 背景
为了自学英语，最近开发了一个小工具：[授渔](https://github.com/nanhualyq/shouyu)。

用的Nuxt3，图的是简单省事，业务逻辑直接往 `pages/` 和 `api/` 下面加文件就可以了，比起用Express+各种插件各种配置要轻松许多。

等基本功能都做好之后，突然想到其实可以开源出去，说不定有几个类似需求的朋友们正等着这样一小场及时雨呢。

开源之后，我又想了下用户画像，感觉其中不懂开发的占比会较大，所以能提供一份用Electron打包的可执行程序的话，将会极大的降低普通用户的进入门槛。

需求明确后，接下来就是探索可能性了。
## Nuxt3
鉴于dev环境的访问速度太慢，我希望用编译后的生产代码放进客户端。
Nuxt3编译后的结果是这样的：
```
.output/
	nitro.json
	public/
	server/
		chunks/
		index.mjs
		index.mjs.map
		node_modules/
		package.json
```
连用到的依赖`node_modules/`都提取出来了，完全就是一个懒人包，再加一个nodejs就可以直接运行。

## Electron
怎样用Electron内部的nodejs执行一个文件把服务跑起来呢，在官网翻遍也没找到，后面是Google找到的，办法就是用`child_process.fork`开启一个子进程。
```js
const { fork } = require('child_process')
fork(`${__dirname}/.output/server/index.mjs`, [], {})
```
实际代码见[这里](https://github.com/nanhualyq/shouyu/blob/2d18f4e9d2388fb8a206441b1a5f1d7a2ae9d95a/electron/main.js#L42)

代码里还处理了一些别的问题，比如：
- 子进程跑起服务之后，还要先等监听端口的事情做完再打开窗口，不然第一次打开是空白页面，需要过几秒钟手动刷新才能看到内容。
- 另外如果端口被占用，就一直不会打开窗口，用户不是从命令行执行的话什么都看不到，所以需要弹个通知告知一下。
- 最后就是主程序退出之前，需要把子进程一起关掉，否则下次再打开就会出现端口被前一个子进程占用的情况了。

下一步，把这些打包到一起。

## Electron Forge
我看到官网文档推荐的打包程序是这个，所以一开始就朝着这个去了。

打包之后，运行报错如下：
```bash
[nuxt] [request error] [unhandled] [500] The module '.output/server/node_modules/better-sqlite3/build/Release/better_sqlite3.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 108. This version of Node.js requires
NODE_MODULE_VERSION 116. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).
  at process.func [as dlopen] (node:electron/js2c/asar_bundle:2:1822)  
  at Module._extensions..node (node:internal/modules/cjs/loader:1354:18)  
  at Object.func [as .node] (node:electron/js2c/asar_bundle:2:1822)  
  at Module.load (node:internal/modules/cjs/loader:1124:32)  
  at Module._load (node:internal/modules/cjs/loader:965:12)  
  at f._load (node:electron/js2c/asar_bundle:2:13330)  
  at Module.require (node:internal/modules/cjs/loader:1148:19)  
  at require (node:internal/modules/cjs/helpers:110:18)  
  at bindings (./.output/server/node_modules/bindings/bindings.js:112:48)  
  at new Database (./.output/server/node_modules/better-sqlite3/lib/database.js:48:64)
```
说的是 `better-sqlite3` 需要重新rebuild，因为Electron内部的nodejs版本和外部开发用的不一致。按照提示执行 `npx electron-rebuild` 没用。

搜索一天也没找到有用的办法，然后想到把 `better-sqlite3` 换掉不就行了吗。

接着就一直在折腾这个事情，先是找替代品，各种对比各种折腾，选定之后先试了下Electron打包运行，没出现上面的问题，页面也能加载到数据。

之后，开始了代码的替换，每个接口用到数据库的地方换完还要验证结果是不是正常，搞了一半，突然发现新包对事务的支持不如 `better-sqlite3` ，有些功能做不到之前的效果了，怀着一肚子的怨恨又取消了这个计划。

恢复代码之后，带着一半侥幸一半不甘心，又重新继续上面的研究，最后终于在某个（Github issues 的评论中）不起眼的角落，看到了一个人说执行类似的命令：`npx electron-rebuild -t dev` 。试了下还真可以。

后面回去仔细看了下文档，`-t` 大概是用来指定什么环境的依赖，默认值相当于是：`-t pro` ，所以我一开始执行没用，是因为我的依赖都放在了`devDependencies` 里面（[代码链接](https://github.com/nanhualyq/shouyu/blob/2d18f4e9d2388fb8a206441b1a5f1d7a2ae9d95a/package.json#L20)），而我这样做也是因为上面提到的，Nuxt3编译后会自动提取出去，所以在 `package.json` 里面区分依赖的环境就没什么意义了。

解决这个大麻烦之后，以为就没事了，接着又发现打包的结果里面，居然是把整个代码目录都丢进去了，而我的需求正如上面所说，只需要`.output/`即可。看到文档里面有个配置项`ignore`可以忽略不要的东西，捣鼓了下没达到要求，而且感觉特别麻烦，对我想要的这种场景使用起来很啰嗦，所以决定换个别的试试。

##  electron-builder 
相比 forge，这个更老一些，一开始我就去翻文档，发现 `files` 配置项正是我想要的，试了下真的可以，只需要给出结果想保留的东西即可。[代码链接](https://github.com/nanhualyq/shouyu/blob/2d18f4e9d2388fb8a206441b1a5f1d7a2ae9d95a/package.json#L37)

运行起来还是报错，因为这个默认是生成asar包，而forge默认只是复制目录下的零散文件，所以禁用了默认的asar就可以了。

至此，我想要的目的终于达成，用户直接下载可执行文件双击打开就可以开始，但是，用户应该从哪里下载，我难倒还要手动上传这个文件？

## Github actions + release
这是我第一次学习把代码开源出去，但好在我也用很多开源软件，所以还是知道其他仓库的release页面可以下载。

其实 github actions 不复杂，无非就是写个[yml文件](https://github.com/nanhualyq/shouyu/blob/2d18f4e9d2388fb8a206441b1a5f1d7a2ae9d95a/.github/workflows/electron.yml)配置下。

为了打包发布Electron，我用的是 `samuelmeuli/action-electron-builder@v1.6.0`，前面编译都没问题，就是上传结果的时候碰到了问题。

首先，是因为没有tag触发的问题，相关日志：
```bash
• uploading file=shouyu-0.0.1.AppImage provider=github

• skipped publishing file=shouyu-0.0.1.AppImage reason=release doesn't exist and not created because "publish" is not "always" and build is not on tag tag=v0.0.1 version=0.0.1

• skipped publishing file=latest-linux.yml reason=release doesn't exist and not created because "publish" is not "always" and build is not on tag tag=v0.0.1 version=0.0.1
```
好像是说这次构建不是tag事件触发的，所以就跳过发布了。

我的流程是这样的：本地dev分支开发 > commit + tag + push > 网页上提交PR，从 dev 到 main > 确认合入 main

所以触发构建的是PR，或者说push事件，不是tag事件，不知道怎么解决这个问题，我干脆就在PR合入之后，手动创建一个release草稿，填入一个tag，用这个tag事件去触发构建，就能走到发布的动作。

发布触发之后，报错403
```bash
  • uploading       file=shouyu-0.0.2.AppImage provider=github
  • creating GitHub release  reason=release doesn't exist tag=v0.0.2 version=0.0.2
  ⨯ 403 Forbidden
"method: post url: https://api.github.com/repos/nanhualyq/shouyu/releases\n\n          Data:\n          {\"message\":\"Resource not accessible by integration\",\"documentation_url\":\"https://docs.github.com/rest/releases/releases#create-a-release\"}\n          "
```
我知道403是校验没通过，只是很奇怪为什么会这样，因为按照 `samuelmeuli/action-electron-builder@v1.6.0` 示例代码中的注释：

```bash
build_script_name: 'electron:prebuild'
# GitHub token, automatically provided to the action
# (No need to define this secret in the repo settings)
github_token: ${{ secrets.github_token }}
```
说了不用自己提供 `github_token` ，结果这个报错又好像是没有提供一样。

最后，还是在他们的issues中找到了答案，原来 github actions 传入的 `github_token` 默认是只读权限，需要到settings页面去改成读写权限，然后就能过去了。只能猜测以前默认是有写权限的吧。

<img width="832" alt="image" src="https://github.com/nanhualyq/nanhualyq.github.io/assets/6212850/f2395bd7-6929-44b2-ad2d-412717446db3">

## 结语
这些就是折磨了我个把星期，最后终于克服的麻烦，写出来只是希望能提醒那些走到坑边的朋友注意下。
