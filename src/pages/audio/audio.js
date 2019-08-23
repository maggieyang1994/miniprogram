import { getUrl } from '../../utils/getUrl'
let socket;
let isFirst = true
let isSocketOpen = false;
let recordManager = wx.getRecorderManager();
let audioContext = wx.createInnerAudioContext()


const sendData = (data, status) => {
  let params = {
    "data": {
      "status": status,
      "format": "audio/L16;rate=16000",
      "encoding": "raw",
      "audio": wx.arrayBufferToBase64(data)
    },
    common: {
      "app_id": "5d5caf64"
    },
    business: {
      "language": "zh_cn",
      "domain": "iat",
      "accent": "mandarin"
    }
  }
  console.log(status)
  socket.send({
    data: JSON.stringify(params)
  })
}
recordManager.onStart(() => {
  console.log("really start");
  self.setData({
    isRecording: true
  })
  if (!self.data.isLastStop) recordManager.stop()
  // 创建socket连接
  socket = wx.connectSocket({ url: getUrl() });
  console.log("socket", socket)
  socket.onOpen(() => {
    console.log("连接成功")
    isSocketOpen = true
  })
  socket.onClose(() => {
    console.log("连接关闭")
  });
  socket.onMessage((res) => {
    console.log("message", res.data);
    let result = JSON.parse(res.data)
  })
  socket.onError(({ errMsg }) => {
    console.log("连接失败", errMsg)
  })
})
recordManager.onStop((res) => {
  console.log("really stop");
  self.setData({
    isRecording: false,
    isLastStop: true,
    audioSrc: res.tempFilePath
  });

  // 关掉sockete
  socket.close()
});
recordManager.onFrameRecorded(({ frameBuffer, isLastFrame }) => {
  if (isSocketOpen) {
    
    console.log(frameBuffer, isLastFrame);
    let status = (isFirst ? 0 : (isLastFrame ? 2 : 1));
    isFirst = false
    sendData(frameBuffer, status)
  }
})
Page({

  /**
   * 页面的初始数据
   */
  onLoad: function () {
    self = this
  },
  data: {
    isRecording: false,
    isLastStop: true,
    audioSrc: ''
  },

  touchstart() {
    console.log("start");
    recordManager.start({
      frameSize: 4,
      format: "mp3",
      sampleRate: 16000
    });
  },
  touchend() {
    console.log("touchend");
    // 为了防止 还没真正start 就stop
    if (this.data.isRecording) recordManager.stop();
    else this.data.isLastStop = false

  },
  playAudio() {
    if (!this.data.audioSrc) console.log('当前没有音频')
    audioContext.src = this.data.audioSrc
    audioContext.play()
  }

})