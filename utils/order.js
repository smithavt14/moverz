const OrderTable = new wx.BaaS.TableObject('order')
const _agent = require('../utils/agent.js')
const _parcel = require('../utils/parcel.js')
const _map = require('../utils/map.js')

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
  console.log(data)
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

const setPrice = async order => {
  return new Promise(resolve => {
    let sender = _agent.fetch(order.sender)
    let receiver = _agent.fetch(order.receiver)
    let parcel = _parcel.fetch(order.parcel)

    Promise.all([sender, receiver, parcel]).then(async values => {
      let sender = values[0]
      let receiver = values[1]
      let parcel = values[2]

      let result = await _map.calculateDistance(sender, receiver)
      let price = 2000 + (Math.floor((result.distance - 2000) * 0.5))
      resolve(price)
      
      /* Set minimum price at 20 RMB. Then for each km over 2km, 
      add 5 RMB. Price is in cents (i.e. 100 = 1 RMB) */
      
    })
  })
}

module.exports = { fetch, fetchUserOrders, create, update, destroy, setPrice }