const QQMapWX = require('../libs/qqmap-wx-jssdk.min.js')
const map = new QQMapWX({ key: 'TLRBZ-63KKF-RRAJV-N73B4-243KV-MPFA5' })

const calculateDistance = (sender, receiver) => {
  return new Promise(resolve => {
    map.calculateDistance({
      'mode': 'driving',
      'from': {
        latitude: sender.address_lat,
        longitude: sender.address_long
      },
      'to': [{
        latitude: receiver.address_lat,
        longitude: receiver.address_long
      }],
      'success': function (res) {
        resolve(res.result.elements[0].distance)
      },
      'fail': function (err) {
        console.log(err, 'fail')
        resolve(err)
      }
    })
  })
}

module.exports = { calculateDistance }