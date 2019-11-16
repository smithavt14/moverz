const _auth = require('../../utils/auth.js')
const _parcel = require('../../utils/parcel.js')

Page({
  data: {
    categories: ['日用品', '食品', '文件', '数码产品', '衣物', '其他'],
    hasUser: undefined,
    imagePath: undefined,
    parcel: {
      weight: 1
    }
  },

  /* ----- Event Functions ----- */

  changeWeight: function (e) {
    let number = e.currentTarget.dataset.number
    let weight = this.data.parcel.weight
    weight = Number.parseInt(weight)
    weight = number > 0 ? weight + 1 : weight - 1
    if (weight > 0) {
      this.setData({
        'parcel.weight': weight
      })
    }
  },

  changeComment: function (e) {
    let value = e.detail.value
    this.setData({
      'parcel.comment': value
    })
  },
  
  chooseCategory: function (e) {
    let category = e.currentTarget.dataset.category
    this.setData({
      'parcel.category': category
    })
  },

  uploadImage: function () {
    let self = this
    wx.chooseImage({
      success: function (res) {
        let MyFile = new wx.BaaS.File()
        let fileParams = { filePath: res.tempFilePaths[0] }
        let metaData = { categoryName: 'SDK' }

        MyFile.upload(fileParams, metaData).then(res => {
          let image = res.data.file.path
          self.setData({
            'parcel.image': image
          })
        }, err => {
          console.log(err)
          wx.showModal({title: '用户未登录'})
        })
      }
    })
  },

  /* ----- Parcel Functions ----- */

  createParcel: async function () {
    if (!this.data.parcel.category) {
      wx.showModal({ title: '请选择类型', showCancel: false })
    } else {
      let parcel = this.data.parcel
      parcel = await _parcel.create(parcel)
      this.navigateBack(parcel)
    }
  },

  fetchParcel: async function (id) {
    let parcel = await _parcel.fetch(id)
    this.setData({ parcel })
  },

  updateParcel: async function () {
    let parcel = this.data.parcel
    parcel = _parcel.update(parcel)

    this.navigateBack(parcel)
  },

  /* ----- Auth Functions ----- */

  getCurrentUser: async function () {
    try {
      let user = wx.getStorageSync('user')
      if (user) {
        this.setData({ user })
      }
    }
    catch (err) {
      await _auth.getCurrentUser().then(user => {
        this.setData({ user })
      })
    }
  },

  login: async function () {
    let user = await _auth.login()
    this.setData({ hasUser: !!user })
  },

  logout: function () {
    _auth.logout()
  },

  /* ----- Custom Functions ----- */

  navigateBack: function (parcel) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('getParcelInformation', { parcel })
    wx.navigateBack({
      url: 'pages/index/index'
    })
  },

  /* ----- Lifecycle Functions ----- */
  
  onLoad: function () {
    const eventChannel = this.getOpenerEventChannel()

    eventChannel.on('sendParcelInformation', (data) => {
      let parcel = data.parcel
      if (parcel) this.fetchParcel(parcel.id)
    })

    this.getCurrentUser()
  },
})