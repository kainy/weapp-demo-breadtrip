require("./utils/ald-stat.js");

App({
  systemInfo: null,
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
  },
});

var app= getApp()
app.aldstat.debug('app.js')