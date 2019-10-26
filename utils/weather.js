const _auth = require('../utils/auth.js')
const key = '227fdcb7a5f24d2d87e3fa9fa0e0f320'

/* --- https://dev.heweather.com/docs/api/air --- */

const fetchAQI = async () => {
  let user = await _auth.getCurrentUser()

  return new Promise (resolve => {
    
    let url = `https://free-api.heweather.net/s6/air/now?location=${user.city}&key=${key}`
    let self = this

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
        let darkHex = darkenColor(hex)
        let location = res.data.HeWeather6[0].basic.location
        air['hex'] = hex
        air['darkHex'] = darkHex
        resolve({ air, location })
      },
      fail(err) {
        resolve(err)
      }
    })
  })
}

const setColor = (qlty) => {
  if (qlty === '优') return '#A3E160'
  if (qlty === '良') return '#FFD74E'
  if (qlty === '轻度污染') return '#FF9859'
  if (qlty === '中度污染') return '#FF6469'
  if (qlty === '重度污染') return '#A977BA'
  if (qlty === '严重污染') return '#A97182'
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
  
  let user = await _auth.getCurrentUser()

  return new Promise(resolve => {

    let url = `https://free-api.heweather.net/s6/weather/now?location=${user.city}&key=${key}`

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