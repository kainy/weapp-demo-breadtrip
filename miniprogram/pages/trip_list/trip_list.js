const App = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

const formatTime = util.formatTime;

Page({
  data: {
    title: '',
    type: null,
    id: null,
    trips: [],
    start: 0,
    loading: false,
    hasMore: true,
    windowWidth: App.systemInfo.windowWidth,
    windowHeight: App.systemInfo.windowHeight,
  },
  onReady() {
    const self = this;
    wx.setNavigationBarTitle({
      title: self.data.title,
    });
  },
  onLoad(options) {
    const self = this;
    const type = options.type;
    const id = options.id;
    const name = options.name;
    util.showLoading();
    this.setData({
      title: name,
      type,
      id,
      pageLength: getCurrentPages().length,
    });
    wx.setNavigationBarTitle({
      title: name,
    });
    wx.getSystemInfo({
      success(res) {
        self.setData({
          windowHeight: res.windowHeight,
        });
      },
    });
    this.getTrips(type, id);
  },
  onShareAppMessage() {
    const opt = {
      title: `查看${this.data.title}的精品游记`,
      desc: `查看${this.data.title}的精品游记`,
      path: `/pages/trip_list/trip_list?type=${this.data.type}&id=${this.data.id}&name=${this.data.title}`,
    };
    console.log(opt);
    return opt;
  },
  getTrips(type, id) {
    const self = this;
    const loading = self.data.loading;
    const hasMore = self.data.hasMore;
    if (loading || !hasMore) {
      return;
    }
    self.setData({
      loading: true,
    });
    const data = {
      start: self.data.start,
    };
    api.getPlaceTripByID({
      data,
      query: {
        type,
        id,
      },
      success: (res) => {
        let newList = res.data.items;
        newList.map((trip) => {
          const item = trip;
          item.date_added = formatTime(new Date(item.date_added * 1000), 1);
          return item;
        });
        newList = self.data.trips.concat(newList);
        const nextStart = res.data.next_start;
        if (nextStart) {
          self.setData({
            start: nextStart,
          });
        } else {
          self.setData({
            hasMore: false,
          });
        }
        self.setData({
          trips: newList,
          loading: false,
        });
        util.hideLoading();
      },
    });
  },
  loadMore() {
    const self = this;
    this.getTrips(self.data.type, self.data.id);
  },
  viewTrip(e) {
    const ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../trip/trip?id=${ds.id}&name=${ds.name}`,
    });
  },
});
