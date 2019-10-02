const _auth = require('../../utils/auth.js')
const _agent = require('../../utils/agent.js')

Page({
  data: {
    agent: undefined,
    role: undefined
  },

  /* ----- Custom Functions ----- */

  confirmAgent: function () {
    let agent = this.data.agent
    agent.id ? this.updateAgent(agent) : this.createAgent(agent)
  },

  createAgent: async function (agent) {
    let res = await _agent.create(agent)
    this.navigateBack(res)
  },

  fetchAgent: async function (id) {
    let agent = await _agent.fetch(id)
    this.setData({ agent })
  },

  updateAgent: async function (agent) {
    let res = await _agent.update(agent)
    this.navigateBack(res.data)
  },

  navigateBack: function (agent) {
    const eventChannel = this.getOpenerEventChannel()

    let role = this.data.role
    let id = agent.id

    eventChannel.emit('receiveAgentInformation', { id, role })
    
    wx.navigateBack({
      url: '/pages/index/index'
    })
  },

  editValue: function(e) {
    let key = `agent.${e.currentTarget.dataset.value}`
    let value = e.detail.value
    
    this.setData({ [key]: value })
  },

  formSubmit: function (e) {
    let self = this
    let data = e.detail.value
    let agent = self.data.agent

    wx.showLoading({
      title: '加载中'
    })

    if (data.name && data.phone && data.company && agent.address && agent.address_lat && agent.address_long) {
      this.setData({
        'agent.name': data.name,
        'agent.phone': data.phone,
        'agent.company': data.company
      })
      self.createAgent()
    } else {
      wx.showToast({
        title: '有错误',
        icon: 'none'
      })
    }
  },

  userLogin: async function (e) {
    let user = await _auth.login()
    this.setData({ hasUser: !!user })
  },

  userLogout: async function () {
    let user = await _auth.logout()
    this.setData({ hasUser: !!user })
  },

  getCurrentUser: async function () {
    let user = await _auth.getCurrentUser()
    this.setData({ hasUser: !!user })
  },

  searchAddress: function (e) {
    let self = this
    wx.chooseLocation({
      success: (res) => {
        self.setData({
          'agent.address': res.address,
          'agent.address_long': res.longitude,
          'agent.address_lat': res.latitude
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  /* -----  Lifecycle Functions ----- */

  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()

    eventChannel.on('sendAgentInformation', (data) => {
      let role = data.role
      let agent = data.agent
      
      this.setData({ role })

      if (agent) this.fetchAgent(agent.id)
    })

    this.getCurrentUser()
  }
})