const App = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

const formatTime = util.formatTime;

Page({
  data: {
    trips: [],
    user_info: null,
    windowWidth: App.systemInfo.windowWidth,
    windowHeight: App.systemInfo.windowHeight,
  },
  onLoad(options) {
    const self = this;
    const userId = options.id || self.data.userId;
    util.showLoading();
    api.getUserInfoByID({
      query: {
        userId,
      },
      success: (res) => {
        const trips = res.data.trips;
        trips.map((trip) => {
          const item = trip;
          item.date_added = formatTime(new Date(item.date_added * 1000), 1);
          return item;
        });
        self.setData({
          trips,
          userId: res.data.userId,
          user_info: res.data.user_info,
          pageLength: getCurrentPages().length,
        });
        wx.setNavigationBarTitle({
          title: res.data.user_info.name,
        });
        util.hideLoading();
      },
    });
  },
  onShareAppMessage() {
    const opt = {
      title: `查看用户 ${this.data.user_info.name} 的旅行日志`,
      desc: `查看用户 ${this.data.user_info.name} 的旅行日志`,
      path: `/pages/user/user?id=${this.data.user_info.id}`,
    };
    console.log(opt);
    return opt;
  },
  viewTrip(e) {
    const ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../trip/trip?id=${ds.id}&name=${ds.name}`,
    });
  },
});
