const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUser: false,
    sender_agent: undefined,
    receiver_agent: undefined,
    order: undefined
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

  createAgent: function (e) {
    let agent = e.currentTarget.dataset.agent
    wx.navigateTo({
      url: `/pages/createAgent/createAgent?agent=${agent}`,
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

// Next Steps:
// 1. Create information collection page link
// 2. 