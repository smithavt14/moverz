const _order = require('../../utils/order.js')
const _auth = require('../../utils/auth.js')

Page({

  data: {

  },

  getCurrentUser: async function() {
    await _auth.getCurrentUser().then( user => {
      this.setData({ user })
    })
  },

  onLoad: function (options) {

  }
})