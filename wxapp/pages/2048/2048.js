// pages/2048/2048.js

var touchDotX = 0;//触摸时的原点  
var touchDotY = 0;//触摸时的原点
var touchMoveX = 0;//触摸时的原点  
var touchMoveY = 0;//触摸时的原点
var mBoard = [];
var mState = [];
var mScore = 0;
var mHasConflicted = [];
var mStyle = [];
// var testx = 0
// var testy = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    board: [],
    score: 0,
    style: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  touchStart: function (e) {
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY; // 获取触摸时的原点  
  },

  // 触摸移动事件  
  touchMove: function (e) {
    touchMoveX = e.touches[0].pageX;
    touchMoveY = e.touches[0].pageY;
  },

  // 触摸结束事件  
  touchEnd: function (e) {
    // console.log("touchMoveX:" + touchMoveX + " touchDotX:" + touchDotX + " diff:" + (touchMoveX - touchDotX));
    // console.log("touchMoveY:" + touchMoveY + " touchDotY:" + touchDotY + " diff:" + (touchMoveY - touchDotY));
    if (Math.abs(touchMoveY - touchDotY) > 1.5 * Math.abs(touchMoveX - touchDotX)) {
      if (touchMoveY - touchDotY > 0) {
        //向下滑动
        console.log("down")
        if (this.moveDown()) {
          this.updateMove()
          // this.setData({ style: mStyle })
          // setTimeout(() => {
          this.generateOneNumber()
          this.updateAll(200)
          // this.setData({ board: mBoard, score: mScore, style: mStyle })
          //   this.isgameover()
          // }, 250)
        }
      } else {
        //向上滑动
        console.log("up")
        if (this.moveUp()) {
          this.updateMove()
          // this.setData({ style: mStyle })
          // setTimeout(() => {
          this.generateOneNumber()
          this.updateAll(200)
          // this.setData({ board: mBoard, score: mScore, style: mStyle })
          //   this.isgameover()
          // }, 250)
        }
      }
    }

    if (Math.abs(touchMoveX - touchDotX) > 1.5 * Math.abs(touchMoveY - touchDotY)) {
      if (touchMoveX - touchDotX > 0) {
        //向右滑动
        console.log("right")
        if (this.moveRight()) {
          this.updateMove()
          // this.setData({ style: mStyle })
          // setTimeout(() => {
          this.generateOneNumber()
          this.updateAll(200);
          // this.setData({ board: mBoard, score: mScore, style: mStyle })
          //   this.isgameover()
          // }, 210)
        }
      } else {
        //向左滑动
        console.log("left")
        if (this.moveLeft()) {
          this.updateMove();
          // this.setData({ style: mStyle })
          // setTimeout(() => {
          this.generateOneNumber()
          this.updateAll(200);
          // this.setData({ board: mBoard, score: mScore, style: mStyle })
          //   this.isgameover()
          // }, 210)
        }
      }
    }

    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        mHasConflicted[i][j] = false;

    console.log(this.data)
  },

  init: function () {
    mBoard = [];
    mHasConflicted = [];
    mStyle = [];
    mState = [];
    mScore = 0;
    for (let i = 0; i < 4; i++) {
      mBoard[i] = [];
      mHasConflicted[i] = [];
      mStyle[i] = [];
      mState[i] = [];
      for (let j = 0; j < 4; j++) {
        mBoard[i][j] = 0;
        mHasConflicted[i][j] = false;
        mStyle[i][j] = '';
        mState[i][j] = false;
      }
    }
    this.generateOneNumber()
    this.generateOneNumber()
    mBoard[0][3] = 4096
    mBoard[0][2] = 2048

    // this.setData({ board: mBoard, score: mScore, style: mStyle })    
    this.updateAll(200);
    console.log(this.data)
  },

  // --------------------------------------------------------------------------------------------------------------------
  // 随机选一个格子生成一个数字
  generateOneNumber: function () {

    if (this.nospace())
      return false;

    // 随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));

    // 设置一个时间参数，50次以内系统还未生成一个空位置，那么就进行人工找一个空位置
    var times = 0;
    while (times < 50) {
      if (mBoard[randx][randy] == 0)
        break;

      randx = parseInt(Math.floor(Math.random() * 4));
      randy = parseInt(Math.floor(Math.random() * 4));

      times++;
    }
    if (times == 50) {
      for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
          if (mBoard[i][j] == 0) {
            randx = i;
            randy = j;
          }
        }
    }

    // 随机一个数字
    var randNumber = Math.random() < 0.75 ? 2 : 4;
    // if (testx != 0 || testy != 0) {
    //   randx = testx
    //   randy = testy
    //   testx = 0
    //   testy = 0
    // }
    // 在随机位置显示随机数字
    mBoard[randx][randy] = randNumber;
    // mStyle[randx][randy] = this.getMoveStyle(randx, randy, 0, 0)
    mState[randx][randy] = true;

    return true;
  },

  updateAll: function (delay) {
    setTimeout(() => {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            mStyle[i][j] = this.getStyle(mBoard[i][j]);
        }
      }
      this.setData({ board: mBoard, score: mScore, style: mStyle })

      setTimeout(() => {
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            // if (mState[i][j])
            //   console.log(i + "," + j + "--" + mStyle[i][j])
            mStyle[i][j] = this.getStyle(mBoard[i][j], mState[i][j] ? 'scale_start' : "");
            // mStyle[i][j] = this.getStyle(mBoard[i][j]);
          }
        }
        this.setData({ board: mBoard, score: mScore, style: mStyle })
        setTimeout(() => {
          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
              // if (mState[i][j])
              //   console.log(i + "," + j + "--" + mStyle[i][j])
              mStyle[i][j] = this.getStyle(mBoard[i][j], mState[i][j] ? 'scale_end' : "");
              mState[i][j] = false;
            }
          }
          this.setData({ board: mBoard, score: mScore, style: mStyle })
        }, 80)
      }, 30)
    }, delay)
  },

  updateMove: function () {
    this.setData({ style: mStyle })
  },

  //设置移动动画样式
  getMoveStyle: function (i, j, x, y) {
    let animation = "transition: transform 200ms ease; transform: translate(" + ((y - j) * 175) + "rpx, " + ((x - i) * 175) + "rpx);"
    return this.getStyle(mBoard[i][j]) + animation;
  },

  // --------------------------------------------------------------------------------------------------------------------
  // 设置样式
  getStyle: function (num, animation) {
    let ret = ""
    if (num <= 0)
      return "";

    ret += "background-color:" + this.getNumberBackgroundColor(num) + ";"
    ret += "color:" + this.getNumberColor(num) + ";"
    ret += (num >= 1024 ? "font-size: 60rpx;" :"font-size: 80rpx;")
    if (animation == 'scale_start')
      ret += "transition: transform 80ms ease-out; transform: scale(1.2, 1.2);"
    else if (animation == 'scale_end')
      ret += "transition: transform 80ms ease-in; transform: scale(1, 1);"
    // else if (animation == 'move')
    //   ret += "transition: transform 600ms ease 0ms; transform: scale(1, 1)"
    return ret;
  },

  // --------------------------------------------------------------------------------------------------------------------
  // 设置不同数字的不同背景颜色
  getNumberBackgroundColor: function (num) {
    switch (num) {
      case 2:
        return "#eee4da";
        break;
      case 4:
        return "#ede0c8";
        break;
      case 8:
        return "#f2b179";
        break;
      case 16:
        return "#f59563";
        break;
      case 32:
        return "#f67c5f";
        break;
      case 64:
        return "#f65e3b";
        break;
      case 128:
        return "#edcf72";
        break;
      case 256:
        return "#edcc61";
        break;
      case 512:
        return "#9c0";
        break;
      case 1024:
        return "#33b5e5";
        break;
      case 2048:
        return "#09c";
        break;
      case 4096:
        return "#a6c";
        break;
      case 3192:
        return "#93c";
        break;
      default:
        return ""
        break;
    }
  },

  // --------------------------------------------------------------------------------------------------------------------
  // 设置数字的颜色：2和4的颜色都为#776e65，其它数字的颜色为白色
  getNumberColor: function (num) {
    if (num <= 0)
      return ""
    if (num <= 4)
      return "#776e65";
    else
      return "white";
  },

  // --------------------------------------------------------------------------------------------------------------------
  // 判断当前格子是否有数字 即判断是不是一个“非空（nospace）”的格子
  nospace: function () {
    for (var i = 0; i < 4; i++)
      for (var j = 0; j < 4; j++)
        if (mBoard[i][j] == 0) // 如果没有数字，返回false
          return false;
    // 如果有数字，返回true
    return true;
  },

  // --------------------------------------------------------------------------------------------------------------------
  /* 判断能否向左移动
   * 1、只需要判断每一行的后3列格子即可。
   * 2、可以移动的条件是：
   *   ①当前格子有数字，即 mBoard[i][j] != 0
   *   ②左侧格子没有数字，即 (mBoard[i][j - 1] == 0
   *   ③左侧格子和当前格子数字相同，即 mBoard[i][j - 1] == mBoard[i][j]
   */
  canMoveLeft: function () {
    for (var i = 0; i < 4; i++)
      for (var j = 1; j < 4; j++)
        if (mBoard[i][j] != 0)
          if (mBoard[i][j - 1] == 0 || mBoard[i][j - 1] == mBoard[i][j])
            return true;
    return false;
  },

  // --------------------------------------------------------------------------------------------------------------------
  // 判断能否向上、右、下移动
  canMoveUp: function () {
    for (var j = 0; j < 4; j++)
      for (var i = 1; i < 4; i++)
        if (mBoard[i][j] != 0)
          if (mBoard[i - 1][j] == 0 || mBoard[i - 1][j] == mBoard[i][j])
            return true;
    return false;
  },

  canMoveRight: function () {
    for (var i = 0; i < 4; i++)
      for (var j = 0; j < 3; j++)
        if (mBoard[i][j] != 0)
          if (mBoard[i][j + 1] == 0 || mBoard[i][j + 1] == mBoard[i][j])
            return true;
    return false;
  },

  canMoveDown: function () {
    for (var j = 0; j < 4; j++)
      for (var i = 0; i < 3; i++)
        if (mBoard[i][j] != 0)
          if (mBoard[i + 1][j] == 0 || mBoard[i + 1][j] == mBoard[i][j])
            return true;
    return false;
  },

  // --------------------------------------------------------------------------------------------------------------------
  // 判断水平方向是否可移动，即水平方向的两个目标格子之间没有其他数字 noBlockHorizontal
  noBlockHorizontal: function (row, col1, col2) {
    for (var i = col1 + 1; i < col2; i++)
      if (mBoard[row][i] != 0) // 如果在这两者之间的其它格子有数字，返回false
        return false;
    // 如果两者之间没数字，返回true
    return true;
  },

  // --------------------------------------------------------------------------------------------------------------------
  // 判断垂直方向是否可移动，即垂直方向的两个目标格子之间没有其他数字 noBlockVertical
  noBlockVertical: function (col, row1, row2) {
    for (var i = row1 + 1; i < row2; i++)
      if (mBoard[i][col] != 0) // 如果在这两者之间的其它格子有数字，返回false
        return false;
    // 如果两者之间没数字，返回true
    return true;
  },

  nomove: function () {
    if (this.canMoveLeft() ||
      this.canMoveRight() ||
      this.canMoveUp() ||
      this.canMoveDown())
      return false;

    return true;
  },

  // --------------------------------------------------------------------------------------------------------------------
  // 向左移动
  moveLeft: function () {

    // 1、首先，判断能否向左移动
    if (!this.canMoveLeft())
      return false;

    /*2、如果可以向左移动：
     *   ①当前的数字是否为0，不为0则进行左移 mBoard[i][j] != 0
     *   ②如果左侧为空格子，则数字进行一个移位操作 mBoard[i][k] == 0
     *   ③如果左侧有数字且不相等，则数字还是进行移位操作 noBlockHorizontal
     *   ④如果左侧有数字且相等，则数字进行相加操作 mBoard[i][k] == mBoard[i][j]
     */
    for (var i = 0; i < 4; i++)
      for (var j = 1; j < 4; j++) {
        if (mBoard[i][j] != 0) {
          for (var k = 0; k < j; k++) {
            if (mBoard[i][k] == 0 && this.noBlockHorizontal(i, k, j)) {
              //动画
              mStyle[i][j] = this.getMoveStyle(i, j, i, k);
              //move
              mBoard[i][k] = mBoard[i][j];
              mBoard[i][j] = 0;
              // testx = i
              // testy = j
              // mStyle[i][k] = this.getStyle(mBoard[i][k]);
              // mStyle[i][j] = this.getStyle(mBoard[i][j]);
              // this.showMoveAnimation(i, j, i, k, false);
              console.log("(" + i + "," + j + ") ==> (" + i + "," + k + ")");
              break;
            }
            else if (mBoard[i][k] == mBoard[i][j] && this.noBlockHorizontal(i, k, j) && !mHasConflicted[i][k]) {
              //动画
              mStyle[i][j] = this.getMoveStyle(i, j, i, k);
              //add
              mBoard[i][k] += mBoard[i][j];
              mBoard[i][j] = 0;
              mState[i][k] = true;
              // mStyle[i][k] = this.getStyle(mBoard[i][k]);
              // mStyle[i][j] = this.getStyle(mBoard[i][j]);
              // this.showMoveAnimation(i, j, i, k, true);
              console.log("(" + i + "," + j + ") ==> (" + i + "," + k + ")");

              //add mScore
              mScore += mBoard[i][k];
              // this.updateScore(mScore);

              mHasConflicted[i][k] = true;
              break;
            }
          }
        }
      }
    // 3、初始化数据 updateBoardView()
    // 为显示动画效果，设置该函数的等待时间200毫秒
    // setTimeout("updateBoardView()", 200);
    return true;
  },

  // --------------------------------------------------------------------------------------------------------------------
  // 向上移动
  moveUp: function () {

    if (!this.canMoveUp())
      return false;

    //moveUp
    for (var j = 0; j < 4; j++)
      for (var i = 1; i < 4; i++) {
        if (mBoard[i][j] != 0) {
          for (var k = 0; k < i; k++) {
            if (mBoard[k][j] == 0 && this.noBlockVertical(j, k, i)) {
              //动画
              mStyle[i][j] = this.getMoveStyle(i, j, k, j);
              //move
              mBoard[k][j] = mBoard[i][j];
              mBoard[i][j] = 0;
              // mStyle[k][j] = this.getStyle(mBoard[k][j]);
              // mStyle[i][j] = this.getStyle(mBoard[i][j]);
              // this.showMoveAnimation(i, j, k, j, false);
              console.log("(" + i + "," + j + ") ==> (" + k + "," + j + ")");
              break;
            }
            else if (mBoard[k][j] == mBoard[i][j] && this.noBlockVertical(j, k, i) && !mHasConflicted[k][j]) {
              //动画
              mStyle[i][j] = this.getMoveStyle(i, j, k, j);
              //add
              mBoard[k][j] += mBoard[i][j];
              mBoard[i][j] = 0;
              mState[k][j] = true;
              // mStyle[k][j] = this.getStyle(mBoard[k][j]);
              // mStyle[i][j] = this.getStyle(mBoard[i][j]);
              // this.showMoveAnimation(i, j, k, j, true);
              console.log("(" + i + "," + j + ") ==> (" + k + "," + j + ")");
              //add mScore
              mScore += mBoard[k][j];
              // this.updateScore(mScore);

              mHasConflicted[k][j] = true;
              break;
            }
          }
        }
      }
    // setTimeout("updateBoardView()", 200);
    return true;
  },

  // --------------------------------------------------------------------------------------------------------------------
  // 向右移动
  moveRight: function () {
    if (!this.canMoveRight())
      return false;

    //moveRight
    for (var i = 0; i < 4; i++)
      for (var j = 2; j >= 0; j--) {
        if (mBoard[i][j] != 0) {
          for (var k = 3; k > j; k--) {
            if (mBoard[i][k] == 0 && this.noBlockHorizontal(i, j, k)) {
              //动画
              mStyle[i][j] = this.getMoveStyle(i, j, i, k);
              //move
              mBoard[i][k] = mBoard[i][j];
              mBoard[i][j] = 0;
              // mStyle[i][k] = this.getStyle(mBoard[i][k]);
              // mStyle[i][j] = this.getStyle(mBoard[i][j]);
              // this.showMoveAnimation(i, j, i, k, false);
              console.log("(" + i + "," + j + ") ==> (" + i + "," + k + ")");
              break;
            }
            else if (mBoard[i][k] == mBoard[i][j] && this.noBlockHorizontal(i, j, k) && !mHasConflicted[i][k]) {
              //动画
              mStyle[i][j] = this.getMoveStyle(i, j, i, k);
              //add
              mBoard[i][k] += mBoard[i][j];
              mBoard[i][j] = 0;
              mState[i][k] = true;
              // mStyle[i][k] = this.getStyle(mBoard[i][k]);
              // mStyle[i][j] = this.getStyle(mBoard[i][j]);
              // this.showMoveAnimation(i, j, i, k, true);
              console.log("(" + i + "," + j + ") ==> (" + i + "," + k + ")");
              //add mScore
              mScore += mBoard[i][k];
              // this.updateScore(mScore);

              mHasConflicted[i][k] = true;
              break;
            }
          }
        }
      }
    // setTimeout("updateBoardView()", 200);
    return true;
  },

  // --------------------------------------------------------------------------------------------------------------------
  // 向下移动
  moveDown: function () {
    if (!this.canMoveDown())
      return false;

    //moveDown
    for (var j = 0; j < 4; j++)
      for (var i = 2; i >= 0; i--) {
        if (mBoard[i][j] != 0) {
          for (var k = 3; k > i; k--) {
            if (mBoard[k][j] == 0 && this.noBlockVertical(j, i, k)) {
              //动画
              mStyle[i][j] = this.getMoveStyle(i, j, k, j);
              //move
              mBoard[k][j] = mBoard[i][j];
              mBoard[i][j] = 0;
              // mStyle[k][j] = this.getStyle(mBoard[k][j]);
              // mStyle[i][j] = this.getStyle(mBoard[i][j]);
              // this.showMoveAnimation(i, j, k, j, false);
              console.log("(" + i + "," + j + ") ==> (" + k + "," + j + ")");
              break;
            }
            else if (mBoard[k][j] == mBoard[i][j] && this.noBlockVertical(j, i, k) && !mHasConflicted[k][j]) {
              //动画
              mStyle[i][j] = this.getMoveStyle(i, j, k, j);
              //add
              mBoard[k][j] += mBoard[i][j];
              mBoard[i][j] = 0;
              mState[k][j] = true
              // mStyle[k][j] = this.getStyle(mBoard[k][j]);
              // mStyle[i][j] = this.getStyle(mBoard[i][j]);
              // this.showMoveAnimation(i, j, k, j, true);
              console.log("(" + i + "," + j + ") ==> (" + k + "," + j + ")");
              //add mScore
              mScore += mBoard[k][j];
              // this.updateScore(mScore);

              mHasConflicted[k][j] = true;
              break;
            }
          }
        }
      }
    // setTimeout("updateBoardView()", 200);
    return true;
  },

  // --------------------------------------------------------------------------------------------------------------------
  // 游戏结束
  isgameover: function () {
    if (this.nospace() && this.nomove()) {
      this.gameover();
    }
  },

  gameover: function () {
    wx.showToast({ title: "游戏结束", content: "您的得分为：" + mScore });
  },


})