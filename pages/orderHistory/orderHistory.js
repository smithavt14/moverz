const _order = require('../../utils/order.js')
const _auth = require('../../utils/auth.js')
const _time = require('../../utils/time.js')

Page({

  data: {

  },


  /* ----- Auth Functions ----- */

  getCurrentUser: async function () {
    try {
      let user = wx.getStorageSync('user')
      if (user) {
        this.setData({ user })
        this.fetchUserOrders(user.id)
      }
    }
    catch (err) {
      await _auth.getCurrentUser().then(user => {
        this.setData({ user })
        this.fetchUserOrders(user.id)
      })
    }
  },

  /* ----- Order Functions ----- */

  fetchUserOrders: async function(id) {
    await _order.fetchUserOrders(id).then(orders => {
      this.fetchOrderData(orders)
    })
  },

  fetchOrderData: function(orders) {
    orders.forEach(async (order, index) => {
      await _order.fetchData(order).then(async order => {
        let status = await _order.setOrderStatusOptions(order)
        let time = await _time.getLocalString(order.pickup_time)

        Promise.all([status, time]).then(values => {
          status = values[0]
          time = values[1]
          let id = order.id.toString().substr(20, 4)
          order.display = { status, time, id }
          let key = `orders[${index}]`
          this.setData({ [key]: order })
        })
      })
    })
  },

  /* ----- Navigation Functions ----- */

  navigateToOrder: function (event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/orderReceipt/orderReceipt?id=${id}`
    })
  },

  /* ----- Lifecycle Functions ----- */

  onShow: function (options) {
    this.getCurrentUser()
  }
})