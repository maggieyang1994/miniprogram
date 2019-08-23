project.config.json 中的miniprogramRoot
指定了项目根目录  package.json和 node_module都必须放在该目录下

在父元素绑定了touchstart  touchend，
子元素中绑定了data中的变量的时候
不能在touchstart 的时候改变这个变量
否则 事件就不会冒泡到 父元素 也就触发不了touchend事件了
js   

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
    recordManager.stop();

  }
recordManager.onStart(() => {
  console.log("really start");
  self.setData({
    isRecording: true
  })
})

html

<view class="voiceButton" catchtouchstart="touchstart" catchtouchend="touchend">
     <view wx:if="{{isRecording}}">松开</view>
     <view wx:if="{{！isRecording}}">录音</view>
</view>
touchstart的时候改变了isRecording这个变量  导致touchend不触发





recordManager.onFrameRecorded回掉只在真机中才会触发  在微信调试工具中不触发