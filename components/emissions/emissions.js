const _auth = require('../../utils/auth.js')
const _weather = require('../../utils/weather.js')

Component({

  behaviors: [],

  properties: {
    myProperty: { // Property name
      type: String,
      value: ''
    },
  },

  data: {
    air: undefined,
    user: undefined
  },

  methods: {

    getAQI: async function () {
      let aqi = await _weather.fetchAQI()
      this.setData({
        ['air.location']: aqi.location,
        ['air.quality']: aqi.air,
      })
    },

    getCurrentUser: async function () {
      await _auth.getCurrentUser().then(user => {
        if (user) {
          this.setData({ user })
          this.getAQI()
        } else {
          this.setData({ hasUser: !!user })
        }
      })
    },
  },

  lifetimes: {
    attached: function () { 
      this.getCurrentUser()
    },
  },

  pageLifetimes: {
    // Component page lifecycle function
    show: function () { },
    hide: function () { },
    resize: function () { },
  },
})