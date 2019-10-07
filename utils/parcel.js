const ParcelTable = new wx.BaaS.TableObject('parcel')

const fetch = id => {
  return new Promise(resolve => {
    ParcelTable.get(id).then(res => {
      resolve(res.data)
    }, err => {
      resolve(err)
    })
  })
}

const create = data => {
  return new Promise(resolve => {
    let parcel = ParcelTable.create()
    parcel.set(data).save().then(res => {
      resolve(res.data)
    }, err => {
      resolve(err)
    })
  })
}

const update = parcel => {
  return new Promise(resolve => {
    let id = parcel.id
    let parcelToUpdate = ParcelTable.getWithoutData(id)

    parcelToUpdate.set({
      'category': parcel.category,
      'weight': parcel.weight,
      'image': parcel.image,
      'comment': parcel.comment
    })

    parcelToUpdate.update().then(res => {
      resolve(res.data)
    }, err => {
      console.log(err)
      resolve(err)
    })
  })
}

const destroy = id => {
  return new Promise(resolve => {
    ParcelTable.delete(id).then(res => {
      resolve(res)
    }, err => {
      resolve(err)
    })
  })
}

module.exports = { fetch, create, update, destroy }