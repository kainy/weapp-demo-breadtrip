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
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            withCredentials: true,
            lang: true,
            success(res2) {
              console.log(res2.userInfo);
              this.loginSuccessCB(res2.userInfo);
            },
          });
        }
      },
    });
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo);
  },
  loginWithPhoneNumber(e) {
    // console.log(e);
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      qcloud.request({
        url: `${base}/weapp/loginWithPhoneNumber`,
        login: true,
        data: {
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
        },
        success: this.loginSuccessCB,
        fail: console.error,
      });
    } else {
      console.error(e.detail);
    }
  },
  // 用户登录示例
  login() {
    if (this.data.logged) return;

    util.showLoading('正在登录');
    const that = this;

    // 调用登录接口
    qcloud.login({
      success(result) {
        console.log(result);
        if (result) {
          util.hideLoading('登录成功');
          that.setData({
            userInfo: result,
            logged: true,
          });
          that.this.loginSuccessCB(result);
        } else {
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
              that.this.loginSuccessCB(res);
            },

            fail(error) {
              util.showModel('请求失败', error);
              console.log('request fail', error);
            },
          });
        }
      },

      fail(error) {
        util.showModel('登录失败', error);
        console.log('登录失败', error);
      },
    });
  },
  loginSuccessCB(res) {
    console.log(res);
    wx.reLaunch({
      url: `/pages/webview/webview?webviewurl=${encodeURIComponent(this.data.callback)}&extend=${JSON.stringify(res)}`,
    });
  },
});
