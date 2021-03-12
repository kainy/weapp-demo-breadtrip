const App = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    title: '',
    pois: null,
    info: null,
    options: null,
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
    const type = options.type;
    const id = options.id;
    const name = options.name;
    util.showLoading();
    this.setData({
      title: name,
      options,
      pageLength: getCurrentPages().length,
    });
    this.getPlaceInfo(type, id);
  },
  onShareAppMessage() {
    const opt = {
      title: `查看${this.data.title}的热门地点和游记`,
      desc: `查看${this.data.title}的热门地点`,
      path: `/pages/destination/destination?type=${this.data.options.type}&id=${this.data.options.id}&name=${this.data.title}`,
    };
    console.log(opt);
    return opt;
  },
  onTheWay(e) {
    // console.log(e.currentTarget.dataset);
    util.alert('功能开发中，敬请期待…');
  },
  getPlaceInfo(type, id) {
    const self = this;
    api.getPlaceInfoByID({
      query: {
        type,
        id,
      },
      success: (res) => {
        const data = res.data;
        self.setData({
          info: data,
        });
        self.getPOI(type, id);
      },
      fail: wx.navigateBack,
    });
  },
  getPOI(type, id) {
    const self = this;
    api.getPlacePOIByID({
      query: {
        type,
        id,
        poiType: 'all',
      },
      success: (res) => {
        const pois = res.data.items;
        self.setData({
          pois,
        });
        util.hideLoading();
      },
      fail: wx.navigateBack,
    });
  },
  viewPOIList() {
    const self = this;
    wx.navigateTo({
      url: `../poi_list/poi_list?type=${self.data.info.type}&id=${self.data.info.id}&name=${self.data.title}`,
    });
  },
  viewTripList() {
    const self = this;
    wx.navigateTo({
      url: `../trip_list/trip_list?type=${self.data.info.type}&id=${self.data.info.id}&name=${self.data.title}`,
    });
  },
});
