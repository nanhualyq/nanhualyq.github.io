---
title: 学习 Phaser 从贪吃蛇开始
---

## 背景
犹记得大约7～8年前，我也曾经看过一点Html5游戏框架，当时大概粗浅的尝试过 Phaser、白鹭、Cocos2d-js，可惜只是大概看了看文档，没有动手做出什么东西来，就去忙别的了。

但这个事情一直是我的个人兴趣，所以哪怕过了这些年，还是想捡起来玩一玩，一方面是想解积压多年的渴，另一方面是希望通过一扇新窗口换个新角度学一点舒适区以外的技术。

所以这一次打算好好学一学 Phaser,就从尝试着做一个最简单的贪吃蛇开始。

## 体验
<iframe src="https://nanhualyq.github.io/games/snake" width="640" height="480"></iframe>

（看不见可以点击 
[这里](https://nanhualyq.github.io/games/snake)
）

源码：https://github.com/nanhualyq/phaser-demo/tree/main/src/snake

## 基础
```js
new Game({
  scene: [MainScene, OverScene],
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE
  }
});
```

用到两个场景：
- MainScene 游戏主界面
- OverScene 游戏结束

缩放采用 `RESIZE` 模式，就是会自动填充整个网页，但有个问题还不知道怎么解决，宽高不固定就会出现边界上的方块显示不全的可能性。

## 食物
这是最简单的元素，一开始直接画一个方块就可以了，后面想加点创意，就换成了图片，可以随机的替换皮肤，稍微减少一些乏味。

在构造函数里面：

```js
this.setOrigin(0);
this.setSize(size, size);
this.setDisplaySize(size, size);
```
规范尺寸，固定成一个正方形。

```js
this.tint = 0xffffff;
this.tintFill = true
```
叠加特效，用纯白色覆盖图片，也就是默认的皮肤。

```js
scene.add.tween({
    targets: this,
    props: {
        alpha: 0.1,
    },
    duration: 1000,
    repeat: -1,
});
```
食物添加动画，无限循环的修改透明度，就能”一闪一闪亮晶晶“了。