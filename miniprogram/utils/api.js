const apiURL = 'https://trip.kainy.cn';
// const apiURL = 'https://api.breadtrip.com';
// const apiURL = 'https://kainy.cn/api/trip';
const util = require('./util.js');

const App = getApp();

const wxRequest = (params, url) => {
  wx.request({
    url,
    method: params.method || 'GET',
    data: params.data || {},
    header: {
      Accept: 'application/json',
    },
    success(res) {
      if (params.success) {
        // console.log(res);
        if (res.statusCode == 200) {  // 网络问题报错
          if (res.data.status && res.data.status != 0) { // 业务逻辑报错
            res.data.message && util.alert(res.data.message);
          }
          params.success(res);
        } else {
          App.onError(`Fail API: ${url}\r\nreturn: ${JSON.stringify(res)}`);
          util.alert(res.data || '服务器响应异常，请稍后再试');
        }
      }
    },
    fail(res) {
      util.alert('数据加载失败，请确认网络连接顺畅或稍后重试', () => {
        if (params.fail) {
          params.fail(res);
        } else {
          // wx.navigateBack();
        }
      });
    },
    complete(res) {
      if (params.complete) {
        params.complete(res);
      }
    },
  });
};

const getHotTripList = (params) => {
  wxRequest(params, `${apiURL}/v2/index/`);
};
const getExplorePlaceList = (params) => {
  wxRequest(params, `${apiURL}/destination/v3/`);
};
const getPlaceInfoByID = (params) => {
  wxRequest(params, `${apiURL}/destination/place/${params.query.type}/${params.query.id}/`);
};
const getPlacePOIByID = (params) => {
  wxRequest(params, `${apiURL}/destination/place/${params.query.type}/${params.query.id}/pois/${params.query.poiType}/`);
};
const getTripInfoByID = (params) => {
  wxRequest(params, `${apiURL}/trips/${params.query.tripId}/waypoints/`);
};
const getPlaceTripByID = (params) => {
  wxRequest(params, `${apiURL}/destination/place/${params.query.type}/${params.query.id}/trips/`);
};
const getUserInfoByID = (params) => {
  wxRequest(params, `${apiURL}/users/${params.query.userId}/v2`);
};
const getWaypointInfoByID = (params) => {
  wxRequest(params, `${apiURL}/trips/${params.query.tripId}/waypoints/${params.query.waypointId}/`);
};
const getWaypointReplyByID = (params) => {
  wxRequest(params, `${apiURL}/trips/${params.query.tripId}/waypoints/${params.query.waypointId}/replies/`);
};
const search = (params) => {
  wxRequest(params, `${apiURL}/v2/search/`);
};

module.exports = {
  getHotTripList,
  getExplorePlaceList,
  getPlaceInfoByID,
  getPlacePOIByID,
  getTripInfoByID,
  getPlaceTripByID,
  getUserInfoByID,
  getWaypointInfoByID,
  getWaypointReplyByID,
  search,
};
