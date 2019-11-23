const _auth = require('../../utils/auth.js')
const _agent = require('../../utils/agent.js')

Page({
  data: {
    user: undefined,
    role: undefined
  },

  /* ---- Auth Functions ---- */

  getCurrentUser: async function () {
    try {
      let user = wx.getStorageSync('user')
      if (user) {
        this.setData({ user })
        this.fetchUserAgents(user.id)
      }
    }
    catch (err) {
      await _auth.getCurrentUser().then(user => {
        this.fetchUserAgents(user.id)
      })
    }
  },

  login: async function () {
    let user = await _auth.login()
    this.setData({ user: user.id })
    this.fetchUserAgents(user.id)
  },

  /* ----- Agent Functions ----- */

  fetchUserAgents: async function (id) {
    await _agent.fetchUserAgents(id).then(agents => {
      if (agents.length !== 0) this.setData({ agents })
      else this.setData({agents: []})
    })
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
          self.fetchUserAgents(user.id)
        }
      },
      fail: function (err) {
        console.log(err)
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

  navigateBack: function () {
    wx.navigateBack({
      url: '/pages/index/index'
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
    console.log(eventChannel)

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