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

// 简单的节流函数
function throttle(func, wait, mustRun) {
  let timeout;
  let startTime = new Date();

  return function ret(...args) {
    const context = this;
    const curTime = new Date();

    clearTimeout(timeout);
    // 如果达到了规定的触发时间间隔，触发 handler
    if (curTime - startTime >= mustRun) {
      func.apply(context, args);
      startTime = curTime;
      // 没达到触发间隔，重新设定定时器
    } else {
      timeout = setTimeout(func, wait);
    }
  };
}
function alert(msg, cb) {
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
function params(qs) {
  return Object.keys(qs).map(i => `${i}=${qs[i]}`).join('&');
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
    duration: 10000,
    icon: 'loading',
    mask,
  };
  if (wx.showLoading) {
    wx.showLoading(options);
  } else {
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
  params,
  getOriginPageData,
  showLoading,
  hideLoading,
};
