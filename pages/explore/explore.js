const api = require('../../utils/api.js');
const WxSearch = require('../../components/wxSearch/wxSearch.js');
const util = require('../../utils/util.js');

const App = getApp();
const pageSize = 17;
Page({
  data: {
    elements: [],
    windowWidth: App.systemInfo.windowWidth,
    searchResult: {
      trips: [],
    },
    start: 0,
    trips_more: false,
    searching: false,
  },
  onLoad(options) {
    const self = this;
    wx.showToast({
      title: '传送门开启中',
      icon: 'loading',
      duration: 10000,
    });
    WxSearch.init(this, 62, ['蜜月', '毕业', '跨年', '哈尔滨', '浪漫']);
    WxSearch.initMindKeys(['香港', '澳门', '泰国', '德国', '北京', '英国', '法国', '哈尔滨', '三亚']);
    if (options.keyword) {
      this.wxSearchFn(null, decodeURIComponent(options.keyword));
    }
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
  onShareAppMessage() {
    const kw = this.data.wxSearchData.value || '';
    const opt = {
      title: `发现${kw} ✈️ 跨时空旅行日志`,
      desc: '探索最佳旅行地、热门地点、欧美国家、港澳台、亚洲国家…',
      path: `/pages/explore/explore?keyword=${encodeURIComponent(kw)}`,
    };
    console.log(opt);
    return opt;
  },
  onReachBottom() {
    if (this.data.trips_more && !this.fetching) {
      this.wxSearchFn(null, null, true);
    }
  },
  viewPOI(e) {
    const data = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../destination/destination?type=${data.type}&id=${data.id}&name=${data.name}`,
    });
  },
  viewTrip(e) {
    const ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../trip/trip?id=${ds.id}&name=${ds.name}`,
    });
  },
  wxSearchFn(e, kw, append) {
    const self = this;
    const temData = self.data.wxSearchData;
    kw = kw || temData.value; // eslint-disable-line
    if (!append) {
      // 搜索结果复位
      this.setData({
        start: 0,
        trips_more: false,
        searchResult: {
          trips: [],
        },
        searching: true,
      });
    }
    if (!kw) {
      this.setData({
        searchResult: {
          trips: [],
        },
        searching: false,
      });
      WxSearch.wxSearchHiddenPancel(self);
      return;
    }
    temData.value = kw;
    this.setData({
      wxSearchData: temData,
    });

    self.fetching = true;
    api.search({
      data: {
        key: kw,
        start: self.data.start,
        count: pageSize,
        data_type: 'trip',
      },
      success: (res) => {
        if (res.data.status === 0) {
          const len = res.data.data.trips.length;
          if (len) {
            self.setData({
              searchResult: {
                trips: self.data.searchResult.trips.concat(res.data.data.trips),
              },
              start: self.data.start + len,
              trips_more: res.data.data.trips_more,
            });
          } else {
            util.alert('未找到相关内容，换个关键词试试 ？');
          }
        } else {
          util.alert(res.data.message);
        }
        self.fetching = false;
        self.setData({
          searching: false,
        });
        // console.log(trips)
      },
    });
    WxSearch.wxSearchAddHisKey(self);
  },
  wxSearchInput(e) {
    WxSearch.wxSearchInput(e, this);
  },
  wxSerchFocus(e) {
    WxSearch.wxSearchFocus(e, this);
  },
  wxSearchBlur(e) {
    WxSearch.wxSearchBlur(e, this);
  },
  wxSearchKeyTap(e) {
    WxSearch.wxSearchKeyTap(e, this, this.wxSearchFn);
  },
  wxSearchDeleteKey(e) {
    WxSearch.wxSearchDeleteKey(e, this);
  },
  wxSearchDeleteAll() {
    WxSearch.wxSearchDeleteAll(this);
  },
  wxSearchTap() {
    WxSearch.wxSearchHiddenPancel(this);
  },
});
