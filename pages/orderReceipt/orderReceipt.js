const _agent = require('../../utils/agent.js')
const _time = require('../../utils/time.js')
const _order = require('../../utils/order.js')
const _auth = require('../../utils/auth.js')

Page({

  data: {
    order: undefined,
    user: undefined
  },

  getUserData: async function () {
    await _auth.getCurrentUser().then(user => {
      this.setData({ user })
    })
  },

  navigateToHome: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },

  setOrderInfo: async function (id) {
    wx.showLoading()
    await _order.fetch(id).then(async order => {
      await _order.fetchData(order).then(async order => {
        
        let status = await _order.setOrderStatusOptions(order)
        let time = await _time.getLocalString(order.pickup_time)

        Promise.all([status, time]).then(values => {
          status = values[0]
          time = values[1]
          order.display = {status, time}

          this.setData({ order })
          wx.hideLoading()
        })
      })
    })
  },

  submitPayment: async function () {
    let order = this.data.order
    await _order.pay(order).then(transaction_no => {
      if (transaction_no) {
        order['transaction_no'] = transaction_no
        order.status = 1
        this.updateOrder(order)
      }
    })
  },

  editOrder: function () {
    wx.navigateTo({
      url: '/pages/index/index',
      success: res => {
        let order = this.data.order
        res.eventChannel.emit('sendOrderInformation', { order })
      }
    })
  },

  updateOrder: async function (order) {
    await _order.update(order).then(order => {
      this.setOrderInfo(order.id)
    })
  },

  onLoad: function (options) {
    this.setOrderInfo(options.id)  
    this.getUserData()
  }
})