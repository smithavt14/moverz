const _auth = require('../../utils/auth.js')

Page({

  data: {},

  getCurrentUser: async function () {
    try {
      let user = wx.getStorageSync('user')
      if (user) {
        this.setData({ user })
      }
    }
    catch (err) {
      let user = await _auth.getCurrentUser()
      this.setData({ hasUser: !!user })
    }
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
  },

  launchPhoneCall: function () {
    wx.makePhoneCall({
      phoneNumber: '18516116224',
    })
  }
  
})