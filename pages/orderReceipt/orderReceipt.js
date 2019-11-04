const _agent = require('../../utils/agent.js')

Page({

  data: {
    order: undefined
  },

  setOrderInfo: async function () {
    const self = this
    const eventChannel = this.getOpenerEventChannel()
    let order, date

    eventChannel.on('passOrderInfo', function (data) {
      order = data.result
    })

    order.sender = await _agent.fetch(order.sender.id)
    order.receiver = await _agent.fetch(order.receiver.id)
    date = new Date(order.pickup_time)
    order.pickup_time = `${date.getHours()}:${date.getMinutes()}`
    
    this.setData({ order })
  },

  onLoad: function (options) {
    this.setOrderInfo()
  }
})