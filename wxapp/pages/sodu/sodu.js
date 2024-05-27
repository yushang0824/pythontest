
// pages/sodu/sodu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grid: [],
    text: [],
    selrow: 0,
    selcol: 0,
    edit: false,
    hisory: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init2([
      "004001076",
      "000009100",
      "000800005",
      "030000001",
      "740200000",
      "190003400",
      "000000300",
      "000304020",
      "008060000"])
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

  onGridClick: function (e) {
    console.log(e)
    let id = e.currentTarget.id
    this.setData({ selrow: Math.floor(id / 10), selcol: id % 10 })
  },

  onNumClick: function (e) {
    let id = e.currentTarget.id
    let grid = this.data.grid
    let { selrow, selcol } = this.data

    if (this.data.edit) {
      grid[selrow][selcol].fill = id > 0
      grid[selrow][selcol].err = false
      grid[selrow][selcol].v = parseInt(id)
      grid[selrow][selcol].bak = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    } else {
      if (grid[selrow][selcol].fill == false) {
        if (grid[selrow][selcol].v > 0) {
          if (id > 0) {
            if (id != grid[selrow][selcol].v) {
              grid[selrow][selcol].bak[parseInt(id) - 1] = 1;
              grid[selrow][selcol].bak[grid[selrow][selcol].v - 1] = 1;
              grid[selrow][selcol].v = 0
            }
          } else {
            grid[selrow][selcol].v = 0
            grid[selrow][selcol].bak = [1, 1, 1, 1, 1, 1, 1, 1, 1]
          }
        } else {
          if (id > 0) {
            if (grid[selrow][selcol].bak[id - 1] == 0)
              grid[selrow][selcol].bak[id - 1] = 1
            else
              grid[selrow][selcol].bak[id - 1] = 0

            //可选值个数为1
            let bakc = 0;
            let n = 0;
            for (let b = 0; b < 9; b++) {
              bakc += grid[selrow][selcol].bak[b]
              if (grid[selrow][selcol].bak[b] == 1)
                n = b + 1;
            }
            if (bakc == 1) {
              grid[selrow][selcol].v = n;
              grid[selrow][selcol].bak = [0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
          }
        }
      }
    }

    let text = this.getText(grid)
    this.setData({ grid: grid, text: text })
  },

  onSolvingClick: function () {
    if (this.data.edit) {
      return;
    }
    let history = this.cloneObj(this.data.grid);
    let grid = this.data.grid;

    let changed = false;
    let run = true
    while (run) {
      this.check(grid)
      this.checkRow(grid);
      this.checkCol(grid);
      this.checkBox(grid);

      run = this.do1(grid)
      if (!run)
        run = this.do2(grid)
      if (!run)
        run = this.do3(grid)
      if (run)
        changed = true
    }

    let text = this.getText(grid)
    this.setData({ grid: grid, text: text })
    if (changed)
      this.data.hisory.push(history)
  },

  onBackClick: function () {
    if (this.data.hisory.length > 0) {
      let grid = this.data.hisory.pop()
      let text = this.getText(grid)
      this.setData({ grid: grid, text: text })
    }
  },

  onCleanClick: function () {
    let grid = []
    if (this.data.edit) {
      for (let r = 0; r < 9; r++) {
        grid[r] = []
        for (let c = 0; c < 9; c++) {
          grid[r][c] = {
            fill: false,
            err: false,
            v: 0,
            bak: [0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        }
      }
    } else {
      grid = this.data.grid;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (grid[r][c].fill) {
            grid[r][c].err = false
            grid[r][c].bak = [0, 0, 0, 0, 0, 0, 0, 0, 0]
          } else {
            grid[r][c].err = false
            grid[r][c].v = 0;
            grid[r][c].bak = [1, 1, 1, 1, 1, 1, 1, 1, 1]
          }
        }
      }
    }

    let text = this.getText(grid)
    this.setData({ grid: grid, text: text })
    this.data.hisory = []
  },

  onEditClick: function () {
    if (this.data.edit) {
      this.setData({ edit: false })
      this.onCleanClick()
      this.data.hisory = []
    } else {
      this.setData({ edit: true })
    }
  },

  cloneObj: function (data) {
    return JSON.parse(JSON.stringify(data))
  },

  init2: function (data) {
    let grid = []
    for (let i = 0; i < data.length; i++) {
      grid[i] = [];
      for (let j = 0; j < 9; j++) {
        grid[i][j] = {
          fill: data[i].charAt(j) != '0',
          err: false,
          v: data[i].charAt(j) - '0',
          bak: []
        }
        for (let k = 0; k < 9; k++) {
          grid[i][j].bak[k] = grid[i][j].fill ? 0 : 1;
        }
      }
    }

    let text = this.getText(grid)
    this.setData({ grid: grid, text: text })
    this.data.hisory = []
  },

  getText: function (grid) {
    //计算候选数字
    let text = []
    for (let r = 0; r < 9; r++) {
      text[r] = []
      for (let c = 0; c < 9; c++) {
        text[r][c] = ''
        for (let k = 0; k < 9; k++) {
          text[r][c] += (grid[r][c].bak[k] == 0 ? ' ' : (k + 1))
          if (k == 2 || k == 5)
            text[r][c] += '\n'
        }
      }
    }
    return text
  },

  init: function () {
    let grid = []
    for (let i = 0; i < 9; i++) {
      grid[i] = [];
      for (let j = 0; j < 9; j++) {
        grid[i][j] = { fill: false, err: false, v: 0, bak: [] }
        for (let k = 0; k < 9; k++) {
          grid[i][j].bak[k] = 0;
        }
      }
    }
    let text = this.getText(grid)
    this.setData({ grid: grid, text: text })
  },

  check: function (grid) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c].fill)
          continue;
        grid[r][c].err = false
        if (grid[r][c].v == 0) {
          grid[r][c].err = true
          for (let i = 0; i < 9; i++) {
            if (grid[r][c].bak[i] == 1)
              grid[r][c].err = false
          }
        }
      }
    }
  },

  checkRow: function (grid) {
    for (let r = 0; r < 9; r++) {
      // 清空
      let count = [0, 0, 0, 0, 0, 0, 0, 0, 0]

      // 统计个数
      for (let i = 0; i < 9; i++) {
        if (grid[r][i].v > 0) {
          count[grid[r][i].v - 1]++;
        }
      }

      for (let i = 0; i < 9; i++) {
        if (grid[r][i].fill)
          continue;
        // 标记出错
        if (grid[r][i].v > 0 && count[grid[r][i].v - 1] > 1) {
          grid[r][i].err = true;
        }

        // 设置bak
        if (grid[r][i].v == 0) {
          for (let k = 0; k < 9; k++) {
            if (count[k] > 0) {
              grid[r][i].bak[k] = 0;
            }
          }
        }
      }
    }
  },

  checkCol: function (grid) {
    for (let c = 0; c < 9; c++) {
      // 清空
      let count = [0, 0, 0, 0, 0, 0, 0, 0, 0]

      // 统计个数
      for (let i = 0; i < 9; i++) {
        if (grid[i][c].v > 0) {
          count[grid[i][c].v - 1]++;
        }
      }

      for (let i = 0; i < 9; i++) {
        if (grid[i][c].fill)
          continue;
        // 标记出错
        if (grid[i][c].v > 0 && count[grid[i][c].v - 1] > 1) {
          grid[i][c].err = true;
        }

        // 设置bak
        if (grid[i][c].v == 0) {
          for (let k = 0; k < 9; k++) {
            if (count[k] > 0) {
              grid[i][c].bak[k] = 0;
            }
          }
        }
      }
    }
  },

  checkBox: function (grid) {
    for (let r = 0; r < 9; r = r + 3) {
      for (let c = 0; c < 9; c = c + 3) {

        //清空
        let count = [0, 0, 0, 0, 0, 0, 0, 0, 0]

        // 统计个数
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            let rr = r + i;
            let cc = c + j;
            if (grid[rr][cc].v > 0) {
              count[grid[rr][cc].v - 1]++;
            }
          }
        }

        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            let rr = r + i;
            let cc = c + j;

            if (grid[rr][cc].fill || grid[rr][cc].v != 0)
              continue;

            // 标记出错
            if (grid[rr][cc].v > 0 && count[grid[rr][cc].v - 1] > 1) {
              grid[rr][cc].err = true;
            }

            // 设置bak
            if (grid[rr][cc].v == 0) {
              for (let k = 0; k < 9; k++) {
                if (count[k] > 0) {
                  grid[rr][cc].bak[k] = 0;
                }
              }
            }
          }
        }
      }
    }
  },

  do1: function (grid) {
    let ret = false;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        let count = 0;
        let index = -1;
        for (let i = 0; i < 9; i++) {
          count += grid[r][c].bak[i];
          if (grid[r][c].bak[i] == 1)
            index = i;
        }
        if (count == 1) {
          grid[r][c].v = (index + 1);
          grid[r][c].bak[index] = 0;
          ret = true;
          //System.out.println("r=" + r + " c=" + c);
        }
      }
    }
    return ret;
  },

  do2: function (grid) {
    let ret = false;
    //行统计
    for (let r = 0; r < 9; r++) {
      // 清空
      let count = [0, 0, 0, 0, 0, 0, 0, 0, 0]

      // 统计个数
      for (let c = 0; c < 9; c++) {
        for (let i = 0; i < 9; i++) {
          if (grid[r][c].bak[i] == 1) {
            count[i]++;
          }
        }
      }

      for (let i = 0; i < 9; i++) {
        if (count[i] == 1) {
          //找到对应的方格
          for (let c = 0; c < 9; c++) {
            if (grid[r][c].bak[i] == 1) {
              grid[r][c].v = i + 1;
              for (let j = 0; j < 9; j++) {
                grid[r][c].bak[j] = 0;
              }
              ret = true;
            }
          }
        }
      }
    }

    if (ret)
      return ret;

    //列统计
    for (let c = 0; c < 9; c++) {
      // 清空
      let count = [0, 0, 0, 0, 0, 0, 0, 0, 0]

      // 统计个数
      for (let r = 0; r < 9; r++) {
        for (let i = 0; i < 9; i++) {
          if (grid[r][c].bak[i] == 1) {
            count[i]++;
          }
        }
      }

      for (let i = 0; i < 9; i++) {
        if (count[i] == 1) {
          //找到对应的方格
          for (let r = 0; r < 9; r++) {
            if (grid[r][c].bak[i] == 1) {
              grid[r][c].v = i + 1;
              for (let j = 0; j < 9; j++) {
                grid[r][c].bak[j] = 0;
              }
              ret = true;
            }
          }
        }
      }
    }

    if (ret)
      return ret;

    //九宫统计
    for (let r = 0; r < 9; r = r + 3) {
      for (let c = 0; c < 9; c = c + 3) {
        // 清空
        let count = [0, 0, 0, 0, 0, 0, 0, 0, 0]

        // 统计个数
        for (let r1 = 0; r1 < 3; r1++) {
          for (let c1 = 0; c1 < 3; c1++) {
            for (let i = 0; i < 9; i++) {
              if (grid[r + r1][c + c1].bak[i] == 1) {
                count[i]++;
              }
            }
          }
        }

        for (let i = 0; i < 9; i++) {
          if (count[i] == 1) {
            //找到对应的方格
            for (let r1 = 0; r1 < 3; r1++) {
              for (let c1 = 0; c1 < 3; c1++) {
                if (grid[r + r1][c + c1].bak[i] == 1) {
                  grid[r + r1][c + c1].v = i + 1;
                  for (let j = 0; j < 9; j++) {
                    grid[r + r1][c + c1].bak[j] = 0;
                  }
                  ret = true;
                }
              }
            }
          }
        }
      }
    }

    return ret;
  },

  do3: function (grid) {
    let ret = false;
    //行统计
    for (let r = 0; r < 9; r++) {

      // 找出二数对的组合
      for (let c1 = 0; c1 < 9; c1++) {
        if (grid[r][c1].v != 0)
          continue;
        for (let c2 = 0; c2 < 9; c2++) {
          if (c2 == c1)
            continue;
          if (grid[r][c2].v != 0)
            continue;

          // 清空
          let count = [0, 0, 0, 0, 0, 0, 0, 0, 0]

          //统计个数
          for (let i = 0; i < 9; i++) {
            if (grid[r][c1].bak[i] == 1) {
              count[i] = 1;
            }
            if (grid[r][c2].bak[i] == 1) {
              count[i] = 1;
            }
          }

          //判断是不是找到两数对
          let cc = 0
          let a = 0;
          let b = 0;
          for (let i = 0; i < 9; i++) {
            cc += count[i]
            if (count[i] == 1) {
              if (a == 0)
                a = i
              else
                b = i
            }
          }
          if (cc == 2) {
            for (let c3 = 0; c3 < 9; c3++) {
              if (c3 == c2 || c3 == c1)
                continue;
              if (grid[r][c3].v != 0)
                continue;
              if (grid[r][c3].bak[a] != 0) {
                grid[r][c3].bak[a] = 0;
                ret = true
              }
              if (grid[r][c3].bak[b] != 0) {
                grid[r][c3].bak[b] = 0;
                ret = true
              }
            }
          }
        }
      }
    }

    if (ret)
      return ret;

    //列统计
    for (let c = 0; c < 9; c++) {
      // 清空
      let count = [0, 0, 0, 0, 0, 0, 0, 0, 0]

      // 找出二数对的组合
      for (let r1 = 0; r1 < 9; r1++) {
        if (grid[r1][c].v != 0)
          continue;
        for (let r2 = 0; r2 < 9; r2++) {
          if (r2 == r1)
            continue;
          if (grid[r2][c].v != 0)
            continue;

          // 清空
          let count = [0, 0, 0, 0, 0, 0, 0, 0, 0]

          //统计个数
          for (let i = 0; i < 9; i++) {
            if (grid[r1][c].bak[i] == 1) {
              count[i] = 1;
            }
            if (grid[r2][c].bak[i] == 1) {
              count[i] = 1;
            }
          }

          //判断是不是找到两数对
          let rr = 0
          let a = 0;
          let b = 0;
          for (let i = 0; i < 9; i++) {
            rr += count[i]
            if (count[i] == 1) {
              if (a == 0)
                a = i
              else
                b = i
            }
          }
          if (rr == 2) {
            for (let r3 = 0; r3 < 9; r3++) {
              if (r3 == r2 || r3 == r1)
                continue;
              if (grid[r3][c].v != 0)
                continue;
              if (grid[r3][c].bak[a] != 0) {
                grid[r3][c].bak[a] = 0;
                ret = true
              }
              if (grid[r3][c].bak[b] != 0) {
                grid[r3][c].bak[b] = 0;
                ret = true
              }
            }
          }
        }
      }
    }

    if (ret)
      return ret;

    //九宫统计
    for (let r = 0; r < 9; r = r + 3) {
      for (let c = 0; c < 9; c = c + 3) {

        // 找出二数对的组合
        for (let x = 0; x < 9; x++) {
          let r1 = r + (x - x % 3) / 3
          let c1 = c + x % 3

          if (grid[r1][c1].v != 0)
            continue;
          for (let y = 0; y < 9; y++) {
            let r2 = r + (y - y % 3) / 3
            let c2 = c + y % 3

            if (r2 == r1 && c2 == c1)
              continue;
            if (grid[r2][c2].v != 0)
              continue;

            // 清空
            let count = [0, 0, 0, 0, 0, 0, 0, 0, 0]

            //统计个数
            for (let i = 0; i < 9; i++) {
              if (grid[r1][c1].bak[i] == 1) {
                count[i] = 1;
              }
              if (grid[r2][c2].bak[i] == 1) {
                count[i] = 1;
              }
            }

            //判断是不是找到两数对
            let rr = 0
            let a = 0;
            let b = 0;
            for (let i = 0; i < 9; i++) {
              rr += count[i]
              if (count[i] == 1) {
                if (a == 0)
                  a = i
                else
                  b = i
              }
            }
            if (rr == 2) {
              for (let x = 0; x < 9; x++) {
                let r3 = r + (x - x % 3) / 3
                let c3 = c + x % 3

                if ((r3 == r2 && c3 == c2) || (r3 == r1 && c3 == c1))
                  continue;

                if (grid[r3][c3].v != 0)
                  continue;
                if (grid[r3][c3].bak[a] != 0) {
                  grid[r3][c3].bak[a] = 0;
                  ret = true
                }
                if (grid[r3][c3].bak[b] != 0) {
                  grid[r3][c3].bak[b] = 0;
                  ret = true
                }
              }
            }
          }
        }
      }
    }

    return ret;
  }
})

