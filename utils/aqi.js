const key = '18983e9a-524c-44a3-8857-df0b36877092'

const fetch = () => {
  return new Promise (resolve => {
    const user = wx.getStorageSync('user')

    let url = `https://api.airvisual.com/v2/nearest_city?key=${key}`

    wx.request({
      url,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        resolve(res.data.data)
      },
      fail(err) {
        resolve(err)
      }
    })
  })
}

module.exports = { fetch }