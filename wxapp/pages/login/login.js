const app = getApp()
Page({
  data: {
    theme: 'light',
  },
  
  onShareAppMessage() {
    return {
      title: '微信登录',
      path: 'pages/login/login'
    }
  },

  onLoad() {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({
        theme
      }) => {
        this.setData({
          theme
        })
      })
    }
    this.setData({
      hasLogin: false
    })
  },

  loginPromise: function () {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          if (res.code)
            resolve(res)
          else
            reject("res.code is null")
        },
        fail: err => reject(err)
      });
    });
  },

  requestPromise: function (options) {
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        success: res => {
          if (res.data.status === 'success')
            resolve(res)
          else
            reject("status:" + res.data.status)
        },
        fail: err => reject(err)
      });
    });
  },

  login: async function () {
    try {
      const res = await this.loginPromise();
      const response = await this.requestPromise({
        url: 'http://127.0.0.1:5000/login',
        method: 'POST',
        data: {
          code: res.code
        }
      });
      wx.showToast({
        title: "登录成功:" + response,
        icon: 'none',
        duration: 2000
      });
    } catch (error) {
      console.log(error)
      wx.showToast({
        title: "登录失败:" + error.errMsg,
        icon: 'none',
        duration: 2000
      });
    }
  },
})