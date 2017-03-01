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
    bgMusic: {}
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
    // 初始化背景乐播放器
    this.setData({
      bgMusic: [{
          poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
          name: '此时此刻',
          author: '许巍',
          src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
        },{
          src: 'http://sc1.111ttt.com/2016/5/12/10/205101118503.mp3'
        },{
          src: 'http://sc1.111ttt.com/2016/5/12/10/205100814018.mp3'
        },{
          src: 'http://sc1.111ttt.com/2016/5/12/10/205101044092.mp3'
        },{
          src: 'http://sc1.111ttt.com/2016/1/12/10/205101123180.mp3'
        },{
          src: 'http://sc1.111ttt.com/2016/1/12/10/205100059540.mp3'
        }][this.data.options.id % 6]
    })
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
    this.setData({'bgPlaying': true})
    this.audioCtx.play()
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
