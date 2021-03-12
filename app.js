// require('./libs/ald-stat.js');
const AV = require('./libs/av-weapp.js');
const util = require('./utils/util.js');
const log = require('./utils/log.js');

AV.init({
  appId: '8RLDamMl5A27EOhFH2fU7AN0-gzGzoHsz', // {{appid}}
  appKey: 'gVpxIyNY3brM8JXwCTGSNeG3',
});

App({
  systemInfo: wx.getSystemInfoSync(),
  AV,
  log,
  onLaunch(options) {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      });
    }

    const self = this;
    this.getNetworkType();
    if (wx.onNetworkStatusChange) {
      wx.onNetworkStatusChange((res) => {
        self.globalData.networkType = res.networkType;
      });
    } else {
      setInterval(this.getNetworkType, 7777);
    }
    log.event('app onLaunch: ', options);
  },
  onShow(options) {
    if (options.scene) {
      this.globalData.scene = options.scene;
      // util.alert(`scene:${options.scene}`);
    }
    console.log('app onShow:', options);
  },
  getNetworkType() {
    const self = this;
    wx.getNetworkType({
      success(res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        if (self.globalData.networkType !== res.networkType) {
          self.globalData.networkType = res.networkType;
        }
        // console.log(7777777, self.globalData.networkType);
      },
    });
  },
  logQueue: [],
  // 过滤已知的、老旧版本导致的报错信息
  errFilter: ['hideToast:fail', 'getStorageSync:fail'],
  onError(error) {
    if (this.globalData.networkType === 'none') return; // 6.5.3 版本断网后持续报 “request:fail send request fail:Unable to resolve host” 错导致崩溃问题
    if (this.errFilter.indexOf(error) > -1) return;
    const log = new AV.Object('Log');
    const pageData = util.getCurrPage() && util.getCurrPage().data;
    this.loginOrSignup().then((user) => {
      if (!this.logQueue.length && pageData !== this.tempPageData) { // 页面数据变换后 && 列队首条设置公共信息，以节约流量
        log.set('submitter', user);
        log.set('systemInfo', this.systemInfo);
        log.set('pageData', pageData);
        this.tempPageData = pageData; // 缓存 pageData 用于比较
      }
      // console.log(log.attributes);
      try {
        // 上报业务代码错误信息
        // console.log(1111, error)
        if (this.systemInfo.platform === 'devtools') {
          log.set('jsError_dev', error);
        } else {
          log.set('jsError_prd', error);
        }
      } catch (e) {
        // 上报捕获代码错误信息
        // console.log(2222, e, e.message)
        log.set('jsError_catch', e.message);
      } finally {
        // 上报捕获代码报错时，的业务代码错误信息
        // console.log(3333, arguments[0])
        log.set('jsError_finally', error);
      }
      this.logQueue.push(log);
      util.throttle(this.sendLog, 2000, {
        leading: false,
        trailing: true,
      })();
    });
  },
  sendLog() {
    AV.Object.saveAll(this.logQueue);
    this.logQueue = [];
  },
  globalData: {
    userInfo: null,
    hasPassed: +new Date() > +new Date('02/14/2019 20:08:09'), // 预估时间
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
  syncUserInfo(user = AV.User.current()) {
    return new Promise((resolve, reject) => {
      const success = ({ userInfo }) => {
        // 更新当前用户的信息
        user.set(userInfo).save().then(() => {
          // 成功，此时可在控制台中看到更新后的用户信息
        }).catch((res) => {
          console.error(res);
          AV.User.logOut();
        });
        resolve(userInfo);
      };
      wx.login({
        success(res) {
          if (res.code) {
            wx.getUserInfo({
              success,
              fail(info) {
                console.warn(`获取用户信息失败！${info.errMsg}`);
                if (wx.openSetting) {
                  util.alert('同步微信头像失败，请在后续弹窗中勾选“用户信息”', () => {
                    wx.openSetting({
                      // todo: BUG解决
                      success: (resOS) => {
                        if (resOS.authSetting['scope.userInfo']) {
                          wx.getUserInfo({
                            success,
                            fail: reject,
                          });
                        } else {
                          util.alert('授权失败，操作无法完成，请重试。');
                          reject(resOS);
                        }
                      },
                      fail: reject,
                    });
                  });
                } else {
                  reject(info);
                }
              },
            });
          } else {
            console.log(`获取用户登录态失败！${res.errMsg}`);
          }
        },
        fail(res) {
          console.warn(res);
        },
      });
    });
  },
  async getOpenID() {
    if (this.globalData.openid) {
      return this.globalData.openid;
    }

    const { result } = await wx.cloud.callFunction({
      name: 'login',
    });
    this.globalData.openid = result.openid;
    if (result.userInfo) {
      this.globalData.userInfo = result.userInfo;
    }
    console.log('[getOpenID] 调用成功：', result);
    return result.openid;
  },
});

