const _auth = require('../../utils/auth.js')
const _agent = require('../../utils/agent.js')
const _parcel = require('../../utils/parcel.js')
const _order = require('../../utils/order.js')
const _weather = require('../../utils/weather.js')

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUser: undefined,
    loginAnimation: false,
    order: {
      status: 'pending'
    },
    parcel: undefined,
    pickup: {
      min: undefined,
      time: undefined,
      date: undefined
    },
    receiver: undefined,
    sender: undefined,
    today: undefined,
    air: undefined
  },

  /* ----- Time Functions ----- */

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
      today: `${year}-${month}-${day}`, 
      'order.pickup_time': `${hours + 1}:${minutes}`,
      'order.pickup_date': `${year}-${month}-${day}`
    })
  },

  /* ----- Navigation Functions ----- */

  navigateToCreateAgent: function (e) {
    let self = this
    let position = 'index'
    let role = e.currentTarget.dataset.role
    let agent = this.data[role]

    let id = agent ? agent.id : undefined

    if (this.data.hasUser) {
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
          res.eventChannel.emit('sendAgentInformation', { role, id, position })
        }
      })
    } else { this.loginNotice() }
  },

  createParcel: function () {
    let self = this

    if (this.data.hasUser) {
      wx.navigateTo({
        url: '/pages/createParcel/createParcel',
        events: {
          getParcelInformation: function (data) {
            let parcel = data.parcel
            self.getParcelInformation(parcel.id)
          }
        },
        success: function (res) {
          let parcel = self.data.parcel
          res.eventChannel.emit('sendParcelInformation', { parcel })
        }
      })
    } else { this.loginNotice() }
  },

  loginNotice: function () {
    self = this
    
    wx.showToast({
      title: '请登录', 
      icon: 'none',
      duration: 1500,
      success: function () {
        self.setData({ loginAnimation: true })
        setTimeout(function () { 
          self.setData({ loginAnimation: false }) 
          }, 1500)
      }
    })
  },

  navigateToUserAgents: function (e) {
    let role = e.currentTarget.dataset.role
    let self = this

    if (this.data.hasUser) {
      wx.navigateTo({
        url: '/pages/userAgents/userAgents',
        events: {
          receiveAgentInformation: function (data) {
            let id = data.id
            let role = data.role
            self.getAgentInformation(id, role)
          }
        },
        success: function (res) {
          res.eventChannel.emit('sendAgentInformation', { role })
        }
      })
    } else {
      this.loginNotice()
    }
  },

  /* ----- Fetch Data Functions ----- */

  getAgentInformation: async function (id, role) {
    let self = this
    let agent = await _agent.fetch(id)
    let agentId = agent.id
    let orderKey = `order.${role}`
    
    this.setData({ 
      [role]: agent,
      [orderKey]: agentId
    })

    self.setPrice()
  },

  getParcelInformation: async function (id) {
    let parcel = await _parcel.fetch(id)
    let parcelId = parcel.id
    
    this.setData({ 
      parcel,
      'order.parcel': parcelId
    })

    this.setPrice()
  },

  getWeather: async function () {
    let aqi = await _weather.fetchAQI()
    let weather = await _weather.fetchWeather()
    this.setData({
      ['air.location']: aqi.location,
      ['air.quality']: aqi.air,
      ['air.weather']: weather
    })
  },

  /* ----- Auth Functions ----- */

  getCurrentUser: async function () {
    let user = await _auth.getCurrentUser()
    this.setData({ hasUser: !!user })
  },

  logout: function () {
    _auth.logout()
    this.setData({hasUser: false})
  },

  userInfoHandler: async function (data) {
    let user = await _auth.login(data)
    this.setData({ hasUser: !!user })
  },

  /* ----- Order Functions ----- */

  testNavigateToOrder: function () {
    wx.navigateTo({
      url: '/pages/orderReceipt/orderReceipt',
      success: function (res) {
        // ------------  [TEST DATA] -------------------
        let result = {
          created_at: 1572945298,
          created_by: 109134564360312,
          id: "5dc13d920546e07cc92ed75d",
          pickup_date: "2019-11-5",
          pickup_time: "2:13",
          price: 10844,
          read_perm: ["user:*"],
          receiver: { id: "5dc13d6c0546e076352ed5a7" },
          sender: { id: "5dc13d4e74d7b471cde9eb25" },
          status: "pending",
          updated_at: 1572945298,
          write_perm: ["user:*"],
          _id: "5dc13d920546e07cc92ed75d"
        }
        // --------------------------------
        res.eventChannel.emit('passOrderInfo', { result })
      }
    })
  },

  createOrder: async function () {
    let order = this.data.order
    if (order && order.sender && order.receiver && order.parcel) {
      let result = await _order.create(order)
      console.log(result, '<-- This is the result')
      wx.navigateTo({
        url: '/pages/orderReceipt/orderReceipt',
        success: function(res) {
          res.eventChannel.emit('passOrderInfo', { result })
        }
      })
    }
  },

  setPrice: async function () {
    let order = this.data.order
    
    if (order && order.sender && order.receiver && order.parcel) {
      let price = await _order.setPrice(order)
      this.setData({ 'order.price': price })
    }
  },

  // ----- Lifecycle Functions -----
  
  onLoad: function (options) {
    this.setPickupTime()
  },

  onShow: async function (options) {
    let user = this.getCurrentUser()
    this.getWeather()
  },

  onReady: function () {}
})