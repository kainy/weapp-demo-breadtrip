require('./libs/ald-stat.js');
const AV = require('./libs/av-weapp.js');

AV.init({
  appId: '8RLDamMl5A27EOhFH2fU7AN0-gzGzoHsz', // {{appid}}
  appKey: 'gVpxIyNY3brM8JXwCTGSNeG3',
});

App({
  systemInfo: null,
  AV,
  onLaunch() {
    const self = this;
    wx.getSystemInfo({
      success(res) {
        self.systemInfo = res;
        // console.log(res);
        // const oldSys = JSON.stringify(wx.getStorageSync('sysInfo'));
        // const newSys = JSON.stringify(res);
        // if (oldSys !== newSys) {
        //   console.log('sysInfo changed:', `${oldSys}-->${newSys}`);
        //   setTimeout(() => {
        //     self.aldstat.debug(`${oldSys}-->${newSys}`);
        //   }, 0);
        // }
        // wx.setStorage({
        //   key: 'sysInfo',
        //   data: res,
        // });
      },
    });
    wx.getNetworkType({
      success(res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        self.globalData.networkType = res.networkType;
      },
    });
  },
  onError(error) {
    const log = new AV.Object('Log');
    this.loginOrSignup().then((user) => {
      log.set('submitter', user);
      log.set('systemInfo', this.systemInfo);
      try {
        // 上报业务代码错误信息
        // console.log(1111, error)
        if (this.systemInfo.platform === 'devtools') {
          log.set('jsError_dev', error);
        } else {
          log.set('jsError_prd', error);
        }
        log.save();
      } catch (e) {
        // 上报捕获代码错误信息
        // console.log(2222, e, e.message)
        log.set('jsError_catch', e.message);
        log.save();
        console.error(e);
      } finally {
        // 上报捕获代码报错时，的业务代码错误信息
        // console.log(3333, arguments[0])
        log.set('jsError_finally', arguments[0]);
        log.save();
      }
    });
  },
  globalData: {
    userInfo: null,
  },
  loginOrSignup() {
    return AV.Promise.resolve(AV.User.current()).then(user =>
        (user ? (user.isAuthenticated().then(authed => (authed ? user : null))) : null) // eslint-disable-line
      ).then(user =>
        user || AV.User.loginWithWeapp() // eslint-disable-line
      ).then((user) => {
        console.log('uid:', user.id);
        return user;
      })
      .catch(error => console.error(error.message));
  },
});

