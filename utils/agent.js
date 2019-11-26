const AgentTable = new wx.BaaS.TableObject('agent')

const fetch = id => {
  return new Promise(resolve => {
    AgentTable.get(id).then(res => {
      resolve(res.data)
    }, err => {
      resolve(err)
    })
  })
}

const fetchUserAgents = id => {
  return new Promise(resolve => {
    let query = new wx.BaaS.Query()
    query.compare('created_by', '=', id)

    AgentTable.setQuery(query).orderBy('-created_at').find().then(res => {
      resolve(res.data.objects)
    }, err => {
      resolve(err)
    })
  })
}

const create = data => {
  return new Promise(resolve => {
    let agent = AgentTable.create()
    agent.set(data).save().then(res => {
      resolve(res.data)
    }, err => {
      resolve(err)
    })
  })
}

const validate = agent => {
  let validPhone = agent.phone.match(/\d{11}/)
  let validFields = !!(agent && agent.name && agent.phone && agent.address)

  if (validFields && validPhone) return true
  if (validFields && !validPhone) {
    wx.showToast({ title: '手机号输发不对', icon: 'none' })
    return false
  }
  if (!validFields) {
    wx.showToast({ title: '必须填写：姓名，手机号，地址', icon: 'none' })
    return false
  }
}

const update = agent => {
  return new Promise(resolve => {
    let id = agent.id
    let agentToUpdate = AgentTable.getWithoutData(id)

    agentToUpdate.set({
      'name': agent.name,
      'phone': agent.phone,
      'company': agent.company,
      'address': agent.address,
      'address_long': agent.address_long,
      'address_lat': agent.address_lat
    })

    agentToUpdate.update().then(res => {
      resolve(res.data)
    }, err => {
      console.log(err)
      resolve(err)
    })
  })
}

const destroy = id => {
  return new Promise(resolve => {
    let agentToUpdate = AgentTable.getWithoutData(id)
    agentToUpdate.set({display: false})
    agentToUpdate.update().then(res => {
      resolve(res)
    }, err => {
      console.log(err)
      resolve(err)
    })
  })
}

module.exports = { fetch, fetchUserAgents, create, update, destroy, validate }