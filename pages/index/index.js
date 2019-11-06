const _auth = require('../../utils/auth.js')
const _agent = require('../../utils/agent.js')
const _parcel = require('../../utils/parcel.js')
const _order = require('../../utils/order.js')
const _weather = require('../../utils/weather.js')
const _time = require('../../utils/time.js')
const _map = require('../../utils/map.js')

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUser: undefined,
    loginAnimation: false,
    order: {
      status: 'pending'
    },
    parcel: undefined,
    display: {
      minTime: undefined,
      time: undefined,
      date: undefined
    },
    receiver: undefined,
    sender: undefined,
    air: undefined
  },

  /* ----- Time Functions ----- */

  bindDateChange: async function (event) {
    let display = this.data.display
    let type = event.currentTarget.dataset.type
    let value = event.detail.value
    
    display[type] = value

    let pickupTime = new Date(`${display.date} ${display.time}`)
    let result = _time.getLocalString(pickupTime)
    
    this.setData({
      'display.time': result.time,
      'display.date': result.date,
      'order.pickup_time': result.localString
    })
  },

  setPickupTime: function (e) {
    let dateNow = new Date()
    dateNow = new Date(dateNow.setHours(dateNow.getHours() + 1))
    
    let result = _time.getLocalString(dateNow)

    this.setData({
      'display.minTime': result.time,
      'display.time': result.time,
      'display.date': result.date,
      'order.pickup_time': result.localString
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
    let agent = await _agent.fetch(id)
    let agentId = agent.id
    let orderKey = `order.${role}`
    
    this.setData({ 
      [role]: agent,
      [orderKey]: agentId
    })

    let sender = this.data.sender
    let receiver = this.data.receiver

    this.setPrice()
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

  /* ----- Order Functions ----- */

  validateOrder: function() {
    new Promise(async resolve => {
      resolve(await _order.validate(this.data.sender, this.data.receiver, this.data.parcel))
    })
  },

  createOrder: async function () {
    let order = this.data.order
    let valid = await this.validateOrder()

    if (valid) {
      let result = await _order.create(order)
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