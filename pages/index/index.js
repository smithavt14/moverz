const _auth = require('../../utils/auth.js')
const _agent = require('../../utils/agent.js')
const _parcel = require('../../utils/parcel.js')
const _order = require('../../utils/order.js')

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUser: undefined,
    order: undefined,
    parcel: undefined,
    pickup: {
      min: undefined,
      time: undefined,
      date: undefined
    },
    receiver: undefined,
    sender: undefined,
    today: undefined,
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
        res.eventChannel.emit('sendAgentInformation', {role, id, position})
      }
    })
  },

  createParcel: function () {
    let self = this
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
  },

  navigateToUserAgents: function (e) {
    let role = e.currentTarget.dataset.role
    let self = this
    wx.navigateTo({
      url: '/pages/userAgents/userAgents',
      events: { 
        receiveAgentInformation: function (data) {
          console.log(data)
          let id = data.id
          let role = data.role
          self.getAgentInformation(id, role)
        }
      },
      success: function (res) {
        res.eventChannel.emit('sendAgentInformation', { role })
      }
    })
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
    if (user) this.navigateToCreateAgent(data)
  },

  /* ----- Order Functions ----- */

  createOrder: async function () {
    let order = this.data.order
    if (order && order.sender && order.receiver && order.parcel) {
      let result = await _order.create(order)
      console.log(result)
      wx.showToast({title: 'Order Created!'})
    } else { console.log(order) }
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

  onShow: function (options) {
    this.getCurrentUser()
  },
})