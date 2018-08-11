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
    console.log(options);
    const payDescription = options.title || '🍵 请作者喝碗茶。';
    const nodiceTitle = options.nodiceTitle;
    const nodiceRemark = options.nodiceRemark;
    const amount = options.amount || 0.01;
    const callback = options.callback || '';
    const autoPay = options.autoPay === 'Y';
    if (!callback) {
      util.alert('缺少必要参数!', wx.navigateBack);
    }
    this.setData({
      payDescription,
      amount,
      nodiceTitle,
      nodiceRemark,
      autoPay,
      callback,
    });
    if (autoPay) {
      this.donate();
    }
  },
  genOrderParams() {
    const ret = {
      amount: this.data.amount,
      payDescription: this.data.payDescription,
      link: {
        noticeJumpUrl: `/pages/webview/webview?webviewUrl=${this.data.callback}&extend=`,
        options: {
          title: this.data.nodiceTitle, // 模板消息-商品名称
          name: this.data.payDescription, // 模板消息-服务信息名称
          remark: this.data.nodiceRemark, // 模板消息-备注
        },
      },
    };
    return ret;
  },
  donate() {
    util.showLoading('正在创建订单', true);
    const succCB = (orderParams) => {
      console.log(orderParams);
      wx.showToast({
        title: '支付成功',
        icon: 'success',
        duration: 2500,
        complete: () => {
          wx.redirectTo({
            url: `/pages/webview/webview?webviewUrl=${this.data.callback}&extend=${encodeURIComponent(orderParams.package)}`,
          });
        },
      });
    };
    // succCB(); return;
    Cloud.run('order', this.genOrderParams()).then((data) => {
      console.log(data);
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
    wx.navigateBack();
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
