const OrderTable = new wx.BaaS.TableObject('order')

const fetch = id => {
  return new Promise(resolve => {
    OrderTable.get(id).then(res => {
      resolve(res.data)
    }, err => {
      resolve(err)
    })
  })
}

const fetchUserOrders = id => {
  return new Promise(resolve => {
    let query = new wx.BaaS.Query()
    query.compare('created_by', '=', id)

    OrderTable.setQuery(query).orderBy('-created_at').find().then(res => {
      resolve(res.data.objects)
    }, err => {
      resolve(err)
    })
  })
}

const create = data => {
  return new Promise(resolve => {
    let order = OrderTable.create()
    order.set(data).save().then(res => {
      resolve(res.data)
    }, err => {
      resolve(err)
    })
  })
}

const update = order => {
  return new Promise(resolve => {
    let id = order.id
    let orderToUpdate = OrderTable.getWithoutData(id)

    orderToUpdate.set({
      // to change 
    })

    orderToUpdate.update().then(res => {
      resolve(res.data)
    }, err => {
      console.log(err)
      resolve(err)
    })
  })
}

const destroy = id => {
  return new Promise(resolve => {
    OrderTable.delete(id).then(res => {
      resolve(res)
    }, err => {
      resolve(err)
    })
  })
}

module.exports = { fetch, fetchUserOrders, create, update, destroy }