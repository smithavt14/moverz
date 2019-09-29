Page({
  data: {
    categories: ['日用品', '食品', '文件', '数码产品', '衣物', '其他'],
    imagePath: undefined,
    parcel: {
      category: undefined,
      weight: 1,
      image: undefined,
      comment: undefined,
    },
  },

  chooseCategory: function (e) {
    let category = e.currentTarget.dataset.category
    this.setData({
      'parcel.category': category
    })
  },

  changeWeight: function (e) {
    let number = e.currentTarget.dataset.number
    let weight = this.data.parcel.weight
    weight = Number.parseInt(weight)
    let update = number > 0 ? weight + 1 : weight - 1
    if (update > 0) {
      this.setData({
        'parcel.weight': update
      })
    }
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
          console.log(res.data.file)
          self.setData({
            'parcel.image': image
          })
        }, err => {
          console.log(err)
        })
      }
    })
  },

  changeComment: function (e) {
    let value = e.detail.value
    this.setData({
      'parcel.comment': value
    })
  },

  createParcel: function (e) {
    let Parcel = new wx.BaaS.TableObject('parcel')
    let parcel = Parcel.create()
    let newParcel = this.data.parcel

    if (newParcel.category && newParcel.weight && newParcel.image) {
      parcel.set(newParcel).save().then(res => {
        wx.reLaunch({
          url: `/pages/index/index?parcel=${res.data.id}`
        })
      }, err => {
        console.log(err)
      })
    } else {
      wx.showToast({
        title: '有错误',
        icon: 'none'
      })
    }
  },
  
  onLoad: function (options) {
  },
})