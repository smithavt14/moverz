const _order = require('../../utils/order.js')
const _auth = require('../../utils/auth.js')
const _time = require('../../utils/time.js')

Page({

  data: {

  },

  getCurrentUser: async function() {
    await _auth.getCurrentUser().then( user => {
      let id = user.id
      this.fetchUserOrders(id)
      this.setData({ user })
    })
  },

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
          order.display = { status, time }
          let key = `orders[${index}]`
          this.setData({ [key]: order })
        })
      })
    })
  },

  navigateToOrder: function (event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/orderReceipt/orderReceipt?id=${id}`
    })
  },

  onShow: function (options) {
    this.getCurrentUser()
  }
})