const api = require('../../utils/api.js');

const App = getApp();
Page({
  data: {
    elements: [],
    windowWidth: App.systemInfo.windowWidth,
  },
  onReady() {
  },
  onLoad() {
    const self = this;
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 10000,
    });
    api.getExplorePlaceList({
      success: (res) => {
        const dest = res.data;
        self.setData({
          elements: dest.elements,
        });
        wx.hideToast();
      },
    });
  },
  onShareAppMessage: function () {
    const opt = {
      title: '发现 ✈️ 跨时空小程序',
      desc: '发现最佳旅行地、热门地点、欧美国家、港澳台、亚洲国家…',
      path: `/pages/explore/explore`
    }
    console.log(opt)
    return opt
  },
  viewPOI(e) {
    const data = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../destination/destination?type=${data.type}&id=${data.id}&name=${data.name}`,
    });
  },
});
