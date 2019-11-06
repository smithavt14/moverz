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

const fetchData = async order => {
  let hour = new Date(order.pickup_time).getHours()

  return new Promise(resolve => {
    let sender = _agent.fetch(order.sender)
    let receiver = _agent.fetch(order.receiver)
    let parcel = _parcel.fetch(order.parcel)

    Promise.all([sender, receiver, parcel]).then(async values => {
      sender = values[0]
      receiver = values[1]
      parcel = values[2]

      let route = await _map.calculateDistance(sender, receiver)

      resolve({parcel, route, hour})
    })
  })
}

const setPrice = order => {
  return new Promise(async resolve => {
    await fetchData(order).then(res => {
      let weight = res.parcel.weight
      let distance = res.route.distance
      
      let price = 0
      
      price += weight > 6 ? Math.ceil((weight - 6) * 2) : 0

      if (res.hour < 6 || res.hour >= 23) {
        price += 18
        price += distance > 5000 ? Math.ceil((distance - 5000) * .002) : 0
      } else {
        price += 16
        price += distance > 5000 ? Math.ceil((distance - 5000) * .0035) : 0
      }

      price = price > 200 ? 200 : price
      
      resolve(price)
    })
  }) 
}

module.exports = { fetch, fetchUserOrders, create, update, destroy, setPrice }