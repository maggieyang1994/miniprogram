// pages/audio/audio.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPress: false
  },

  touchstart(){
    console.log("start");
    this.setData({
      isPress: true
    })
  },
  longpress(){
    console.log("longpress")
  },
  touchend(){
    console.log("touchend");
    this.setData({
      isPress: true
    })
  }

})