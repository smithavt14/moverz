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

const pay = order => {
  let price = order.price
  let params = {
    totalCost: 0.01,
    merchandiseDescription: '一条支付描述'
  }
  return new Promise(resolve => {
    wx.BaaS.pay(params).then(res => {
      console.log('Transaction Number: ', res.transaction_no)
      resolve(res.transaction_no)
    }, err => {
      if (err.code === 607) {
        wx.hideLoading()
        console.log('用户取消支付')
        resolve(err)
      } else if (err.code === 608) {
        console.log('支付失败', err.message)
        wx.showToast({ title: '支付失败', icon: 'none' })
        resolve(err)
      }
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

    let sender = order.sender.id
    let receiver = order.receiver.id
    let parcel = order.parcel.id
    let pickup_time = order.pickup_time
    let price = order.price
    let emissions_saved = order.emissions_saved
    let distance = order.distance
    let transaction_no = order.transaction_no
    let status = order.status

    console.log(order)

    orderToUpdate.set({ sender, receiver, parcel, pickup_time, price, emissions_saved, distance, transaction_no, status })

    orderToUpdate.update().then(res => {
      resolve(res.data)
    }, err => {
      console.log(err)
      resolve(err)
    })
  })
}

const setOrderStatusOptions = order => {
  return new Promise(resolve => {
    switch (order.status) {
      case 0:
        resolve({ title: '等待支付', subtitle: '您的订单等待支付', color: '#FFBC79' })
      case 1:
        resolve({ title: '订单确认了', subtitle: '您的订单已支付了', color: '#178E46' })
      case 2:
        resolve({ title: '订单在寄送中', subtitle: '您的订单寄送了', color: '#74B3D6' })
      case 3:
        resolve({ title: '订单已收到了', subtitle: '对方已经收到货了', color: '178E46' })
      case 4:
        resolve({ title: '订单取消了', subtitle: '您的订单取消了', color: '#E15E5E' })
    }
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

const setDistance = async order => {
  return await _map.calculateDistance(order.sender, order.receiver) // unit = meters
}

const setEmissions = order => {
  let distance = order.distance / 1000
  let emissions = Math.floor(175 * distance)

  return emissions // unit = grams
  
  // Resources: 
  // https://www.iea.org/topics/transport/gfei/report/
  // 2017 China average CO2 emissions(grams)/km = 175
}

const setPrice = order => {
  return new Promise(async resolve => {
    await fetchData(order).then(order => {
      let weight = order.parcel.weight
      let distance = order.distance
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
      resolve(price)
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

module.exports = { fetch, fetchData, fetchUserOrders, create, update, destroy, setPrice, validate, setDistance, setEmissions, setOrderStatusOptions, pay }