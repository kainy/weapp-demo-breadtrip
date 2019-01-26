// 参数传递路径：
//    分享操作： 网页 -postMessage-》小程序卡片
//    打开卡片： 小程序卡片 -querystring-》 网页
const util = require('../../utils/util.js');

const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    // src: 'https://kainy.cn/miniprograms/KSK/loading.html',
    shareData: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('options: ', options);
    const strUrl = options.q || options.webviewurl || 'https://kainy.cn/miniprograms/KSK/share.html';

    if (strUrl) {
      const str = decodeURI(decodeURIComponent(strUrl));
      const oUrl = util.urlParser(str);
      console.log('oUrl: ', oUrl);
      const oParams = util.qs2o(oUrl.search.replace('?', '')); // 对应 webviewSDK.params
      // console.log(str, strQS, oParams);
      oParams.env = 'miniprogram'; // 增加参数用于网页判断小程序环境
      oParams.scene = App.globalData.scene; // 增加参数用于网页判断小程序环境
      oParams.extend = decodeURIComponent(options.extend || ''); // 增加分享页参数
      oParams._ = +new Date(); // 避免缓存
      let src = `${encodeURI(oUrl.url)}?${util.o2qs(oParams)}${oUrl.hash}`; // src 不能有汉字
      if (App.systemInfo.platform === 'devtools') {
        src = src.replace('https://kainy.cn/', 'http://localhost:8080/');
      }
      console.log('src: ', src);
      this.setData({
        src,
      });
    }
  },
  onMessage(e) {
    console.log('onMessage: ', e);
    const shareData = e.detail.data.pop();
    this.setData({
      shareData,
    });
  },
  // onMessage2(e) {
  //   console.log('onMessage: ', e);
  //   const data = e.detail.data.pop();
  //   if (data && data.action && data.option) {
  //     if (!this[data.action]) {
  //       throw new Error(`${data.action}: method not found`);
  //     } else {
  //       this[data.action](data.option);
  //     }
  //   } else {
  //     throw new Error('data.action or data.option missing');
  //   }
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const webviewData = wx.getStorageSync('_webviewData');
    if (webviewData) {
      const hash = encodeURIComponent(JSON.stringify(webviewData));
      this.setData({
        hash,
        flag: !this.data.flag,
      });
      wx.removeStorageSync('_webviewData');
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(options) {
    if (options.from === 'button') {
      // 来自页面内转发按钮
      console.log(options.target);
    }
    const title = this.data.shareData.title || '';
    const extend = encodeURIComponent(this.data.shareData.extend || '');
    // console.log(options, this.data.src);
    const url = encodeURIComponent(this.data.shareData.webviewurl || options.webViewUrl);
    const ret = {
      title,
      path: `/pages/webview/webview?webviewurl=${url}&extend=${extend}`,
    };
    console.log('onShareAppMessage: ', ret);
    return ret;
  },
});
