// 参数传递路径：
//    分享操作： 网页 -postMessage-》小程序卡片
//    打开卡片： 小程序卡片 -querystring-》 网页
const util = require('../../utils/util.js');

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
    // console.log(options);
    const strUrl = options.q || options.webviewurl;

    if (strUrl) {
      const str = decodeURIComponent(strUrl);
      const strQS = str.indexOf('?') < 0 ? '' : str.replace(/[^?]+\?/, '');
      const oUrl = util.qs2o(strQS); // 增加分享页参数
      // console.log(str, strQS, oUrl);
      oUrl.env = 'miniprogram'; // 增加参数用于网页判断小程序环境
      oUrl.input = options.input || '';
      const url = `${str.split('?')[0]}?${util.o2qs(oUrl)}`;
      const src = decodeURIComponent(url);
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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
    const title = `${this.data.shareData.title}: ${this.data.shareData.input}`;
    const input = this.data.shareData.input || '';
    // console.log(options.webViewUrl, this.data.src);
    const url = encodeURIComponent(options.webViewUrl);
    const ret = {
      title,
      path: `/pages/webview/webview?webviewurl=${url}&input=${input}`,
    };
    console.log('onShareAppMessage: ', ret);
    return ret;
  },
});
