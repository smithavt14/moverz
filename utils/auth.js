const login = data => {
  return new Promise(resolve => {
    wx.BaaS.auth.loginWithWechat(data).then(user => {
      wx.setStorage({
        key: 'user',
        data: user,
        success: () => resolve(user)
      })
    }, err => {
      console.log(err)
    })
  })
}

const getCurrentLocation = () => {
  return new Promise (resolve => {
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        const lat = res.latitude.toString()
        const lon = res.longitude.toString()
        resolve({ lat, lon }) 
      },
      fail: err => {
        console.log(err)
        resolve({ lat: 30.252625, lon: 120.16508 })
        // Latitude and Longitude of Hangzhou --
      }
    })
  })
}

const logout = e => {
  return new Promise(resolve => {
    wx.BaaS.auth.logout().then(res => {
      wx.setStorage({
        key: 'user',
        data: undefined,
        success: () => resolve(undefined)
      })
    }, err => {
      console.log(err)
    })
  })  
}

const getCurrentUser = e => {
  return new Promise(resolve => {
    let user = wx.getStorageSync('user')

    if (!user) {
      wx.BaaS.auth.getCurrentUser().then(user => {
        wx.setStorage({
          key: 'user',
          data: user,
          success: () => resolve(user)
        })
      }).catch(err => {
        if (err.code === 604) {
          wx.setStorage({
            key: 'user',
            data: undefined,
            success: () => resolve(undefined)
          })
        }
      })
    } else resolve(user)
  })
}

module.exports = { login, logout, getCurrentUser, getCurrentLocation }