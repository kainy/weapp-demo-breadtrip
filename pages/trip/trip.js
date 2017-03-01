const api = require('../../utils/api.js');

const App = getApp();
Page({
  data: {
    trip: {
      waypoints: 17
    },
    options: null,
    arrShow: [],
    idxShow: 3, // 页面加载展示3张
    bgPlaying: false,
    bgMusic: ''
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
    self.setData({
      options,
      windowWidth: App.systemInfo.windowWidth,
      windowHeight: App.systemInfo.windowHeight + 57, //57 可能不准确，为避免底部留空
    });
    wx.showToast({
      title: '传送门开启中',
      icon: 'loading',
      duration: 10000,
    });
    api.getTripInfoByID({
      query: {
        tripId: id,
      },
      success: (res) => {
        const trip = res.data;
        for( let day of trip.days) {
          for( let wp of day.waypoints) {
            self.data.arrShow.push(wp.id)
            wp.idx = self.data.arrShow.length
          }
        }
        self.setData({
          trip,
        });
        wx.hideToast();
        this.audioInit();
      },
    });
  },
  onShow: function () {
    // 图片组件会暂停音乐播放，返回后继续
    if (this.data.bgPlaying) {
      this.audioCtx.play()
    }
  },
  audioInit: function () {
    if (['3g', '4g', 'wifi'].indexOf(App.globalData.networkType) === -1) {
      return
    }
    const self = this
    // 初始化背景乐播放器
    wx.request({
      url : 'https://kainy.cn/api/music/playlist/detail?id=616559806',
      success : function(res){
        const arr = res.data.result.tracks;
        const src = arr[self.data.options.id % arr.length].mp3Url
        self.setData({bgMusic : src})
        // 使用 wx.createAudioContext 获取 audio 上下文 context
        self.audioCtx = wx.createAudioContext('myAudio')
        self.setData({'bgPlaying': true})
        self.audioCtx.play()
      }
    })
  },
  audioCtrl: function () {
    if (this.data.bgPlaying) {
      this.setData({'bgPlaying': false})
      this.audioCtx.pause()
    } else {
      this.setData({'bgPlaying': true})
      this.audioCtx.play()
    }
  },
  bindscroll: function (e) {
    const height = e.detail.scrollHeight / this.data.trip.waypoints
    const n= Math.round(e.detail.scrollTop / height) + 7 //7 非准确值，为提前加载图片数
    this.setData({
      idxShow: Math.max(n, this.data.idxShow)
    })
    // console.log(n, this.data.idxShow)
  },
  onShareAppMessage: function () {
    const opt = {
      title: this.data.options.name,
      desc: this.data.trip.days[0].waypoints[0].text,
      path: `/pages/trip/trip?id=${this.data.options.id}&name=${this.data.options.name}`
    }
    console.log(opt)
    return opt
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
