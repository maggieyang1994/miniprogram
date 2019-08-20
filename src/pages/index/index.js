const app = getApp()

Page({
  data: {

  },
  onLoad: function () {
  
  },
  goTo(e){
    wx.navigateTo({
      url: e.target.dataset.url,
    })
  }
})
