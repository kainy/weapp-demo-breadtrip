// 参数传递路径：
//    分享操作： 网页 -postMessage-》小程序卡片
//    打开卡片： 小程序卡片 -querystring-》 网页
const App = getApp();
const util = require('../../utils/util.js');
const QR = require('../../utils/qrcode.js');

const suofang = 2;
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
    suofang,
    platform: App.systemInfo.platform,
    model: App.systemInfo.model.toLowerCase().replace(' ', '_'),
    posterBG: '',
    widthQR: 122, // 二维码图片宽度 182, // 194
    widthCanvas: 750 / suofang,
    heightCanvas: 1334 / suofang,
    ratio: 750 / App.systemInfo.screenWidth,
    hasPassed: App.globalData.hasPassed,
  },
  onLoad(options) {
    if (!options.webviewurl) {
      util.alert('缺少分享URL参数', wx.navigateBack);
      return;
    }
    const optionsData = {
      title: options.title || '精彩内容',
      webviewurl: options.webviewurl.replace(encodeURIComponent('env=miniprogram'), ''),
      openInWeapp: !!options.openInWeapp,
    };
    this.setData({
      optionsData,
    });
    wx.hideShareMenu();
    setTimeout(this.changePic, 888);
  },
  changePic() {
    const idx = +new Date() % arrPoster.length;
    console.log('changePic idx:', idx);
    this.setData({
      posterBG: `https://wx2.sinaimg.cn/mw690/${arrPoster[idx]}.jpg`,
    });
  },
  previewImgLoaded() {
    this.setData({
      posterBGLoaded: this.data.posterBG,
    });
  },
  shareToMoment() {
    console.log('shareToMoment');
    this.generatePoster(this.data.optionsData.webviewurl);
  },
  getShortUrl(url) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://t.kainy.cn/api/v2/action/shorten',
        method: 'POST',
        data: {
          key: '580f1611c72478bc0a5e6a3a05eba9',
          response_type: 'json',
          url,
          // custom_ending: 'weapp',
        },
        success(res) {
          // console.log(res);
          resolve(res.data.result);
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
  generatePoster(url) {
    wx.showLoading({
      title: '海报合成中…',
      mask: true,
    });
    const positionX = 710 / suofang; // 610-二维码区块中心点位置
    const positionY = 1414 / suofang; // 1194-
    const widthQR = this.data.widthQR / suofang;
    const titleFontsize = 28 / suofang;
    // const widthAvatar = 47;
    // const widthAvatarBorder = widthAvatar + 9;
    this.getShortUrl(decodeURIComponent(url)).then((shortenUrl) => {
      let shortUrl = shortenUrl;
      if (this.data.optionsData.openInWeapp) {
        shortUrl = shortenUrl.replace('/t.kainy.cn/', '/kainy.cn/t/');
      }
      console.log(shortUrl);
      const ctx = wx.createCanvasContext('previewcanvas');
      // 这里是绘制灰色背景
      ctx.setFillStyle('#EEEEEE');
      ctx.fillRect(0, 0, this.data.widthCanvas, (this.data.heightCanvas + widthQR));
      // 绘制标题
      ctx.setFontSize(titleFontsize);
      ctx.setFillStyle('#000000');
      ctx.fillText(`《${util.textOverflow(this.data.optionsData.title, 17)}》`, 2 * titleFontsize / suofang, positionY - (titleFontsize * 1.2));
      ctx.setFillStyle('#aaaaaa');
      ctx.fillText('长按图片“识别二维码”查看原文👉', 2.3 * titleFontsize / suofang, positionY + (titleFontsize / 1.6)); // 6.7;
      const that = this;
      Promise.all([this.remoteToLocal(this.data.posterBG), this.drawQRCode(shortUrl)]).then(([pic, qrcode]) => {
        console.log(`draw1-画背景图:${+new Date()}`);
        ctx.drawImage(pic.tempFilePath, 0, 0, this.data.widthCanvas, this.data.heightCanvas);
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
    if (this.data.platform === 'devtools') {
      this.setData({
        result: tempFilePath,
      });
    }
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success(result) {
        console.log('saveImageToPhotosAlbum', result);
        util.alert('已为您成功保存图片到手机相册，可以去发布分享啦～', wx.navigateBack);
      },
      fail(res2) {
        if (res2.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
          util.alert('如需正常保存图片，请按确定并在授权管理中选中“保存到相册”，然后点按确定。返回后重新发起分享操作。', () => {
            wx.openSetting && wx.openSetting();
          });
        } else {
          console.error(res2);
        }
      },
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    const title = '推荐一篇文章希望对你有用'; // 推荐一个不错的内容 这篇文章写的超赞，值得一读
    const url = this.data.optionsData.webviewurl;
    const ret = {
      title,
      path: `/pages/webview/webview?webviewurl=${url}`,
      //imageUrl: '',
    };
    console.log('onShareAppMessage: ', ret);
    return ret;
  },
});
