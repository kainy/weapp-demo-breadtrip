const api = require('../../utils/api.js');
const WxSearch = require('../../components/wxSearch/wxSearch.js')

const App = getApp();
Page({
  data: {
    elements: [],
    windowWidth: App.systemInfo.windowWidth,
  },
  onReady() {
    WxSearch.init(this,43,['weappdev','小程序','wxParse','wxSearch','wxNotification']);
    WxSearch.initMindKeys(['weappdev.com','微信小程序开发','微信开发','微信小程序']);
  },
  onLoad() {
    const self = this;
    wx.showToast({
      title: '传送门开启中',
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
  wxSearchFn: function(e){
    var self = this
    api.search({
      data: {
        key: self.data.wxSearchData.value,
        start: 0,
        count: 20,
        data_type: ''
      },
      success: (res) => {
        const trips= res.data.data.trips
        console.log(trips)
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
