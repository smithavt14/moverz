const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUser: false,
    pickup: {
      min: undefined,
      time: undefined,
      date: undefined
    },
    today: undefined,
    receiver_agent: undefined,
    sender_agent: undefined,
    parcel: undefined
  },

  // ----- Custom Functions -----

  bindTimeChange: function (e) {
    let time = e.detail.value
    this.setData({
      'pickup.time': time
    })
  },

  bindDateChange: function (e) {
    let date = e.detail.value
    this.setData({
      'pickup.date': date
    })
  },

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
    let self = this
    let agent = e.currentTarget.dataset.agent
    
    wx.navigateTo({
      url: `/pages/createAgent/createAgent?agent=${agent}`,
      events: {
        getAgentInformation: function (data) {
          console.log(data)
          let agent = data.agent
          let role = data.agent_role
          let key = `${role}_agent`
          self.setData({
            [key]: agent
          })
        }
      }
    })
  },

  createParcel: function () {
    let self = this
    wx.navigateTo({
      url: '/pages/createParcel/createParcel',
      events: {
        getParcelInformation: function (res) {
          let parcel = res.data
          self.setData({parcel})
        }
      }
    })
  },

  setPickupTime: function (e) {
    let now = new Date()

    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let day = now.getDate()

    let hours = now.getHours()
    let minutes = now.getMinutes()

    this.setData({
      'pickup.min': `${hours + 1}:${minutes}`,
      'pickup.time': `${hours + 1}:${minutes}`,
      'pickup.date': `${year}-${month}-${day}`,
      today: `${year}-${month}-${day}`
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
    if (options.parcel) {
      this.getParcel(options.parcel)
    }
    this.setPickupTime()
  }
})