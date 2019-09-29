const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUser: false,
    pickupTime: {
      min: undefined,
      max: undefined,
      date: undefined
    },
    order: {
      receiver_agent: undefined,
      sender_agent: undefined,
      pickup_time: undefined,
      pickup_date: undefined,
      parcel: undefined
    },
    parcel: undefined
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

  setPickupTime: function (e) {
    let now = new Date()
    
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let day = now.getDate()
    
    let hours = now.getHours()
    let minutes = now.getMinutes()
    
    this.setData({
      'pickupTime.min': `${hours + 1}:${minutes}`,
      'pickupTime.max': `24:00`,
      'pickupTime.date': `${year}-${month}-${day}`,
      
      'order.pickup_time': `${hours + 1}:${minutes}`,
      'order.pickup_date': `${year}-${month}-${day}`
    })
  },

  bindTimeChange: function (e) {
    let time = e.detail.value
    this.setData({
      'order.pickup_time': time
    })
  },

  bindDateChange: function (e) {
    let date = e.detail.value
    this.setData({
      'order.pickup_date': date
    })
  },

  getParcel: function(id) {
    let Parcel = new wx.BaaS.TableObject('parcel')

    Parcel.get(id).then(res => {
      console.log(res.data)
      this.setData({
        'order.parcel': res.data.id,
        parcel: res.data
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