const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUser: false,
    order: {
      receiver_agent: undefined,
      sender_agent: undefined
    }
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
      url: `/pages/createAgent/createAgent?agent=${agent}`
    })
  },

  getAgent: function (agentId, agentRole) {
    let recordID = agentId
    let Agent = new wx.BaaS.TableObject('agent')

    Agent.get(recordID).then(res => {
      let dataAgent = `order.${agentRole}`
      this.setData({
        [dataAgent]: res.data
      })
    }, err => {
      console.log(err)
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
  
  onLoad: function (options) {
    if (options.role && options.agent) {
      this.getAgent(options.agent, options.role)
    }
  }
})