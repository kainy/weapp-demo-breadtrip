function formatNumber(n) {
  const num = n.toString();
  return num[1] ? num : `0${num}`;
}

function formatTime(date, type) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  let time = '';
  switch (type) {
    case 1:
      time = `${[year, month, day].map(formatNumber).join('.')}`;
      break;
    case 2:
      time = `${[year, month, day].map(formatNumber).join('.')} ${[hour, minute].map(formatNumber).join(':')}`;
      break;
    default:
      time = `${[year, month, day].map(formatNumber).join('.')} ${[hour, minute, second].map(formatNumber).join(':')}`;
  }
  return time;
}

// Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
function throttle(func, wait, options = {}) {
  let context,
    args,
    result;
  let timeout = null;
  let previous = 0;
  const later = function () {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function () {
    const now = Date.now();
    if (!previous && options.leading === false) previous = now;
    const remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}
function alert(msg = '', cb) {
  wx.showModal({
    title: '提示',
    content: msg,
    showCancel: false,
    success() {
      if (cb) {
        cb();
      }
    },
  });
}
function o2qs(o) {
  return Object.keys(o).map(i => `${i}=${o[i]}`).join('&');
}
function qs2o(str) {
  const obj = {};
  if (!str) return obj;
  const pairs = str.split('&');
  let pair;
  let pos;

  for (let i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos === -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] =
        decodeURIComponent(pair.slice(pos + 1));
    }
  }
  return obj;
}
function getCurrPage() {
  return getCurrentPages().slice(-1)[0];
}
function getOriginPageData() {
  const curPages = getCurrentPages();
  let data = null;
  if (curPages[curPages.length - 2]) {
    data = curPages[curPages.length - 2].data;
  }
  return data;
}
function showLoading(title = '传送门开启中', mask = false) {
  const options = {
    title,
    icon: 'loading',
    mask,
  };
  if (wx.showLoading) {
    wx.showLoading(options);
  } else {
    options.duration = 20000;
    wx.showToast(options);
  }
}
function hideLoading() {
  if (wx.hideLoading) {
    wx.hideLoading();
  } else {
    wx.hideToast();
  }
}
module.exports = {
  formatNumber,
  formatTime,
  throttle,
  alert,
  o2qs,
  qs2o,
  getOriginPageData,
  getCurrPage,
  showLoading,
  hideLoading,
};
