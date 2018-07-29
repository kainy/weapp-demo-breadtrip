// 参数传递路径：
//    分享操作： 网页 -postMessage-》小程序卡片
//    打开卡片： 小程序卡片 -querystring-》 网页
const App = getApp();
const util = require('../../utils/util.js');
const QR = require('../../utils/qrcode.js');
const arrPoster = [
  '4d6e3e3bgy1ftr4jt230pj20ia0wi3zp',
  '4d6e3e3bgy1ftr4jsbyidj20ia0wimz0',
  '4d6e3e3bgy1ftr4jrulwkj20ia0wj755',
  '4d6e3e3bgy1ftr4jqfm8ej20ia0wi0v1',
  '4d6e3e3bgy1ftr4jpsdjdj20f00qognf',
  '4d6e3e3bgy1ftr4jp5omdj20ia0y7abd',
  '4d6e3e3bgy1ftr4jok2t1j20ia0wimyp',
  '4d6e3e3bgy1ftr4jnuuirj20ia0wimyx',
  '4d6e3e3bgy1ftr4jmuxkij20ia0wiwg3',
  '4d6e3e3bgy1ftr4jlftogj20ia0wiq5s',
  '4d6e3e3bgy1ftr4jkbdaqj20ia0wit9x',
  '4d6e3e3bgy1ftr4jjo19mj20ia0wimya',
];

Page({
  data: {
    src: '',
    // src: 'https://kainy.cn/miniprograms/KSK/loading.html',
    shareData: {},
    platform: App.systemInfo.platform,
    model: App.systemInfo.model.toLowerCase().replace(' ', '_'),
    posterBG: '',
    widthQR: 122, // 二维码图片宽度 182, // 194
    widthCanvas: 750,
    heightCanvas: 1334,
    ratio: 750 / App.systemInfo.screenWidth,
  },
  onLoad(options) {
    if (!options.webviewurl) {
      util.alert('缺少分享URL参数', wx.navigateBack);
      return;
    }
    options.title = options.title || '精彩内容';
    this.setData({
      options,
    });
    wx.hideShareMenu();
    this.changePic();
  },
  changePic() {
    const idx = +new Date() % arrPoster.length;
    console.log('idx:', idx);
    this.setData({
      posterBG: `https://wx2.sinaimg.cn/mw690/${arrPoster[idx]}.jpg`,
    });
  },
  shareToMoment() {
    console.log('shareToMoment');
    this.generate(this.data.options.webviewurl);
  },
  getShortUrl(url) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://kainy.cn/api/shorturl/submit',
        method: 'POST',
        data: {
          target: url,
          reuse: true,
        },
        success(res) {
          // console.log(res);
          resolve(`https://kainy.cn/t/${res.data.id}`);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  },
  remoteToLocal(url) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url,
        success: resolve,
        fail: reject,
      });
    });
  },
  // 解决 API wx.createCanvasContext 的 draw 接口，回调通知在 devtool 不执行问题
  drawPolyfill(ctx) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        resolve(ctx);
      }, 222);
      ctx.draw(true, () => {
        clearTimeout(timer);
        resolve(ctx);
      });
    });
  },
  drawQRCode(URL) {
    return new Promise((resolve, reject) => {
      QR.api.draw(URL, 'qrcanvas', this.data.widthQR / this.data.ratio, this.data.widthQR / this.data.ratio);
      setTimeout(() => {
        // 获取临时图
        console.log('drawQRCode called');
        wx.canvasToTempFilePath({
          canvasId: 'qrcanvas',
          success(res) {
            const tempFilePath = encodeURI(res.tempFilePath);
            resolve(tempFilePath);
          },
          fail: reject,
        });
      }, 777);
    });
  },
  generate(url) {
    wx.showLoading({
      title: '海报合成中…',
      mask: true,
    });
    const suofang = 1;
    const positionX = 710 / suofang; // 610-二维码区块中心点位置
    const positionY = 1414 / suofang; // 1194-
    const widthQR = this.data.widthQR / suofang;
    const titleFontsize = 28 / suofang;
    // const widthAvatar = 47;
    // const widthAvatarBorder = widthAvatar + 9;
    this.getShortUrl(decodeURIComponent(url)).then((shortUrl) => {
      console.log(shortUrl);
      const ctx = wx.createCanvasContext('previewcanvas');
      // 这里是绘制灰色背景
      ctx.setFillStyle('#EEEEEE');
      ctx.fillRect(0, 0, this.data.widthCanvas / suofang, (positionY + (widthQR / 2)) / suofang);
      // 绘制标题
      ctx.setFontSize(titleFontsize);
      ctx.setFillStyle('#000000');
      ctx.fillText(`《${util.textOverflow(this.data.options.title, 17)}》`, 67 / suofang, positionY - (titleFontsize / 2));
      const that = this;
      Promise.all([this.remoteToLocal(this.data.posterBG), this.drawQRCode(shortUrl)]).then(([pic, qrcode]) => {
        console.log(`draw1-画背景图:${+new Date()}`);
        ctx.drawImage(pic.tempFilePath, 0, 0, this.data.widthCanvas / suofang, this.data.heightCanvas / suofang);
        that.drawPolyfill(ctx).then(() => {
          if (shortUrl) {
            console.log(`draw2-画二维码:${+new Date()}`);
            ctx.drawImage(qrcode, positionX - widthQR / 2 - 5, positionY - widthQR / 2 - 5, widthQR + 12, widthQR + 12);
          }
          return that.drawPolyfill(ctx);
        }).then(() => {
        //   console.log(`draw3-画头像边框:${+new Date()}`);
        //   ctx.drawImage('../../images/avatar-border.png', positionX - widthAvatarBorder / 2, positionY - widthAvatarBorder / 2, widthAvatarBorder, widthAvatarBorder);
        //   return that.drawPolyfill(ctx);
        // }).then(() => {
        //   console.log(`draw4-画头像:${+new Date()}`);
        //   ctx.drawImage(avatar.tempFilePath, positionX - widthAvatar / 2, positionY - widthAvatar / 2, widthAvatar, widthAvatar);
        //   return that.drawPolyfill(ctx);
        // }).then(() => {
          console.log(pic.tempFilePath, qrcode);
          wx.hideLoading();
          setTimeout(that.generateCB, 2);
        }).catch(util.errHandler);
      }).catch(util.errHandler);
    }).catch(util.errHandler);
  },
  generateCB() {
    const that = this;
    // 获取临时图
    console.log('generateCB called');
    wx.canvasToTempFilePath({

      canvasId: 'previewcanvas',
      success(res) {
        that.saveImageToPhotosAlbum(res);
      },
      fail: console.error,
    });
  },
  saveImageToPhotosAlbum(res) {
    const tempFilePath = encodeURI(res.tempFilePath);
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success(result) {
        console.log('saveImageToPhotosAlbum', result);
        util.alert('海报已保存至系统相册，快到朋友圈分享吧～', wx.navigateBack);
      },
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    const title = '推荐一篇文章，希望对你有用'; // 推荐一个不错的内容 这篇文章写的超赞，值得一读
    const url = this.data.options.webviewurl;
    const ret = {
      title,
      path: `/pages/webview/webview?webviewurl=${url}`,
      //imageUrl: '',
    };
    console.log('onShareAppMessage: ', ret);
    return ret;
  },
});
