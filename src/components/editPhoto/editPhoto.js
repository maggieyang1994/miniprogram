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
    movablePosotion: {}
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
        movablePosotion: tempObj,
        scale
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
      console.log(e);
      this.setData({
        startPosition: {
          x: e.touches[0].pageX,
          y: e.touches[0].pageY
        },
        direction: e.target.dataset.type
      })
    },
    dragMove(e) {
      let direction = this.data.direction;
      let { pageX, pageY } = e.touches[0];
      let temp = {};
      // 必须在区域内移动
      if (this.data.startPosition && pageX >= this.data.outview.left && pageX <= this.data.outview.left + this.data.outview.width && pageY >= this.data.outview.top && pageY <= this.data.outview.height + this.data.outview.top) {
        if (direction.indexOf("top") !== -1) {
          temp.top = pageY - this.data.startPosition.y;
          temp.height = this.data.outview.height - (pageY - this.data.startPosition.y)
        }
        if (direction.indexOf("left") !== -1) {
          temp.left = pageX - this.data.startPosition.x;
          temp.width = this.data.outview.width - (pageX - this.data.startPosition.x)
        }
        if (direction.indexOf("bottom") !== -1) {
          temp.height = this.data.outview.height - (this.data.startPosition.y - pageY)
        }
        if (direction.indexOf("right") !== -1) {
          temp.width = this.data.outview.width - (this.data.startPosition.x - pageX)
        }
        this.setData({
          movablePosotion: {
            ...this.data.movablePosotion,
            ...temp
          }
        })
      }


    },
    dragEnd(e) {
      this.setData({
        startPosition: null
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
