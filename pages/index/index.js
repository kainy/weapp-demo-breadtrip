const App = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

const formatTime = util.formatTime;

Page({
  data: {
    trips: [],
    start: 0,
    loading: false,
    windowWidth: App.systemInfo.windowWidth,
    windowHeight: App.systemInfo.windowHeight,
    scene: App.globalData.scene,
  },
  onLoad() {
    this.loadMore();
  },
  onPullDownRefresh() {
    this.loadMore(null, true);
  },
  onShareAppMessage() {
    return {
      title: '跨时空 ✈️ 旅行日志小程序',
      desc: '诗和远方 - 查看旅行日志，发现热门景点…',
      path: '/pages/index/index',
    };
  },
  loadMore(e, needRefresh) {
    const self = this;
    const loading = self.data.loading;
    const data = {
      next_start: self.data.start,
    };
    if (loading) {
      return;
    }
    self.setData({
      loading: true,
    });
    api.getHotTripList({
      data,
      success: (res) => {
        let newList = res.data.data.elements;
        newList.map((trip) => {
          const item = trip;
          item.data[0].date_added = formatTime(new Date(item.data[0].date_added * 1000), 1);
          return item;
        });
        if (needRefresh) {
          wx.stopPullDownRefresh();
        } else {
          newList = self.data.trips.concat(newList);
        }
        self.setData({
          trips: newList,
        });
        const nextStart = res.data.data.next_start;
        self.setData({
          start: nextStart,
          loading: false,
        });
      },
    });
  },
  viewTrip(e) {
    const ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../trip/trip?id=${ds.id}&name=${ds.name}`,
    });
  },
  launchAppError(e) {
    console.log(e.detail.errMsg);
  },
  onReachBottom() {
    this.loadMore();
  },
});
