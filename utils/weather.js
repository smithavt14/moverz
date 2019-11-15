const _auth = require('../utils/auth.js')
const key = '227fdcb7a5f24d2d87e3fa9fa0e0f320'

/* --- https://dev.heweather.com/docs/api/air --- */

/* If user is not logged in, first display information for Hangzhou. If user is logged in, then display information for their local area. */

const fetchAQI = async () => {
  let location = await _auth.getCurrentLocation()
  
  return new Promise (resolve => {  
    let self = this
    let url = `https://api.heweather.net/s6/air/now?location=${location.lat},${location.lon}&key=${key}`
    
    wx.request({
      url,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        let air = res.data.HeWeather6[0].air_now_city
        let hex = setColor(air.qlty)
        location = res.data.HeWeather6[0].basic.location
        
        air['hex'] = hex

        resolve({ air, location })
      },
      fail(err) {
        console.log(err)
        resolve(err)
      }
    })
  })
}

const setColor = (qlty) => {
  if (qlty === '优') return '#6ACF4B'
  if (qlty === '良') return '#FFDA3B'
  if (qlty === '轻度污染') return '#FF722E'
  if (qlty === '中度污染') return '#EF0024'
  if (qlty === '重度污染') return '#AD3A83'
  if (qlty === '严重污染') return '#933D40'
}

const darkenColor = (hex) => {
  let lum = -0.03
  
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  lum = lum || 0;

  let rgb = "#", c, i;

  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
}

const fetchWeather = async () => {
  let location = await _auth.getCurrentLocation
  
  return new Promise(resolve => {
    
    let url = `https://api.heweather.net/s6/weather/now?location=${location.lat},${location.lon}&key=${key}`

    wx.request({
      url,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let data = res.data.HeWeather6[0].now
        resolve(data)
      },
      fail(err) {
        resolve(err)
      }
    })
  })
}

module.exports = { fetchAQI, fetchWeather }