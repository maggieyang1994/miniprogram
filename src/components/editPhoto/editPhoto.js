// components/editPhoto/editPhoto.js
import { adapterImage } from '../../utils/adaptiveImage.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    sourceImg: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    outview: null,
    scale: null,
    imageLoaded: false,
    direction: '',
    startPosition: null,
    temp: [0,0,0,0]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async imageOnload(e) {
      let res = await this.getElement(".imageWrapper");
      // 根据outer view 和 image view 算出比例
      let scale = adapterImage(res, e.detail);
      let tempObj = {
        top: res.top || 0,
        left: res.left || 0,
        width: Math.floor(e.detail.width * scale),
        height: Math.floor(e.detail.height * scale)
      }
      this.setData({
        imageLoaded: true,
        outview: tempObj,
        scale,
        movablePosotion: tempObj
      })
    },
    getElement(selector) {
      return new Promise((resolve, reject) => {
        try {
          const query = this.createSelectorQuery()
          query.select(selector).boundingClientRect()
          query.exec(res => {
            const { width, height, left, top } = res[0]
            resolve({ width, height, left, top })
          })
        } catch (e) {
          reject(e)
        }
      })
    },
    dragStart(e) {
      this.setData({
        startPosition: {
          startX: e.touches[0].pageX,
          startY: e.touches[0].pageY
        },
        direction: e.target.dataset.type
      })
    },
    dragMove(e) {
      let direction = this.data.direction;
      let { pageX, pageY } = e.touches[0];
      let { startX, startY } = this.data.startPosition;
      let temp = {}
      // 必须在区域内移动
      if (this.data.startPosition && pageX >= this.data.outview.left && pageX <= this.data.outview.left + this.data.outview.width && pageY >= this.data.outview.top && pageY <= this.data.outview.height + this.data.outview.top) {
        if (direction.indexOf("top") !== -1) {
          // 向下- 向上 +
          temp[0] = startY - pageY
        }
        if (direction.indexOf("left") !== -1) {
          // 向右-  向左 +
          temp[1] = startX - pageX
        }
        if (direction.indexOf("bottom") !== -1) {
          // 向下- 向上 +
          temp[2] = startY - pageY
        }
        if (direction.indexOf("right") !== -1) {
          // 向右-  向左 +
          temp[3] = startX - pageX
        }
        this.setData({
          temp
        })
      }


    },
    dragEnd(e) {
      // 放开的时候记录当前位置
      let { left, top, height, width } = this.data.movablePosotion;
      let temp = this.data.temp
      this.setData({
        movablePosotion: {
          left: left - temp[1],
          top: top - temp[0],
          width: width + temp[1] - temp[3],
          height: height + temp[0] - temp[2]
        },
        temp: [0,0,0,0]
      })
    },
    onChange(e){
      if (!e.detail.source) return
        const { x, y } = detail
        this.setData({
          movablePosotion: {
            ...this.data.movablePosotion,
            left: x,
            top: y
          }
        })
    },
    handleCut() {
      let ctx = wx.createCanvasContext('canvas1', this);
      // 不能画网络图片
      wx.getImageInfo({
        src: this.data.sourceImg,
        success: (res) => {
          ctx.drawImage(res.path, this.data.movablePosotion.left, this.data.movablePosotion.top, this.data.movablePosotion.width, this.data.movablePosotion.height, 0, 0, this.data.movablePosotion.width, this.data.movablePosotion.height)

          ctx.draw(false, () => {
            debugger
            console.log("drawCanvas done")
            wx.canvasToTempFilePath({
              x: this.data.movablePosotion.left,
              y: this.data.movablePosotion.top,
              width: this.data.movablePosotion.width,
              height: this.data.movablePosotion.height,
              destWidth: this.data.movablePosotion.width,
              destHeight: this.data.movablePosotion.height,
              canvasId: 'canvas1',
              success(res) {
                // console.log(res.tempFilePath);
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: (res) => {
                    console.log(res, '保存成功')
                  },
                  fail: (err) => {
                    console.log(err)
                  }
                })
              },
              fail(err) {
                console.log(err)
              }
            }, this)
          });
        }
      })


    }
  }


})
