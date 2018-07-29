// 参数传递路径：
//    分享操作： 网页 -postMessage-》小程序卡片
//    打开卡片： 小程序卡片 -querystring-》 网页
const util = require('../../utils/util.js');

Page({
  data: {
    src: '',
    // src: 'https://kainy.cn/miniprograms/KSK/loading.html',
    shareData: {},
  },
  onLoad(options) {
    if (!options.webviewurl) {
      util.alert('缺少分享URL参数', wx.navigateBack);
    }
    this.setData({
      options,
    });
    wx.hideShareMenu();
  },
  onMessage(e) {
    console.log('onMessage: ', e);
  },
  shareToMoment() {
    console.log('shareToMoment');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    const title = '推荐一个不错的内容';
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
