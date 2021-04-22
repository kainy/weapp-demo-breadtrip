const api = require('../../utils/api.js');
const WxSearch = require('../../components/wxSearch/wxSearch.js');
const util = require('../../utils/util.js');

const App = getApp();
const pageSize = 17;
const arrKeyword = ['蜜月', '毕业', '跨年', '冲绳', '浪漫', '小清新']
Page({
  data: {
    elements: [],
    windowWidth: App.systemInfo.windowWidth,
    // searchResult: {
    //   trips: [],
    // },
    wxOpenSearch: {
      trips: [],
      nextPageInfo: null,
    },
    start: 0,
    trips_more: false,
    searching: false,
    searchFocus: false,
  },
  getKW() {
    return arrKeyword[Math.floor(arrKeyword.length * Math.random())]
  },
  onLoad(options) {
    const self = this;
    util.showLoading();
    WxSearch.init(this, 62, arrKeyword);
    WxSearch.initMindKeys(['香港', '澳门', '泰国', '德国', '北京', '英国', '法国', '哈尔滨', '三亚']);
    const keyw = decodeURIComponent(options.keyword || this.getKW())
    // if (options.keyword) {
      this.wxSearchFn(null, keyw);
    // }
    // api.getExplorePlaceList({
    //   success: (res) => {
    //     const dest = res.data;
    //     self.setData({
    //       elements: dest.elements,
    //       // searchFocus: true,
    //     });
    //     util.hideLoading();
    //   },
    // });
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
  viewPath(e) {
    const ds = e.currentTarget.dataset;
    const url = '/' + ds.path.replace('.html', '') + '&showBread=1'
    console.log('url:', url)
    wx.navigateTo({
      url
    });
  },
  wxSearchFn(e, kw, append) {
    const self = this;
    const temData = self.data.wxSearchData;
    kw = kw || temData.value; // eslint-disable-line
    kw = kw || this.getKW(); // eslint-disable-line
    wx.setNavigationBarTitle({
      title: `关于 ${kw} 的旅行信息，探索最佳旅行地、热门地点、欧美国家、港澳台、亚洲国家…`
    })
    if (!append) {
      // 搜索结果复位
      this.setData({
        start: 0,
        trips_more: false,
        // searchResult: {
        //   trips: [],
        // },
        wxOpenSearch: {
          trips: []
        },
        searching: true,
      });
    }
    if (!kw) {
      this.setData({
        // searchResult: {
        //   trips: [],
        // },
        wxOpenSearch: {
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
    // api.search({
    //   data: {
    //     key: kw,
    //     start: self.data.start,
    //     count: pageSize,
    //     data_type: 'trip',
    //   },
    //   success: (res) => {
    //     const len = res.data.data.trips.length;
    //     if (len) {
    //       self.setData({
    //         searchResult: {
    //           trips: self.data.searchResult.trips.concat(res.data.data.trips),
    //         },
    //         start: self.data.start + len,
    //         trips_more: res.data.data.trips_more,
    //       });
    //     } else {
    //       util.alert('未找到相关内容，换个关键词试试吧');
    //     }
    //     self.fetching = false;
    //     self.setData({
    //       searching: false,
    //     });
    //     // console.log(trips)
    //   },
    // });
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'search',
        keyword: kw,
        nextPageInfo: self.data.wxOpenSearch.nextPageInfo
      },
      success: res => {
        util.hideLoading();
        // console.warn(res, 88)
        const list = res.result.items.map((item, index) => {
          item.title = item.title.replace(/(\<em class\=\"highlight\"\>)|(\<\/em\>)/ig, '');
          item.day_count = Math.round(Math.random() * 12) + 3
          item.waypoints = Math.round(Math.random() * 56) + 7
          item.recommendations = Math.round(Math.random() * 789) + 10
          return item
        });
        const len = list.length;
        if (len) {
          self.setData({
            wxOpenSearch: {
              trips: self.data.wxOpenSearch.trips.concat(list),
              nextPageInfo: res.result.nextPageInfo,
              hitCount: res.result.hitCount
            },
            trips_more: !!res.result.hasNextPage,
          })
        } else {
          util.alert('未找到相关内容，换个关键词试试吧');
        }
        self.fetching = false;
        self.setData({
          searching: false,
        });
        // console.log(trips)
        
      }
    });
    WxSearch.wxSearchAddHisKey(self);
  },
  clearInput() {
    const temData = this.data.wxSearchData;
    temData.value = '';
    this.setData({
      wxSearchData: temData,
      searchFocus: true,
    });
  },
  wxSearchInput(e) {
    WxSearch.wxSearchInput(e, this);
  },
  wxSerchFocus(e) {
    WxSearch.wxSearchFocus(e, this);
  },
  wxSearchBlur() {
    // 微信 6.5.7 版本将blur 事件触发延后至 searchKeyTap 之后，导致搜索内容无法更新
    // WxSearch.wxSearchBlur(e, this);
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
