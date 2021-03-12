const log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null;

const aLog = async (msg, opts) => {
  const App = getApp();
  const openid = App ? await App.getOpenID() : '';
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const url = currentPage ? `/${currentPage.route}` : '';
  // opts: https://developer.matomo.org/api-reference/tracking-api#optional-action-info-measure-page-view-outlink-download-site-search
  const data = Object.assign({
    action_name: `${(App && App.globalData && App.globalData.userInfo && App.globalData.userInfo.nickName) || ''} ${url} : ${JSON.stringify(msg)}`,
    // rand: Math.random(),
    uid: openid,
    // url: 'https://kainy.cn/?url=' + url
  }, opts);
  if (App && App.systemInfo && App.systemInfo.brand === 'devtools') {
    console.log('aLog', data);
  } else {
    console.warn('aLog', data);
    wx.request({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      url: 'https://a.gqmg.com/matomo.php?rec=1&idsite=2',
      method: 'POST',
      data,
    });
  }
};

module.exports = {
  page() {
    aLog('page load');
  },
  aLog(msg = 'event', opts) {
    console.log('log.aLog: ', opts);
    aLog(msg, opts);
  },
  event(content = '', event = '') {
    const nickName = (App && App.globalData && App.globalData.userInfo && App.globalData.userInfo.nickName) || '';
    if (nickName) {
      content = `${nickName}-${content}`;
    }
    wx.reportAnalytics('trackevent', {
      content,
      event,
    });
    aLog('event', {
      e_c: 'TE',
      e_a: content,
      e_n: JSON.stringify(event),
    });
    log.info(content, event);
    log.setFilterMsg('trackevent');
    console.log('[trackEvent]: ', content, event);
  },
  debug() {
    if (!log) return;
    log.debug(...arguments);
  },
  info() {
    if (!log) return;
    log.info(...arguments);
  },
  warn() {
    if (!log) return;
    log.warn(...arguments);
  },
  error() {
    if (!log) return;
    log.error(...arguments);
  },
  setFilterMsg(msg) { // 从基础库2.7.3开始支持
    if (!log || !log.setFilterMsg) return;
    if (typeof msg !== 'string') return;
    log.setFilterMsg(msg);
  },
};

wx.onAppRoute && wx.onAppRoute((res) => {
  console.warn('onAppRoute', res);
  aLog('route', {
    e_c: res.openType,
    e_a: res.path,
    e_n: JSON.stringify(res.query),
  });
});
