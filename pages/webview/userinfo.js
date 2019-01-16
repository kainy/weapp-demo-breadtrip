const qcloud = require('../../vendor/wafer2-client-sdk/index');

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
            },
          });
        }
      },
    });
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo);
  },
  getPhoneNumber(e) {
    qcloud.setLoginUrl('http://localhost:5757/weapp/login');
    // qcloud.setLoginUrl('https://687100841.zaniliazhao.cn/weapp/login');
    console.log(e);
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      qcloud.request({
        url: 'http://localhost:5757/weapp/getPhoneNumber',
        login: true,
        data: {
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
        },
        success(res) {
          console.log(res);
        },
        fail: console.error,
      });
    } else {
      console.error(e.detail);
    }
  },
});
