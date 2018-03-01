// 元素
var container = document.getElementById('game');
var score = document.querySelector('.score');
var gameNextLevel = document.querySelector('.game-next-level');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

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
  enemyDirection: 'right', // 默认敌人一开始往右移动
  planeSpeed: 5, // 默认飞机每一步移动的距离
  planeSize: {  // 默认飞机的尺寸
    width: 60,
    height: 100
  }, 
  planeIcon: './img/plane.png',
};

/**
 * 整个游戏对象
 */
var GAME = {
  points: 0,
  /**
   * 初始化函数,这个函数只执行一次
   * @param  {object} opts 
   * @return {[type]}      [description]
   */
  init: function(opts) {
    this.status = CONFIG.status;
    this.bindEvent();
  },
  bindEvent: function() {
    var self = this;
    var playBtn = document.querySelector('.js-play');
    var replayBtn = document.querySelectorAll('.js-replay')[0];
    var restartBtn = document.querySelectorAll('.js-replay')[1];
    var continueBtn = document.querySelector('.js-next');
    // 开始游戏按钮绑定
    playBtn.onclick = function() {
      self.play();
    };
    // 重新开始按钮绑定
    replayBtn.onclick = function() {
      self.play();
    };
    // 继续游戏按钮绑定
    continueBtn.onclick = function() {
      self.play();
    };
    // 重新开始按钮绑定
    restartBtn.onclick = function() {
      self.play();
    };
  },
  /**
   * 更新游戏状态，分别有以下几种状态：
   * start  游戏前
   * playing 游戏中
   * failed 游戏失败
   * success 游戏成功
   * all-success 游戏通过
   * stop 游戏暂停（可选）
   */
  setStatus: function(status) {
    this.status = status;
    container.setAttribute("data-status", status);
  },
  play: function() {
    this.setStatus('playing');
    if (imgLoader.loaded) {
      playGame();
    }
  },
  failed: function() {
    this.setStatus('failed');
    score.innerHTML = '' + this.points;
    this.points = 0;
    CONFIG.level = 1;
  },
  success: function() {
    this.setStatus('success');
  },
  allSuccess: function() {
    this.setStatus('all-success');
    this.points = 0;
    CONFIG.level = 1;
  },
  stop: function() {
    this.setStatus('stop');
  }
};

/**
 * 图片预加载器
 * @type {object}
 */
var imgLoader = {
  loaded: true,
  loadImgs: 0,
  totalImgs: 0,
  load: function(url) {
    this.totalImgs++;
    this.loaded = false;
    var img = new Image();
    img.src = url;
    img.onload = function () {
      imgLoader.loadImgs++;
      if (imgLoader.loadImgs === imgLoader.totalImgs) {
        imgLoader.loaded = true;
      }
    }
    return img;
  }
}

/**
 * 图片对象
 * @type {Object}
 */
var Imgs = {
  plane: imgLoader.load(CONFIG.planeIcon),
  enemy: imgLoader.load(CONFIG.enemyIcon),
  boom: imgLoader.load(CONFIG.enemyBoomIcon)
}

/**
 * 飞机对象
 * @type {object}
 */
var plane = {
  x: 320,   // 飞机的横轴位置
  y: 470,   // 飞机的纵轴位置
  width: CONFIG.planeSize.width,
  height: CONFIG.planeSize.height,
  speed: CONFIG.planeSpeed,
  bullets: [],
  move: function (direction) {
    switch(direction) {
      case 'left':
        if (plane.x >= plane.speed + CONFIG.canvasPadding) {
          plane.x -= plane.speed;
        } else if (plane.x > CONFIG.canvasPadding) {
          plane.x = CONFIG.canvasPadding;
        }
        break;
      case 'right':
        if (plane.x + plane.speed <= 700-CONFIG.canvasPadding-plane.width) {
          plane.x += plane.speed;
        } else if (plane.x < 700-CONFIG.canvasPadding-plane.width) {
          plane.x = 700-CONFIG.canvasPadding-plane.width;
        }
        break;
    }
  },
  shoot: function () {
    var newBullet = new Bullet(this.x + this.width/2, this.y);
    this.bullets.unshift(newBullet);
  },
  draw: function () {
    context.drawImage(Imgs.plane, plane.x, plane.y, plane.width, plane.height);
  }
}

/**
 * 飞机子弹构造函数
 * @constructor
 * @param {number} x - bullet position at x-axis
 * @param {number} y - bullet position at y-axis
 */
function Bullet (x, y) {
  this.x = x;
  this.y = y;
}

Bullet.prototype.height = CONFIG.bulletSize;
Bullet.prototype.width = 1;
Bullet.prototype.speed = CONFIG.bulletSpeed;

Bullet.prototype.move = function () {
  this.y -= this.speed;
}

Bullet.prototype.draw = function () {
  context.beginPath();
  context.moveTo(this.x, this.y);
  context.lineTo(this.x, this.y - this.height);
  context.strokeStyle = '#ffffff';
  context.lineWidth = 1;
  context.stroke();
  context.closePath();
}

/**
 * 怪兽构造函数
 * @constructor
 * @param {number} x - x-axis position
 * @param {number} y - y-axis position
 */
function Monster (x, y) {
  this.x = x;
  this.y = y;
  this.isDied = false;
  this.boomingTime = 0;
}

Monster.prototype.height = CONFIG.enemySize;
Monster.prototype.width = CONFIG.enemySize;
Monster.prototype.speed = CONFIG.enemySpeed;
Monster.prototype.step = 50;
Monster.prototype.moveDirection = CONFIG.enemyDirection;

Monster.prototype.moveVertical = function () {
  this.y += this.step;
}

Monster.prototype.moveHorizontal = function (direction) {
  if (direction === 'right') {
    this.x += this.speed;
  } else if (direction === 'left') {
    this.x -= this.speed;
  } 
}

Monster.prototype.booming = function () {
  if (this.isDied) {
    this.boomingTime++;
  }
}

Monster.prototype.draw = function (isDied, x, y, width, height) {
  if (!isDied) {
    context.drawImage(Imgs.enemy, x, y, width, height);
  } else {
    context.drawImage(Imgs.boom, x, y, width, height);
  } 
}

// 生成怪兽
var monsters = [];
function createMonsters () {
  for (var j=0; j<CONFIG.level; j++) {
    for (var i=0; i<CONFIG.numPerLine; i++) {
      var monster = new Monster(CONFIG.canvasPadding + (50 + CONFIG.enemyGap)*i, -20 + j*50);
      monsters.push(monster);
    }
  }
}

/**
 * 事件绑定
 */
var pressingStatus = {};  // 按键状态对象

// 键盘按键按下触发事件
function keyDownEvent (e) {
  var key = e.keyCode || e.which || e.charCode;
  // console.log(key);
  switch(key) {
    // shoot
    case 32:
      plane.shoot();
    // move left
    case 37: 
      pressingStatus[key] = true;
      break;
    // move right
    case 39:
      pressingStatus[key] = true;
      break;
  }
}

// 键盘按键弹起触发事件
function keyUpEvent (e) {
  var key = e.keyCode || e.which || e.charCode;
  pressingStatus[key] = false;
}

// 依照键盘按键的状态，飞机移动
function moveAction () {
  if (pressingStatus[37]) {
    plane.move('left');
  }
  if (pressingStatus[39]) {
    plane.move('right');
  }
}

/**
 * 动画执行函数
 */
var animateId = null;
function animate() {
  // 清除画布
  context.clearRect(0, 0, canvas.width, canvas.height);
  // 碰撞检测
  collisionDetection(monsters, plane.bullets);
  // 绘制子弹
  if (plane.bullets) {
    for (var i=0, len=plane.bullets.length; i<len; i++) {
      plane.bullets[i].move();
      if (plane.bullets[i].y <= 0) {
        plane.bullets.splice(i, len);
        break;
      }
      plane.bullets[i].draw();
    }
  }
  // 绘制飞机
  plane.draw();
  // 绘制怪物
  if (monsters) {
    var mlen = monsters.length;
    if (monsters.some(function(item){return item.x === 620;})) {
      monsters.forEach(function (item) {
        item.moveVertical();
        item.moveDirection = 'left';
      });
    } else if (monsters.some(function(item){return item.x === 30;})) {
      monsters.forEach(function (item) {
        item.moveVertical();
        item.moveDirection = 'right';
      });
    } else if (monsters[mlen-1].y === 480) {
      GAME.failed();
    }
    for (var j=monsters.length-1; j>=0; j--) {
      monsters[j].booming();
      monsters[j].moveHorizontal(monsters[j].moveDirection);
      monsters[j].draw(monsters[j].isDied, monsters[j].x, monsters[j].y, monsters[j].width, monsters[j].height);
      if (monsters[j].boomingTime === 3) {
        monsters.splice(j, 1);
        GAME.points++;
      }
    }
    // 绘制分数
    context.font = '18px sans-serif';
    context.fillStyle = '#ffffff';
    var text = '分数: ' + GAME.points;
    context.fillText(text, 20, 20);
    // 判定游戏通关
    if (monsters.length === 0) {
      if (CONFIG.level < CONFIG.totalLevel) {
        GAME.success();
      } else {
        GAME.allSuccess();
      }
    }
  }
  // 飞机移动
  moveAction();

  animateId = requestAnimationFrame(animate);
  if (GAME.status === 'failed' || GAME.status === 'success' || GAME.status === 'all-success') {
    stopGame();
    if (GAME.status === 'success') {
      CONFIG.level++;
      gameNextLevel.innerHTML = '下一个Level: ' + CONFIG.level;
    }
  }
}

/**
 * 碰撞检测函数
 * @param {array} monsters - monster array
 * @param {array} bullets - bullet array
 */
function collisionDetection (monsters, bullets) {
  if (monsters.length>0 && bullets.length>0) {
    for (var i=monsters.length-1; i>=0; i--) {
      for (var j=bullets.length-1; j>=0; j--) {
        if (!(bullets[j].x + 1 < monsters[i].x) &&
            !(monsters[i].x + monsters[i].width < bullets[j].x) &&
            !(bullets[j].y + bullets[j].height < monsters[i].y) &&
            !(monsters[i].y + monsters[i].height < bullets[j].y)) {
          monsters[i].isDied = true;
          bullets.splice(j, 1);
        }
      }
    }
  }
}

/**
 * 动画控制相关的函数
 */
function playGame () {
  document.addEventListener('keydown', keyDownEvent);
  document.addEventListener('keyup', keyUpEvent);
  resetGame();
  animate();
}

function stopGame () {
  context.clearRect(0, 0, canvas.width, canvas.height);
  window.cancelAnimationFrame(animateId);
  document.removeEventListener('keydown', keyDownEvent);
  document.removeEventListener('keyup', keyUpEvent);
}

function resetGame () {
  monsters = [];
  plane.bullets = [];
  createMonsters();
  plane.x = 320;
  plane.y = 470;
  pressingStatus[37] = false;
  pressingStatus[39] = false;
}


// 初始化
GAME.init();