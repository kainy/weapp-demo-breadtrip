/*
 * @Author: kainyguo (gt@kainy.cn)
 * @Date: 2017-04-16 17:17:49
 * @Last Modified by: kainyguo (gt@kainy.cn)
 * @Last Modified time: 2017-04-17 14:40:34
 */
const util = require('../../utils/util.js');

const App = getApp();
Page({
  data: {
    tripName: '',
    pagePath: '',
    coverImage: '',
  },
  onLoad() {
    App.loginOrSignup().then((userInfo) => {
      this.setData({
        userInfo,
      });
      const data = util.getOriginPageData();
      // console.log(data, this.data.userInfo);
      this.setData({
        tripName: `「${data.trip.name}」 ${data.trip.days[0].waypoints[0].text}`,
        pagePath: `/pages/trip/trip?id=${data.trip.id}&name=${data.trip.name}&referrer=${userInfo.get('objectId')}`,
        coverImage: data.trip.cover_image,
      });
    });
  },
  onShareAppMessage() {
    const opt = {
      title: '我发现这篇游记很好，非常适合你哦',
      desc: '我发现这篇游记很好，非常适合你哦',
      path: this.data.pagePath,
    };
    console.log(opt);
    return opt;
  },
})
;
