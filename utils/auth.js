const login = data => {
  return new Promise(resolve => {
    wx.BaaS.auth.loginWithWechat(data).then(user => {
      console.log('login', user)
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
      console.log('logout')
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
        console.log('already logged in', user)
        wx.setStorage({
          key: 'user',
          data: user,
          success: () => resolve(user)
        })
      }).catch(err => {
        if (err.code === 604) {
          console.log('not logged in')
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