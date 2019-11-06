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

module.exports = { login, logout, getCurrentUser }