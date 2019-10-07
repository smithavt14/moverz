const _auth = require('../../utils/auth.js')
const _agent = require('../../utils/agent.js')

Page({
  data: {
    agent: undefined,
    role: undefined,
    position: undefined
  },

  /* ---- Event Functions ----- */

  confirmAgent: function () {
    let agent = this.data.agent
    agent.id ? this.updateAgent(agent) : this.createAgent(agent)
  },

  editValue: function (e) {
    let key = `agent.${e.currentTarget.dataset.value}`
    let value = e.detail.value

    this.setData({ [key]: value })
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

  /* ----- Agent Functions ----- */

  createAgent: async function (agent) {
    let res = await _agent.create(agent)
    this.navigateBack(res)
  },

  fetchAgent: async function (id) {
    let agent = await _agent.fetch(id)
    this.setData({ agent })
  },

  updateAgent: async function (agent) {
    agent = await _agent.update(agent)
    this.navigateBack(agent)
  },

  /* ----- Auth Functions ----- */

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

  /* ----- Custom Functions ----- */

  navigateBack: function (agent) {
    const eventChannel = this.getOpenerEventChannel()
    let role = this.data.role
    let id = agent.id
    let position = this.data.position

    eventChannel.emit('receiveAgentInformation', { id, role })
    
    if (position === 'userAgents') {
      wx.navigateBack({ url: '/pages/userAgents/userAgents'})
    }
    if (position === 'index') {
      wx.navigateBack({ url: '/pages/index/index' }) 
    }
  },

  /* -----  Lifecycle Functions ----- */

  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()

    eventChannel.on('sendAgentInformation', (data) => {
      let role = data.role
      let id = data.id
      let position = data.position
      
      this.setData({ role, position })

      if (id) this.fetchAgent(id)
    })
    this.getCurrentUser()
  }
})