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
    AgentTable.delete(id).then(res => {
      resolve(res)
    }, err => {
      resolve(err)
    })
  })
}

module.exports = { fetch, fetchUserAgents, create, update, destroy }