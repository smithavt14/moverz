Page({
  data: {
    agent: {
      name: undefined, 
      phone: undefined, 
      company_name: undefined, 
      address: undefined,
      address_lat: undefined, 
      address_long: undefined
    },
    agent_role: undefined
  },

  createAgent: function (e) {
    const eventChannel = this.getOpenerEventChannel()

    let self = this
    let agent_role = self.data.agent_role
    let Agent = new wx.BaaS.TableObject('agent')
    let agent = Agent.create()

    agent.set(self.data.agent).save().then(res => {
      console.log('A new agent was created.', res.data.id)
      eventChannel.emit('getAgentInformation', { 
        agent: res.data,
        agent_role
        })

      wx.hideLoading()
      wx.navigateBack({
        url: '/pages/index/index'
      })
    }, err => {
      console.log(err)
    })
  },

  formSubmit: function (e) {
    let self = this
    let data = e.detail.value
    let agent = self.data.agent

    wx.showLoading({
      title: '加载中'
    })

    if (data.name && data.phone && data.company_name && agent.address && agent.address_lat && agent.address_long) {
      this.setData({
        'agent.name': data.name,
        'agent.phone': data.phone,
        'agent.company_name': data.company_name
      })
      self.createAgent()
    } else {
      wx.showToast({
        title: '有错误',
        icon: 'none'
      })
    }
  },

  getPhoneNumber: function (e) {
    console.log(e)
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

  onLoad: function (options) {
    this.setData({
      agent_role: options.agent
    })
  }
})