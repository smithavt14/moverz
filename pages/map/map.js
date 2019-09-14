Page({
  data: {
  },
  
  onLoad: function () {
    // const qqmapsdk = new QQMapWX({
    //   key: 'TLRBZ-63KKF-RRAJV-N73B4-243KV-MPFA5'
    // })
  },
  
  onShow: function () {
    qqmapsdk.search({
      keyword: '酒店',
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  }
})