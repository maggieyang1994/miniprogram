const app = getApp()

Page({
  data: {
    sourceImg: null,
    resultImg: null
  },
  onLoad: function () {
  },
  handlerTakePhoto(e){
    this.setData({
      sourceImg: e.detail.path
    })
  },
  handerEditPhoto(e){
    this.setData({
      resultImg: e.detail.path
    })
  }

})
