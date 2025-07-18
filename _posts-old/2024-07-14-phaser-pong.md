---
title: 学 Phser 之 Pong
---

## 背景
之前用 Phaser 做的 [贪吃蛇](https://nanhualyq.github.io/2024/06/06/phaser-snake.html) 是第一个尝试，现在做了第二个尝试：乒乓球。

<iframe src="https://nanhualyq.github.io/games/pong" width="640" height="320"></iframe>
(控制左边：W S 控制右边：↑ ↓)

源码：https://github.com/nanhualyq/phaser-demo/tree/main/src/pong

这个相比贪吃蛇就麻烦多了，由于没有用物理引擎，所以要自己解决各种碰撞的计算，代码量高了很多。

## MainScene.ts
主场景就是跑个游戏循环，在里面触发球拍的移动和比分的更新。

## Board.ts
球拍里面也很简单，就是有个控制移动的方法。

## Ball.ts
球里面就啰嗦一些了，除了自己移动，还有碰撞检测，球和上下边界碰撞要反弹，和球拍碰撞也要反弹，超出左右边界就是本回合结束了，计分然后重新发球。

代码也不算多，感兴趣的就看看，此文只是记录这么个事情，最近忙去做其他事情，快把这些代码忘光了，所以随意打个标记放着。