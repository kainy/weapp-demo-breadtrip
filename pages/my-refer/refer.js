/*
 * @Author: kainyguo (gt@kainy.cn)
 * @Date: 2017-04-16 17:17:49
 * @Last Modified by: kainyguo (gt@kainy.cn)
 * @Last Modified time: 2017-04-16 22:02:26
 */
const util = require('../../utils/util.js');

const App = getApp();
Page({
  onLoad() {
    App.loginOrSignup().then((userInfo) => {
      this.setData({
        userInfo,
      });
      const options = util.getLastPageOptions();
      console.log(options);
    });
  },
})
;
