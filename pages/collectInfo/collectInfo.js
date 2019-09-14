Page({
  data: {
    address: undefined
  },

  formSubmit: function (e) {
    console.log(e);
  },

  storeValue: function (e) {
    this.setData({
      addressInput: e.detail.value
    })
  },

  searchAddress: function (e) {
    let self = this
    wx.chooseLocation({
      success: (res) => {
        console.log(res)
        self.setData({
          address: {
            address: res.address,
            latitude: res.latitude,
            longitude: res.longitude,
            name: res.name
          }
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  onLoad: function (options) {},
})