const api = require('../../utils/api.js');
const WxSearch = require('../../components/wxSearch/wxSearch.js')
const util = require('../../utils/util.js');

const App = getApp();
Page({
  data: {
    elements: [],
    windowWidth: App.systemInfo.windowWidth,
    searchResult: {
      trips: []
    },
  },
  onLoad(options) {
    const self = this;
    wx.showToast({
      title: '传送门开启中',
      icon: 'loading',
      duration: 10000,
    });
    WxSearch.init(this,62,['蜜月','毕业','跨年','哈尔滨','浪漫']);
    WxSearch.initMindKeys(['香港','澳门','泰国','德国','北京','英国','法国','哈尔滨','三亚']);
    if(options.keyword){
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
  onShareAppMessage: function () {
    var kw = this.data.wxSearchData.value || ''
    const opt = {
      title: `发现${kw} ✈️ 跨时空旅行日志`,
      desc: '探索最佳旅行地、热门地点、欧美国家、港澳台、亚洲国家…',
      path: `/pages/explore/explore?keyword=${encodeURIComponent(kw)}`
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
  viewTrip(e) {
    const ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../trip/trip?id=${ds.id}&name=${ds.name}`,
    });
  },
  wxSearchFn: function(e, kw){
    var self = this
    var temData = self.data.wxSearchData
    kw = kw || temData.value;
    if (!kw) {
      util.alert('请输入搜索内容')
      return
    } else {
      temData.value = kw
      this.setData({
        wxSearchData: temData
      })
    }
    api.search({
      data: {
        key: kw,
        start: 0,
        count: 20,
        data_type: 'trip'
      },
      success: (res) => {
        if(res.data.status == 0){
          self.setData({
            searchResult: {
              trips: res.data.data.trips
            }
          })
        } else {
          util.alert(res.data.message)
        }
        // console.log(trips)
      }
    })
    WxSearch.wxSearchAddHisKey(self);
    
  },
  wxSearchInput: function(e){
    var self = this
    WxSearch.wxSearchInput(e,self);
  },
  wxSerchFocus: function(e){
    var self = this
    WxSearch.wxSearchFocus(e,self);
  },
  wxSearchBlur: function(e){
    var self = this
    WxSearch.wxSearchBlur(e,self);
  },
  wxSearchKeyTap:function(e){
    var self = this
    WxSearch.wxSearchKeyTap(e,self);
    self.wxSearchFn();
  },
  wxSearchDeleteKey: function(e){
    var self = this
    WxSearch.wxSearchDeleteKey(e,self);
  },
  wxSearchDeleteAll: function(e){
    var self = this;
    WxSearch.wxSearchDeleteAll(self);
  },
  wxSearchTap: function(e){
    var self = this
    WxSearch.wxSearchHiddenPancel(self);
  }
});
