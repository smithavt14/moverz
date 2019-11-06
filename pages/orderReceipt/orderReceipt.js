const _agent = require('../../utils/agent.js')
const _time = require('../../utils/time.js')

Page({

  data: {
    order: undefined
  },

  getLocalString(date) {
    new Date(date).toLocaleString('')
  },

  setOrderInfo: function () {
    const self = this
    const eventChannel = this.getOpenerEventChannel()

    eventChannel.on('passOrderInfo', async (data) =>  {
      let order = data.result

      order["sender"] = await _agent.fetch(order.sender.id)
      order["receiver"] = await _agent.fetch(order.receiver.id)
      order["display"] = await _time.getLocalString(new Date(order.pickup_time))

      this.setData({ order })
    })
  },

  navigateBack: function () {
    wx.navigateBack({url: '/pages/index/index'})
  },

  onLoad: function (options) {
    this.setOrderInfo()
  }
})