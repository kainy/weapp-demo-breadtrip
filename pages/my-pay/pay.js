const app = getApp();
const { User, Query, Cloud } = app.AV;
const Order = require('../../model/order');

Page({
  data: {
    orders: [],
    error: null,
  },
  onLoad() {
    return this.refreshOrders();
  },
  onPullDownRefresh() {
    return this.refreshOrders().then(wx.stopPullDownRefresh);
  },
  refreshOrders() {
    return new Query(Order)
      .equalTo('user', User.current())
      .equalTo('status', 'SUCCESS')
      .descending('createdAt')
      .find()
      .then(orders => this.setData({
        orders: orders.map(order => Object.assign(order.toJSON(), {
          paidAt: order.paidAt.toLocaleString(),
        })),
      }))
      .catch(console.error);
  },
  donate() {
    wx.showToast({
      title: '正在创建订单',
      icon: 'loading',
      duration: 10000,
      mask: true,
    });
    Cloud.run('order').then((data) => {
      const payOpt = data;
      wx.hideToast();
      payOpt.success = () => {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1500,
        });
        setTimeout(this.refreshOrders.bind(this), 1500);
      };
      payOpt.fail = ({ errMsg }) => this.setData({ error: errMsg });
      wx.requestPayment(payOpt);
    }).catch((error) => {
      this.setData({ error: error.message });
      wx.hideToast();
    });
  },
});
