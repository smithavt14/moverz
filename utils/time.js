const getLocalString = (date) => {
  return new Promise(resolve => {
    date = new Date(date)

    let options = { hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }

    let localString = new Date(date).toLocaleString('zh-Hans-CN', options)

    date = localString.split(' ')[0]
    let hour = localString.split(' ')[1]
    let stringISOS = new Date(localString).toISOString()

    resolve({ stringISOS, date, hour })
  })
}

module.exports = { getLocalString }