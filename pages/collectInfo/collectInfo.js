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

  formSubmit: function (e) {
    let data = e.detail.value
    this.setData({
      'agent.name': data.name,
      'agent.phone': data.phone,
      'agent.company_name': data.company_name
    })
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
    console.log(options)
  },
})