// components/imageTranlator.js
const { TesseractWorker } = require('../../lib/tesseract.min.js');
const worker = new TesseractWorker({
  workerPath: '../node_modules/tesseract.js/dist/worker.min.js',
      langPath: '../lang-data',
      corePath: '../node_modules/tesseract.js-core/tesseract-core.wasm.js',
});

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    image: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    image2Text() {
     worker
        .recognize("https://tesseract.projectnaptha.com/img/eng_bw.png", 'eng')
        .progress((info) => {
          console.log(info);
        })
        .then((result) => {
          console.log(result.text);
        });
    }
  }
})
