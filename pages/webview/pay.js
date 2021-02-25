const app = getApp();
const { User, Cloud } = app.AV;
const util = require('../../utils/util.js');

Page({
  data: {
    error: null,
    payDescription: '',
  },
  /*
  options:
    title: 支付项目
    amount：金额
    autoPay：是否页面加载后自动创建订单
  */
  onLoad(options) {
    console.log('onload options:', options);
    const payDescription = decodeURIComponent(options.title || '微信公众号 Kainy').replace(/\+/g, ' ');
    const noticeTitle = decodeURIComponent(options.noticeTitle || '');
    const noticeRemark = decodeURIComponent(options.noticeRemark || '');
    const amount = options.amount || 1;
    const callback = decodeURIComponent(options.callback || '');
    let dataPackage = this.handleDataPackage(options.package || '');
    const autoPay = options.autoPay === 'Y';
    if (!callback) {
      util.alert('缺少必要参数!', wx.navigateBack);
    }
    if (dataPackage) {
      dataPackage = JSON.parse(dataPackage);
    }
    this.setData({
      payDescription,
      amount,
      noticeTitle,
      noticeRemark,
      autoPay,
      callback,
      dataPackage,
      options,
    });
    if (autoPay) {
      this.donate();
    }
  },
  handleDataPackage(str) {
    let ret = '{}';
    if (str.indexOf('%7B%22') === 0) {
      ret = decodeURIComponent(str);
    } else if (str.indexOf('%257B%2522') === 0) {
      ret = decodeURIComponent(decodeURIComponent(str));
    } else if (str.indexOf('%25257B%252522') === 0) {
      ret = decodeURIComponent(decodeURIComponent(decodeURIComponent(str)));
    }
    return ret;
  },
  genOrderParams() {
    const ret = {
      amount: Number(this.data.amount),
      payDescription: this.data.payDescription,
      link: {
        noticeJumpUrl: `pages/webview/webview?webviewurl=${encodeURIComponent(this.data.callback)}&extend=`,
        options: {
          title: this.data.noticeTitle, // 模板消息-商品名称
          name: this.data.payDescription, // 模板消息-服务信息名称
          remark: this.data.noticeRemark, // 模板消息-备注
        },
      },
    };
    return ret;
  },
  donate() {
    if (!User.current()) {
      return app.loginOrSignup().then(this.requestPayment).catch(console.error);
    }
    return this.requestPayment();
  },
  requestPayment() {
    util.showLoading('正在创建订单', true);
    const succCB = (orderParams) => {
      console.log('orderParams to requestPayment: ', orderParams);
      wx.showToast({
        title: '支付成功',
        icon: 'success',
        duration: 2500,
        complete: () => {
          wx.reLaunch({
            url: `/pages/webview/webview?webviewurl=${encodeURIComponent(this.data.callback)}&extend=${encodeURIComponent((orderParams.package || '').replace('prepay_id=', ''))}`,
          });
        },
      });
    };
    // succCB(); return;
    Cloud.run('order', this.genOrderParams()).then((data) => {
      console.log('Cloud genOrderParams: ', data);
      const payOpt = data;
      payOpt.success = () => {
        succCB(data);
      };
      payOpt.fail = ({ errMsg }) => {
        if (errMsg.indexOf('fail cancel') < 0) {
          this.setData({ error: '支付失败，请稍后重试。' });
        }
        console.warn(errMsg);
      };
      util.hideLoading();
      wx.requestPayment(payOpt);
    }).catch((error) => {
      this.setData({ error: error.message });
      User.logOut();
      util.hideLoading();
    });
  },
  cancel() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack();
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      });
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(options) {
    if (options.from === 'button') {
      // 来自页面内转发按钮
      console.log(options.target);
    }
    const title = '老铁，帮忙买个单呗 😁';
    // console.log(options, this.data.src);
    const ret = {
      title,
      path: `pages/webview/pay?${util.o2qs(this.data.options)}`,
    };
    console.log('onShareAppMessage: ', ret);
    return ret;
  },
  onShareTimeline() {
    const title = '江湖救及，求代付～';
    // console.log(options, this.data.src);
    const ret = {
      title,
      path: `pages/webview/pay?${util.o2qs(this.data.options)}`,
    };
    console.log('onShareAppMessage: ', ret);
    return ret;
  },
  // onShareAppMessage() {
  //   const opt = {
  //     title: '体验小程序支付流程',
  //     path: 'pages/my-pay/pay',
  //   };
  //   console.log(opt);
  //   return opt;
  // },
});
