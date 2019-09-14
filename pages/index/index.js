const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUser: false
  },

  // ----- Custom Functions -----

  checkStorage: function () {
    let self = this
    wx.getStorageInfo({
      success(res) {
        if (res.keys.includes('user')) {
          self.setData({
            hasUser: true
          })
        } else {
          self.setData({
            hasUser: false
          })
        }
      }
    })
  },

  userLogout: function () {
    let self = this
    wx.clearStorage()
    self.checkStorage()
  },

  userInfoHandler: function (data) {
    let self = this
    wx.BaaS.auth.loginWithWechat(data).then(user => {
      wx.setStorage({
        key: 'user',
        data: user,
        success: function () {
          self.checkStorage()
        }
      })
    }, err => {
      console.log(err)
    })
  },

  // ----- Lifecycle Functions -----
  
  onLoad: function () {
    this.checkStorage()
  }

})