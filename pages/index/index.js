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
    order: undefined,
    parcel: undefined,
    display: {
      minTime: undefined,
      hour: undefined,
      date: undefined
    },
    receiver: undefined,
    sender: undefined,
    air: undefined
  },

  /* ----- Time Functions ----- */

  bindDateChange: async function (event) {
    let type = event.currentTarget.dataset.type
    let display = this.data.display
    let value = event.detail.value
    let y, m, d
    
    if (type === 'date') {
      value = value.split("-")
      y = value[0]
      m = value[1]
      d = value[2]
      let pickupTime = new Date(`${y}/${m}/${d} ${display.hour}`)
      await _time.getLocalString(pickupTime).then(res => {
        console.log(res)
        this.setData({
          'display.hour': res.hour,
          'display.date': res.date,
          'order.pickup_time': res.stringISOS
        })
      })
      
    } else {
      display[type] = value
      let pickupTime = new Date(`${display.date} ${display.hour}`)
      await _time.getLocalString(pickupTime).then(res => {
        console.log(res)
        this.setData({
          'display.hour': res.hour,
          'display.date': res.date,
          'order.pickup_time': res.stringISOS
        })
      })
      
    }
  },

  setPickupTime: async function () {
    let order = this.data.order

    let date = order.pickup_time ? order.pickup_time : new Date(new Date().setHours(dateNow.getHours() + 1))
    
    await _time.getLocalString(date).then(res => {
      this.setData({
        'display.hour': res.hour,
        'display.date': res.date,
        'order.pickup_time': res.stringISOS
      })
    })
  },

  /* ----- Navigation Functions ----- */

  navigateToIntro: function () {
    wx.navigateTo({
      url: '/pages/intro/intro'
    })
  },

  navigateToCreateAgent: function (e) {
    let self = this

    let position = 'index'
    let role = e.currentTarget.dataset.role
    let agent = this.data.order[role]

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
        success: res => {
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
          let parcel = self.data.order.parcel
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

  navigateToOrderHistory: function() {
    wx.navigateTo({
      url: '/pages/orderHistory/orderHistory'
    })
  },

  /* ----- Fetch Data Functions ----- */

  getAgentInformation: async function (id, role) {
    let orderKey = `order.${role}`
    await _agent.fetch(id).then(agent => {
      this.setData({
        [orderKey]: agent
      })
      this.setOrderData()
    })
  },

  getParcelInformation: async function (id) {
    await _parcel.fetch(id).then(parcel => {
      this.setData({
        'order.parcel': parcel
      })
      this.setOrderData()
    })
    
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
    await _auth.getCurrentUser().then(user => {
      if (user) {
        this.setData({ hasUser: !!user, user })
        this.getWeather()
      } else {
        this.setData({ hasUser: !!user })
      }
    })
  },

  logout: function () {
    _auth.logout()
    this.setData({hasUser: false, user: undefined})
  },

  userInfoHandler: async function (data) {
    this.setData({btnLoading: true})
    await _auth.login(data).then(async user => {
      this.setData({ hasUser: true, user, btnLoading: false })
      this.getWeather()
    })
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

  processOrder: async function () {
    let order = this.data.order
    let valid = await _order.validate(order)
    
    if (valid && order.id) {
      await _order.update(order).then(order => {
        console.log('update order: ', order)
        wx.redirectTo({
          url: `/pages/orderReceipt/orderReceipt?id=${order.id}`,
        })
      })
    } else if (valid) {
      await _order.create(order).then(order => {
        console.log('created order: ', order)
        wx.redirectTo({
          url: `/pages/orderReceipt/orderReceipt?id=${order.id}`,
        })
      }) 
    }
  },

  setOrderData: async function () {
    let order = this.data.order

    if (order && order.sender && order.receiver && order.parcel) {
      await _order.setDistance(order).then(async distance => {
        order.distance = distance
        let price = _order.setPrice(order)
        let emissions = _order.setEmissions(order)

        Promise.all([price, emissions]).then(values => {
          order.price = values[0]
          order.emissions_saved = values[1]
          this.setData({ order })
        })
      })
    }
  },

  checkOrderInfo: function() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('sendOrderInformation', (data) => {
      let order = data.order
      this.setData({ order })
    })
  },

  // ----- Lifecycle Functions -----
  
  onLoad: function () {
    this.checkOrderInfo()
    this.setPickupTime()
    let order = this.data.order

    if (order.pickup_time) {

    }
  },

  onShow: async function () {
    this.getCurrentUser()
  },

  onReady: function () {}
})