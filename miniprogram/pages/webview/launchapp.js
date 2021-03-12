// pages/webview/launchapp.js
const App = getApp();
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      extend: options.extend,
      scene: App.globalData.scene,
    });
  },
  launchAppError(e) {
    console.error(e.detail);
    let msg = e.detail.errMsg;
    if (/invalid scene/i.test(e.detail.errMsg)) { // 正常流程不应该出现此情况，建议在上一步判断，并隐藏入口
      msg = '小程序从 APP 分享消息卡片的场景打开时，才能唤起 APP';
    } else if (/sdk launch/i.test(e.detail.errMsg)) {
      msg = '请确认已安装最新版本APP';
    }
    util.alert(`唤起APP失败：${msg}`);
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
  onShareAppMessage() {

  },
});
