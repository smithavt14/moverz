const _auth = require('../../utils/auth.js')

Page({

  data: {

  },

  getCurrentUser: async function () {
    await _auth.getCurrentUser().then(user => {
      if (user) {
        this.setData({ hasUser: !!user, user })
      } else {
        this.setData({ hasUser: !!user })
      }
    })
  },

  navigateToIndex: function () {
    wx.navigateBack({
      url: '/pages/index/index'
    })
  },
  
  onLoad: function (options) {
    this.getCurrentUser()
  },

  onShareAppMessage: function (res) {
    return {
      title: '电达速运',
      path: '/pages/intro/intro'
    }
  }
})