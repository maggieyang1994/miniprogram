const app = getApp()

Page({
  data: {
    sourceImg: null
  },
  onLoad: function () {
  },
  handlerTakePhoto(e){
    this.setData({
      sourceImg: e.detail.path
    })
  }
})
