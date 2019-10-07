const _auth = require('../../utils/auth.js')
const _agent = require('../../utils/agent.js')

Page({
  data: {
    user: undefined,
    agents: undefined,
    role: undefined
  },

  /* ---- Auth Functions ---- */

  getCurrentUser: async function() {
    let user = await _auth.getCurrentUser()
    if (user) {
      this.setData({ user: user.id })
      this.fetchUserAgents(user.id)
    }
  },

  login: async function () {
    let user = await _auth.login()
    this.setData({ user: user.id })
    this.fetchUserAgents(user.id)
  },

  /* ----- Agent Functions ----- */

  fetchUserAgents: async function (id) {
    let agents = await _agent.fetchUserAgents(id)
    this.setData({ agents })
  },

  destroyAgent: function (e) {
    let user = this.data.user
    let self = this
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      success: async function (res) {
        if (res.confirm) {
          await _agent.destroy(id)
          wx.showToast({
            title: '删除成功'
          })
          self.fetchUserAgents(user)
        }
      }
    })
  },

  editAgent: function (e) {
    let self = this
    let id = e.currentTarget.dataset.id
    
    this.navigateToEdit(id)
  },

  /* ----- Navigation Functions ----- */

  navigateToEdit: function (id) {
    let self = this
    let position = 'userAgents'
    wx.navigateTo({
      url: '/pages/createAgent/createAgent',
      success: function (res) {
        res.eventChannel.emit('sendAgentInformation', { id, position })
      }
    })
  },

  navigateToIndex: function (e) {
    const eventChannel = this.getOpenerEventChannel()
    let role = this.data.role
    let id = e.currentTarget.dataset.id

    eventChannel.emit('receiveAgentInformation', { id, role })

    wx.navigateBack({
      url: '/pages/index/index'
    })
  },

  /* ----- Lifecycle Functions ----- */

  onLoad: function () {
    const eventChannel = this.getOpenerEventChannel()

    eventChannel.on('sendAgentInformation', (data) => {
      console.log(data)
      let role = data.role
      this.setData({ role })
    })
  },

  onShow: function () {
    this.getCurrentUser()
  }
})