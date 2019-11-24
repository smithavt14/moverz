const getLocalString = (date) => {
  return new Promise(resolve => {
    let currentDate = new Date().getDate()
    date = new Date(date)
    let options = { 
      hour12: false, 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric' 
    }
    let localString = new Date(date).toLocaleString('zh-Hans-CN', options)

    date = localString.split(' ')[0]
    let hour = localString.split(' ')[1]

    let stringISOS = new Date(localString).toISOString()

    resolve({ stringISOS, date, hour })
  })
}

const updatePickerDateTime = (attrs = {}) => {

  
  // get picker.time & picker.date
  // if picker.date > date.now => let picker.minHour === 0
  // else picker.minHour = date.now (hour)
}

const setPickerDateTime = () => {
  return new Promise(async resolve => {
    let date = new Date()
    date = new Date(date.setHours(date.getHours() + 1))
    await getLocalString(date).then(resolve)
  })
}

module.exports = { getLocalString, setPickerDateTime }