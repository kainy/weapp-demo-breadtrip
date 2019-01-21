const qcloud = require('../../vendor/wafer2-client-sdk/index');
const util = require('../../utils/util.js');

const App = getApp();
const base = App.systemInfo.platform === 'devtools' ? 'http://localhost:5757' : 'https://687100841.zaniliazhao.cn';
qcloud.setLoginUrl(`${base}/weapp/login`);

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad() {
    // 查看是否授权
    // const that = this;
    // wx.getSetting({
    //   success(res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         withCredentials: true,
    //         lang: true,
    //         success(res2) {
    //           console.log(res2.userInfo);
    //           that.loginSuccessCB(res2.userInfo);
    //         },
    //       });
    //     } else if (wx.openSetting) {
    //       util.alert('请在后续弹窗中勾选“用户信息”', () => {
    //         wx.openSetting({
    //           // todo: BUG解决
    //           success: (resOS) => {
    //             if (resOS.authSetting['scope.userInfo']) {
    //               wx.getUserInfo({
    //                 withCredentials: true,
    //                 lang: true,
    //                 success(res2) {
    //                   console.log(res2.userInfo);
    //                   that.loginSuccessCB(res2.userInfo);
    //                 },
    //               });
    //             } else {
    //               util.alert('授权失败');
    //             }
    //           },
    //         });
    //       });
    //     }
    //   },
    // });
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo);
  },
  loginWithPhoneNumber(e) {
    // console.log(e);
    const that = this;
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      qcloud.request({
        url: `${base}/weapp/loginWithPhoneNumber`,
        login: true,
        data: {
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
        },
        success(res) {
          console.log('loginWithPhoneNumber: ', res);
          that.loginSuccessCB(res.data.data);
        },
        fail: this.loginFailCB,
      });
    } else {
      console.error(e.detail);
    }
  },
  // 用户登录示例
  login(e) {
    if (this.data.logged || e.detail.errMsg.indexOf('deny') > -1) return;
    util.showLoading('正在登录');
    const that = this;
    // 调用登录接口
    qcloud.login({
      success(result) {
        console.log('qcloud.login: ', result);
        // if (result) {
        //   util.hideLoading('登录成功');
        //   that.setData({
        //     userInfo: result,
        //     logged: true,
        //   });
        //   that.loginSuccessCB(result);
        // } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
        qcloud.request({
          url: `${base}/weapp/user`,
          login: true,
          success(res) {
            util.hideLoading('登录成功');
            that.setData({
              userInfo: res.data.data,
              logged: true,
            });
            that.loginSuccessCB(res.data.data);
          },
          fail: this.loginFailCB,
        });
        // }
      },
      fail: that.loginDenyHandler,
    });
  },
  loginSuccessCB(info) {
    console.log(info);
    // util.alert(info.nickName);
    wx.setStorageSync('_webviewData', info);
    wx.navigateBack();
    // wx.reLaunch({
    //   url: `/pages/webview/webview?webviewurl=${encodeURIComponent(this.data.callback)}&extend=${JSON.stringify(res)}`,
    // });
  },
  loginFailCB(error) {
    util.hideLoading();
    util.alert('登录失败');
    console.error('request fail', error);
  },
  loginDenyHandler(error) {
    util.hideLoading();
    if (error.type === 'ERR_WX_GET_USER_INFO') {
      if (wx.openSetting) {
        util.alert('请在后续弹窗中勾选“用户信息”', () => {
          wx.openSetting({
            // todo: BUG解决
            success: (resOS) => {
              if (resOS.authSetting['scope.userInfo']) {
                util.alert('授权成功，请点击登录按钮');
              } else {
                util.alert('授权失败');
              }
            },
          });
        });
      }
    } else {
      util.alert(`登录失败: ${error.type}`);
    }
  },
});
