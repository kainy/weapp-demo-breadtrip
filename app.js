require("./utils/ald-stat.js");
const AV = require('./libs/av-weapp.js');

App({
  systemInfo: null,
  AV: AV,
  onLaunch() {
    const self = this;
    self.aldstat.debug('launched');
    wx.getSystemInfo({
      success(res) {
        self.systemInfo = res;
        var oldSys = JSON.stringify(wx.getStorageSync('sysInfo'));
        var newSys = JSON.stringify(res)
        if(oldSys !== newSys){
          console.log('sysInfo changed:' , oldSys + '-->' + newSys)
          setTimeout(function(){
            self.aldstat.debug(oldSys + '-->' + newSys)
          }, 0)
        }
        wx.setStorage({
          key: 'sysInfo',
          data: res
        })
      },
    });
    wx.getNetworkType({
      success: function(res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        self.globalData.networkType = res.networkType
      }
    })
  },
  getUserInfo:function(cb){
    var self = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              self.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(self.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  }
});

var app= getApp()
app.aldstat.debug('app.js')

AV.init({ 
 appId: '8RLDamMl5A27EOhFH2fU7AN0-gzGzoHsz', //{{appid}}
 appKey: 'gVpxIyNY3brM8JXwCTGSNeG3', 
});