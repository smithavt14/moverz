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
    wx.navigateTo({ url: '/pages/index/index' })
  },

  setOrderInfo: async function (id) {
    await _order.fetch(id).then(async order => {
      await _order.fetchData(order).then(async order => {
        let status = this.setStatusOptions(order)
        await _time.getLocalString(order.pickup_time).then(time => {
          order['display'] = { status, time }
          this.setData({ order })
        })
      })
    })
  },

  setStatusOptions: function (order) {
    switch (order.status) {
      case 0:
        return { title: '等待支付', subtitle: '您的订单等待支付', color: '#FFBC79'}
        break
      case 1: 
        return { title: '订单确认了', subtitle: '您的订单已支付了', color: '#178E46'}
        break
      case 2:
        return { title: '订单在寄送中', subtitle: '您的订单寄送了', color: '#74B3D6'}
        break
      case 3: 
        return { title: '订单已收到了', subtitle: '对方已经收到货了', color: '178E46'}
        break
      case 4: 
        return { title: '订单取消了', subtitle: '您的订单取消了', color: '#E15E5E'}
        break
    }
  },

  onLoad: function (options) {
    console.log(options.id)
    this.setOrderInfo(options.id)  
    this.getUserData()
  }
})