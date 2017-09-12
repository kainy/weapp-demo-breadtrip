const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

const App = getApp();
const throttle = util.throttle;
Page({
  data: {
    trip: {
      waypoints: 17,
    },
    options: null,
    idxShow: 3, // 页面加载展示3张
    bgPlaying: false,
    windowWidth: App.systemInfo.windowWidth,
    windowHeight: App.systemInfo.windowHeight,
    bgMusic: '',
    preLoadImg: 7,
  },
  onReady() {
    const self = this;
    wx.setNavigationBarTitle({
      title: self.data.options.name,
    });
  },
  onLoad(options) {
    const self = this;
    const id = options.id;
    this.arrShow = [];
    this.arrLoadSucc = [];
    this.arrLoadFail = [];
    this.setData({
      options,
    });
    util.showLoading();
    wx.getSystemInfo({
      success(res) {
        if (App.systemInfo.windowHeight !== res.windowHeight) {
          self.setData({
            windowHeight: res.windowHeight,
          });
        }
      },
    });
    api.getTripInfoByID({
      query: {
        tripId: id,
      },
      success: (res) => {
        const trip = res.data;
        /* eslint-disable */
        for (const day of trip.days) {
          for (const wp of day.waypoints) {
            self.arrShow.push(wp.id);
            wp.idx = self.arrShow.length;
            wp.isLoadFail = false;
          }
        }
        const preLoadImg = Math.max(this.data.preLoadImg, Math.round(trip.waypoints / 9))
        /* eslint-enable */
        if (getCurrentPages().length === 1) {
          if (options.referrer) {
            this.icon = 'donate';
          } else {
            this.icon = 'homenav';
          }
        } else {
          this.icon = 'donate';
        }
        this.setData({
          icon: this.icon,
          trip,
          preLoadImg,
        });
        this.audioInit();
        util.hideLoading();
        return res;
      },
    });
  },
  onShow() {
    // 图片组件会暂停音乐播放，返回后继续
    if (this.data.bgPlaying) {
      this.audioCtx.play();
    }
  },
  audioInit() {
    if (['3g', '4g', 'wifi'].indexOf(App.globalData.networkType) === -1) {
      return;
    }
    const self = this;
    // 初始化背景乐播放器
    wx.request({
      url: 'https://kainy.cn/api/music/playlist/detail?id=616559806',
      success(res) {
        const arr = res.data.result.tracks;
        // const src = arr[self.data.options.id % arr.length].mp3Url;
        const id = arr[self.data.options.id % arr.length].id;
        // https://api.imjad.cn/cloudmusic/?type=song&id=2872271&br=198000
        // console.log(arr, self.data.options.id % arr.length, id);
        self.setData({ bgMusic: `https://api.imjad.cn/cloudmusic/?type=song&id=${id}&br=198000&raw=1` });
        // 使用 wx.createAudioContext 获取 audio 上下文 context
        self.audioCtx = wx.createAudioContext('myAudio');
        setTimeout(() => {
          self.setData({ bgPlaying: true });
          self.audioCtx.play();
        }, 1077);
      },
    });
  },
  audioCtrl() {
    if (this.data.bgPlaying) {
      this.setData({ bgPlaying: false });
      this.audioCtx.pause();
    } else {
      this.setData({ bgPlaying: true });
      this.audioCtx.play();
    }
  },
  bindscroll: throttle(function scrollFn(e) {
    if (!e) return;
    const height = e.detail.scrollHeight / this.data.trip.waypoints;
    const n = Math.round(e.detail.scrollTop / height) + this.data.preLoadImg; // 预加载图片数量
    if (n > this.data.idxShow) {
      this.setData({
        idxShow: Math.max(n, this.data.idxShow),
      });
      // console.log(this.arrShow, n, this.data.idxShow);
    }
  }, 1077, {}),
  errImg(e) {
    // console.log(e.type);
    const id = e.target.dataset.idx;
    // e.type 取值： load 、 error 、 tap
    if (this.data.idxShow > id) { // 基础库1.5.2后img src为空时触发error事件，需增加判断条件
      if (e.type === 'load') {
        this.arrLoadSucc.push(id);
        util.hideLoading();
      } else if ((e.type === 'tap') && (this.arrLoadSucc.indexOf(id) > -1)) { // 点击加载成功的图片应跳转
        this.viewWaypoint(e);
      } else if (e.type === 'tap') {
        util.showLoading('图片加载中');
        this.data.gIsLoadingImg = true;
        this.reloadErrImg(id);
      } else {
        this.arrLoadFail.push(id);
        // 节流时间间隔，每 977ms mark 一次错误图片；点击重载按钮后重新报错等待时长
        throttle(this.markErrImg, 1277, {
          leading: false,
          trailing: true,
        })();
      }
    }
  },
  reloadErrImg(id) {
    const trip = this.data.trip;
    /* eslint-disable */
    for (const day of trip.days) {
      for (const wp of day.waypoints) {
        if( id === wp.idx ) {
          wp.isLoadFail = false
          wp.photo_webtrip += '&_t=' + Date.now()
        }
      }
    }
    /* eslint-enable */
    this.setData({
      trip,
    });
  },
  markErrImg() {
    const trip = this.data.trip;
    /* eslint-disable */
    for (const day of trip.days) {
      for (const wp of day.waypoints) {
        if( this.arrLoadFail.indexOf(wp.idx) > -1) {
          wp.isLoadFail = true;
          // wp.photo_webtrip += '&_t=' + Date.now()
        }
      }
    }
    /* eslint-enable */
    if (this.arrLoadFail.length) {
      // console.log('2222 markErrImg invoked', this.arrLoadFail);
      this.setData({
        trip,
      });
      this.arrLoadFail = [];
      if (this.data.gIsLoadingImg) {
        util.showLoading('图片加载失败');
        this.data.gIsLoadingImg = false;
        setTimeout(util.hideLoading, 777);
      } else {
        util.hideLoading();
      }
    }
  },
  onShareAppMessage() {
    const opt = {
      title: `「${this.data.options.name}」`,
      desc: this.data.trip.days[0].waypoints[0].text,
      path: `/pages/trip/trip?id=${this.data.options.id}&name=${this.data.options.name}`,
    };
    // console.log(opt);
    return opt;
  },
  viewWaypoint(e) {
    const self = this;
    const ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../waypoint/waypoint?waypointId=${ds.waypoint}&tripId=${self.data.trip.id}`,
    });
  },
  gotoUser(e) {
    const userId = e.target.dataset.id;
    wx.navigateTo({
      url: `../user/user?id=${userId}`,
    });
  },
});
