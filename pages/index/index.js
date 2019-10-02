const auth = require('../../utils/auth.js')

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUser: undefined,
    parcel: undefined,
    pickup: {
      min: undefined,
      time: undefined,
      date: undefined
    },
    receiver_agent: undefined,
    sender_agent: undefined,
    today: undefined,
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

  createAgent: function (e) {
    let self = this
    let role = e.currentTarget.dataset.role
    
    wx.navigateTo({
      url: `/pages/createAgent/createAgent`,
      events: {
        receiveAgentInformation: function (data) {
          let id = data.id
          let role = data.role
          self.getAgentInformation(id, role)
        }
      }, 
      success: function (res) {
        let key = `${role}_agent`
        let agent = self.data[key]
        res.eventChannel.emit('sendAgentInformation', {role, agent})
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
          self.setData({ parcel })
        }
      }
    })
  },

  getAgentInformation: function (id, role) {
    let Agent = new wx.BaaS.TableObject('agent')
    
    Agent.get(id).then(res => {
      let key = `${role}_agent`
      this.setData({ [key]: res.data })
    }, err => {
      console.log(err)
    })
  },

  getCurrentUser: async function () {
    let user = await auth.getCurrentUser()
    this.setData({ hasUser: !!user })
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

  // ----- Lifecycle Functions -----
  
  onLoad: function (options) {
    this.setPickupTime()
    this.getCurrentUser()
  }
})