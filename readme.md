# Canvas 射击小游戏

## 项目说明
- 概述：Canvas 射击小游戏要求玩家控制飞机发射子弹，消灭会移动的怪兽，如果全部消灭了则游戏成功，如果怪兽移动到底部则游戏失败。
- 目标：实现一个 Cavnas 射击小游戏

## 项目结构
- **index.html**: 游戏页面
- **style.css**: 页面样式
- **js**: 页面涉及的所有 js 代码
  - **app.js**: 页面逻辑入口 js
- **img**: 存放游戏的图片素材
- **视觉稿**: 存放游戏的视觉稿
- **readme.md**: 项目说明文档

## 具体要求

### 1、打通游戏整体流程 （开始->游戏进行中->成功或者失败）
游戏共分为四种状态：`游戏准备`->`游戏进行`->`游戏成功`或者`游戏失败`
#### 1.1、游戏准备
首次打开页面，将会展现游戏准备界面，界面有游戏标题和和游戏描述以及开始游戏按钮。


- 游戏标题：设计游戏
- 游戏描述：这是一个令人欲罢不能的射击游戏，使用 ← 和 → 操作你的飞机，使用空格（space）进行射击。一起来消灭宇宙怪兽吧！


## 游戏配置
- 游戏可通过修改配置，来修改游戏（如下图所示)

  ```js
  /**
  * 游戏相关配置
  * @type {Object}
  */
  var CONFIG = {
    status: 'start', // 游戏开始默认为开始中
    level: 1, // 游戏默认等级
    totalLevel: 6, // 总共6关
    numPerLine: 6, // 游戏默认每行多少个怪兽
    canvasPadding: 30, // 默认画布的间隔
    bulletSize: 10, // 默认子弹长度
    bulletSpeed: 10, // 默认子弹的移动速度
    enemySpeed: 2, // 默认敌人移动距离
    enemySize: 50, // 默认敌人的尺寸
    enemyGap: 10,  // 默认敌人之间的间距
    enemyIcon: './img/enemy.png', // 怪兽的图像
    enemyBoomIcon: './img/boom.png', // 怪兽死亡的图像
    enemyDirection: 'right', // 默认敌人一开始往右移动
    planeSpeed: 5, // 默认飞机每一步移动的距离
    planeSize: {
      width: 60,
      height: 100
    }, // 默认飞机的尺寸,
    planeIcon: './img/plane.png',
  };
  ```