const app = getApp();
const { User, Query, Cloud } = app.AV;
const Order = require('../../model/order');
const util = require('../../utils/util.js');

Page({
  data: {
    orders: [],
    error: null,
    payDescription: '',
    referrer: '跨时空小程序',
  },
  onLoad() {
    util.showLoading();
    this.originPageData = util.getOriginPageData();
    let payDescription = '🍵 请作者喝碗茶。';
    if (this.originPageData && this.originPageData.options) {
      payDescription = `感谢 ${decodeURIComponent(this.originPageData.options.nickName || this.data.referrer)} 为我推荐精彩内容`;
    }
    this.setData({
      pageLength: getCurrentPages().length,
      payDescription,
    });
    return this.refreshOrders();
  },
  onPullDownRefresh() {
    return this.refreshOrders().then(wx.stopPullDownRefresh);
  },
  refreshOrders() {
    if (!User.current()) {
      return app.loginOrSignup().then(this.queryOrders);
    }
    return this.queryOrders();
  },
  queryOrders() {
    return new Query(Order)
      .equalTo('user', User.current())
      .equalTo('status', 'SUCCESS')
      .descending('createdAt')
      .find()
      .then((orders) => {
        this.setData({
          orders: orders.map(order => Object.assign(order.toJSON(), {
            paidAt: order.paidAt.toLocaleString(),
            queryString: (order.link && order.link.options) ? util.params(order.link.options) : '',
          })),
        });
        util.hideLoading();
      })
      .catch(console.error);
  },
  genOrderParams() {
    const ret = {
      amount: (app.systemInfo.platform === 'devtools') ? 1 : 100,
      payDescription: this.data.payDescription,
    };
    if (this.originPageData) {
      const options = this.originPageData.options;
      if (options && options.id) {
        ret.link = {
          page: 'pages/trip/trip',
          options,
        };
      }
      if (options && options.referrer) {
        ret.referrer = options.referrer;
      }
    }
    return ret;
  },
  donate() {
    util.showLoading('正在创建订单', true);
    Cloud.run('order', this.genOrderParams()).then((data) => {
      const payOpt = data;
      payOpt.success = () => {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
        });
        setTimeout(this.refreshOrders.bind(this), 1500);
      };
      payOpt.fail = ({ errMsg }) => {
        this.setData({ error: '支付失败，请稍后重试。' });
        console.warn(errMsg);
        util.hideLoading();
      };
      wx.requestPayment(payOpt);
    }).catch((error) => {
      this.setData({ error: error.message });
      util.hideLoading();
    });
  },
  onShareAppMessage() {
    const opt = {
      title: '体验小程序支付流程',
      path: 'pages/my-pay/pay',
    };
    console.log(opt);
    return opt;
  },
});
