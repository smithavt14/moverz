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

const create = order => {
  order.sender = order.sender.id
  order.receiver = order.receiver.id
  order.parcel = order.parcel.id

  return new Promise(resolve => {
    let row = OrderTable.create()
    row.set(order).save().then(res => {
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

const fetchData = async (order) => {
  let sender = order.sender.id
  let receiver = order.receiver.id
  let parcel = order.parcel.id

  return new Promise(resolve => {
    sender = _agent.fetch(sender)
    receiver = _agent.fetch(receiver)
    parcel = _parcel.fetch(parcel)

    Promise.all([sender, receiver, parcel]).then(values => {  
      order.sender = values[0]
      order.receiver = values[1]
      order.parcel = values[2]
      
      resolve(order)
    })
  })
}

const setPrice = order => {
  return new Promise(async resolve => {

    await fetchData(order).then(async order => {

      let weight = order.parcel.weight
      let distance = await _map.calculateDistance(order.sender, order.receiver)
      let hour = new Date(order.pickup_time).getHours()

      let price = 0
      
      price += weight > 6 ? Math.ceil((weight - 6) * 2) : 0

      if (hour < 6 || hour >= 23) {
        price += 18
        price += distance > 5000 ? Math.ceil((distance - 5000) * .002) : 0
        price = price > 250 ? 250 : price
      } else {
        price += 16
        price += distance > 5000 ? Math.ceil((distance - 5000) * .0035) : 0
        price = price > 200 ? 200 : price
      }
      resolve({ price, distance })
    })
  }) 
}

const validate = (order) => {
  let sender = order.sender
  let receiver = order.receiver
  let parcel = order.parcel

  return new Promise(async resolve => {
    if (sender && receiver && parcel) {
      await _map.calculateDistance(sender, receiver).then(res => {
        let distance = res.distance
        if (distance > 60000) {
          wx.showModal({ 
            title: '请注意', 
            content: '距离太远，限制在60公里', 
            showCancel: false 
          })
          resolve(false)
        } else {
          resolve(true)
        }
      })
    } else {
      wx.showToast({title: '还有空白的', icon: 'none'})
      resolve(false)
    }
  })
}

module.exports = { fetch, fetchData, fetchUserOrders, create, update, destroy, setPrice, validate }