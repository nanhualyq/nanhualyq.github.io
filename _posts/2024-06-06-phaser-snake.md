---
title: 学习 Phaser 从贪吃蛇开始
---

## 背景

犹记得大约 7 ～ 8 年前，我也曾经看过一点 Html5 游戏框架，当时大概粗浅的尝试过 Phaser、白鹭、Cocos2d-js，可惜只是大概看了看文档，没有动手做出什么东西来，就去忙别的了。

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
    mode: Phaser.Scale.ScaleModes.RESIZE,
  },
});
```

用到两个场景：

- MainScene 游戏主界面
- OverScene 游戏结束

缩放采用 `RESIZE` 模式，就是会自动填充整个网页，但有个问题还不知道怎么解决，宽高不固定就会出现边界上的方块显示不全的可能性。

## 食物

这是最简单的元素，一开始直接画一个方块就可以了，后面想加点创意，就换成了图片，可以随机的替换皮肤，稍微减少一些乏味。

### 构造函数

```js
this.setOrigin(0);
this.setSize(size, size);
this.setDisplaySize(size, size);
```

规范尺寸，固定成一个正方形。

```js
this.tint = 0xffffff;
this.tintFill = true;
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

### resetPosition()

这个函数的作用是重置食物的位置，在游戏开始时和被蛇吃到时都会触发。

```js
const xySet = new Set<string>();
for (let x = 0; x < width / CELL_SIZE; x++) {
    for (let y = 0; y < height / CELL_SIZE; y++) {
        xySet.add(`${x},${y}`);
    }
}
```

生成一个集合，假设画布填满了方块，保存所有方块的坐标，食物重置的新位置就会随机从中取一个。

```js
for (const item of snake.getNodes()) {
  xySet.delete(`${item.x / CELL_SIZE},${item.y / CELL_SIZE}`);
}
```

新的位置要跳过蛇的身体，否则就会出现重叠在一起的情况，所以这里的代码就是遍历蛇的身体，然后从集合中去掉每一个蛇方块的坐标，剩下的就是所有空地了。

```js
const p = Phaser.Utils.Array.GetRandom(Array.from(xySet));
const [x, y] = p.split(",");
this.setPosition(+x * CELL_SIZE, +y * CELL_SIZE);
```

很简单，随机取一个，解析出 x 和 y,应用到食物的位置上。

```js
if (snake.getNodes().length > 1) {
  this.tintFill = Math.random() > 0.1;
}
```

最后这里就是小彩蛋了，食物每次被蛇吃了之后，10%的概率会换皮肤，显示成图片而不是默认的白色方块。

## 蛇

为了方便一起控制每个身体方块，蛇是一个分组，继承的 `Phaser.GameObjects.Group`。

```js
append(x = 0, y = 0) {
    const tail = this.scene.add
        .rectangle(x, y, this.CELL_SIZE, this.CELL_SIZE, 0xffffff)
        .setOrigin(0)
        .setStrokeStyle(1);
    this.add(tail);
}
```

添加一个方块到场景中，同时也将其添加进分组里面，这样就完成了蛇身体长出一个新格子尾巴。

```js
isEatFood(food: Food | undefined) {
    const a = food?.getTopLeft();
    const b = this.getNodes()?.[0]?.getTopLeft();
    if (a?.x === b?.x && a?.y === b?.y) {
        this.appendTail(this.direction);
        food?.resetPosition(this);
    }
}
```

对比食物和蛇头的坐标，如果一样就表示吃到了，然后给蛇加尾巴，让食物重置位置。

### appendTail()

```js
const [prev, last] = this?.getNodes()?.slice(-2);
```

取出蛇身体的最后两个方块，初始时只有一个头，所以 last 是 undefined

```js
if (last) {
  const p1 = prev.getTopLeft();
  const p2 = last.getTopLeft();
  x = p2.x - p1.x + p2.x;
  y = p2.y - p1.y + p2.y;
}
```

能拿到 2 个的话，根据他们之间的差，得到新增方块应该出现的坐标

```js
else if (prev) {
    const p = prev.getTopLeft();
    x = p.x;
    y = p.y;
    switch (direction) {
        case "UP":
            y += this.CELL_SIZE;
            break;
        case "DOWN":
            y -= this.CELL_SIZE;
            break;
        case "LEFT":
            x += this.CELL_SIZE;
            break;
        case "RIGHT":
            x -= this.CELL_SIZE;
            break;

        default:
            break;
    }
}
```

只拿到一个的话，就要根据当前移动方向来决定新格子的坐标了。

```js
updateByFrame(nextDirection: string) {
    count++;
    if (count === 50 - this.getNodes().length - 1) {
        count = 0;
        this.updateDirection(nextDirection);
        this.moveByDirection();
    }
}
```

这是每一帧都会执行的更新函数，if 负责控制速度，初始化是 50 帧移动一格，蛇的身体越长速度就越快。

```js
updateDirection(nextDirection: string) {
    const isDirectionX = ["LEFT", "RIGHT"].includes(this.direction);
    if (nextDirection === "UP" && isDirectionX) {
        this.direction = "UP";
    } else if (nextDirection === "RIGHT" && !isDirectionX) {
        this.direction = "RIGHT";
    } else if (nextDirection === "DOWN" && isDirectionX) {
        this.direction = "DOWN";
    } else if (nextDirection === "LEFT" && !isDirectionX) {
        this.direction = "LEFT";
    }
}
```

这个其实很简单，就是把用户按下的方向存起来，下次移动的时候就会用上。
特别的一点是每个 if 里面的第二个条件，用于确保只在垂直和水平变化时才更新，比如当前正在向右移动，如果按下左方向就会跳过，而按下上或下方向就会生效，这是为了避免原地掉头。

### moveByDirection()

蛇的移动就是这里控制的。

```js
const children = this.getNodes();
for (let i = children.length - 1; i > 0; i--) {
  children[i].x = children[i - 1].x;
  children[i].y = children[i - 1].y;
}
```

遍历蛇的身体，从末尾开始一个一个的移动到前一个的位置，注意 for 的`i>0`，这里跳过了蛇头。

```js
const head = children[0];
switch (this.direction) {
  case "UP":
    head.y -= this.CELL_SIZE;
    break;
  case "DOWN":
    head.y += this.CELL_SIZE;
    break;
  case "LEFT":
    head.x -= this.CELL_SIZE;
    break;
  case "RIGHT":
    head.x += this.CELL_SIZE;
    break;

  default:
    break;
}
```

这才是控制蛇头的移动，稍微特殊一点，根据用户按下的最新方向移动。

### isGameOver()

```js
const isOverflow = x < 0 || y < 0 || x > width || y > height;
```

判断是否超越了画布边界

```js
const isCircle = tails.some((item) => item.x === x && item.y === y);
```

判断是否蛇头和身体重叠了

```js
if (isOverflow || isCircle) {
  this.scene.scene.stop("default").start("over", {
    length: this.getNodes().length,
  });
}
```

满足其中一个条件就跳转到 Game Over 场景，还把蛇长度传过去，用于显示得分。

## 游戏场景
MainScene

```js
this.keys = this.input.keyboard?.createCursorKeys();
if (this.keys?.up.isDown) {
  this.nextDirection = "UP";
} else if (this.keys?.right.isDown) {
  this.nextDirection = "RIGHT";
} else if (this.keys?.down.isDown) {
  this.nextDirection = "DOWN";
} else if (this.keys?.left.isDown) {
  this.nextDirection = "LEFT";
}
```
根据键盘方向键按下后改变方向

```js
this.input.on("pointerup", (p: Phaser.Input.Pointer) => {
  const diffX = p.x - p.downX;
  const diffY = p.y - p.downY;
  const gap = 100;
  if (diffY < -gap) {
    this.nextDirection = "UP";
  } else if (diffX > gap) {
    this.nextDirection = "RIGHT";
  } else if (diffY > gap) {
    this.nextDirection = "DOWN";
  } else if (diffX < -gap) {
    this.nextDirection = "LEFT";
  }
});
```
根据触摸手势滑动方向后改变方向

还有游戏结束的场景很简单就不细说了，无非就是显示文本，点击后重新开始游戏。