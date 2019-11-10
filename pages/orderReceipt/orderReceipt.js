const _agent = require('../../utils/agent.js')
const _time = require('../../utils/time.js')
const _order = require('../../utils/order.js')

Page({

  data: {
    order: undefined
  },

  setOrderInfo: async function (id) {
    await _order.fetch(id).then(async order => {
      await _order.fetchData(order).then(async order => {
        await _time.getLocalString(order.pickup_time).then(res => {
          order['display'] = res
          this.setData({ order })
        })        
      })
    })
  },
 
  navigateToHome: function () {
    wx.navigateTo({url: '/pages/index/index'})
  },

  onLoad: function (options) {
    console.log(options, 'orderReceipt options')
    this.setOrderInfo(options.id)
  }
})