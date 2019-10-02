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
      resolve(res)
    }, err => {
      console.log(err)
      resolve(err)
    })
  })
}

const destroy = id => {
  return new Promise(resolve => {
    AgentTable.delete(id).then(res => {
      resolve(res)
    }, err => {
      resolve(err)
    })
  })
}

module.exports = { fetch, create, update, destroy }