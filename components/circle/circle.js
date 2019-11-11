Component({
  options: {
    multipleSlots: true
  },

  properties: {
    draw: { 
      type: String,
      value: 'draw'
    },

    radius: {
      type: String,
      value: 250
    },

    width: {
      type: Number,
      value: 15
    },

    emissions: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) {
        if (newVal !== oldVal) this.createElement()
      }
    }
  },

  data: {
    step: 1,
    size: 0,
    screenWidth: 750,
    txt: 0,
  },

  methods: {

    drawCircleBg: function (element, radius, width) {
      const ctx = wx.createCanvasContext(element, this);
      ctx.setLineWidth(width);
      ctx.setStrokeStyle('#20324E');
      ctx.setLineCap('round')
      ctx.beginPath();
      ctx.arc(radius, radius, radius - width, 0, 2 * Math.PI, false);
      ctx.stroke();
      ctx.draw();
    },

    drawCircle: function (element, radius, width, step) {
      let context = wx.createCanvasContext(element, this);
      
      let gradient = context.createLinearGradient(2 * radius, radius, 0);
      gradient.addColorStop("1", "#178E46");
      
      context.setLineWidth(width);
      context.setStrokeStyle(gradient);
      context.setLineCap('round')
      context.beginPath();
      context.arc(radius, radius, radius - width, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
      context.stroke();
      context.draw()
    },

    createElement: function () {
      const self = this;

      wx.getSystemInfo({
        success: function (res) {
          self.setData({
            screenWidth: res.windowWidth
          });
        },
      });

      let element = this.data.draw;
      let radius = this.data.radius;
      let width = this.data.width;
      let emissions_kg = Math.floor(this.data.emissions / 1000);
      let percentage = (emissions_kg / 100) * 100;
      let step = (2 * percentage) / 100
      let rpx = (this.data.screenWidth / 750) * radius;
      let size = rpx * 2

      this.setData({ 
        element, 
        radius, 
        width, 
        percentage, 
        step, 
        rpx, 
        size, 
        emissions_kg
      });

      this.drawCircleBg(element + 'bg', rpx, width);
      this.drawCircle(element, rpx, width, self.data.step);
    }
  },
  lifetimes: { }
})