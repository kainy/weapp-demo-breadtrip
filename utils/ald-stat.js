! function () {
  var t = "1.5",
    a = "log",
    s = require("./ald-stat-conf.js"),
    e = "";

  function _(t, a, s) {
    if (t[a]) {
      var e = t[a];
      t[a] = function (t) {
        s.call(this, t, a), e.call(this, t)
      }
    } else t[a] = function (t) {
      s.call(this, t, a)
    }
  }

  function n(t, a, s) {
    if (t[a]) {
      var e = t[a];
      t[a] = function (t) {
        var _ = e.call(this, t);
        return s.call(this, [t, _], a), _
      }
    } else t[a] = function (t) {
      s.call(this, t, a)
    }
  }
  var o = function (t) {
      wx.login({
        success: function (a) {
          wx.getUserInfo({
            success: function (a) {
              t(a)
            },
            fail: function () {},
            complete: function () {}
          })
        },
        fail: function () {},
        complete: function () {}
      })
    },
    l = function (t, s, e) {
      arguments[1] || (s = "GET"), arguments[2] || (e = "d.php");
      var _ = 0,
        n = function () {
          wx.request({
            url: "https://" + a + ".aldwx.com/" + e,
            data: t,
            method: s,
            fail: function () {
              2 > _ && (_++, n())
            }
          })
        };
      n()
    },
    r = function (a, e, _, n) {
      var o = {
        ak: s.app_key,
        uu: a.aldstat_uuid,
        at: a.aldstat_access_token,
        ts: Date.now(),
        tp: _,
        ev: e,
        nt: a.aldstat_network_type,
        pm: a.aldstat_phone_model,
        pr: a.aldstat_pixel_ratio,
        ww: a.aldstat_window_width,
        wh: a.aldstat_window_height,
        lang: a.aldstat_language,
        wv: a.aldstat_wechat_version,
        lat: a.aldstat_lat,
        lng: a.aldstat_lng,
        spd: a.aldstat_speed,
        v: t
      };
      n && (o.ct = n), a.aldstat_location_name && (o.ln = a.aldstat_location_name), a.aldstat_src && (o.sr = a.aldstat_src), a.aldstat_qr && (o.qr = a.aldstat_qr), l(o)
    };

  function d(t) {
    this.app = t
  }
  d.prototype.debug = function (t) {
    r(this.app, "debug", 0, t)
  }, d.prototype.warn = function (t) {
    r(this.app, "debug", 1, t)
  }, d.prototype.error = function (t) {
    r(this.app, "debug", 2, t)
  }, d.prototype.sendEvent = function (t, a) {
    g(a) ? r(this.app, "event", t) : r(this.app, "event", t, JSON.stringify(a))
  };
  var i = function () {
      this.aldstat = new d(this);
      var t = wx.getStorageSync("aldstat_src");
      t && (this.aldstat_src = t);
      var e = wx.getStorageSync("aldstat_uuid");
      e || (e = "" + Date.now() + Math.floor(1e7 * Math.random()), wx.setStorageSync("aldstat_uuid", e), this.aldstat_is_first_open = !0), this.aldstat_uuid = e, this.aldstat_timestamp = Date.now(), this.aldstat_showtime = Date.now(), this.aldstat_duration = 0, this.aldstat_access_token = "" + Date.now() + Math.floor(1e7 * Math.random());
      var _ = this;
      _.aldstat_refresh_count = 0, _.aldstat_error_count = 0, _.aldstat_bottom_count = 0, _.aldstat_page_count = 0, _.aldstat_first_page = 0;
      var n = function () {
          wx.getNetworkType({
            success: function (t) {
              _.aldstat_network_type = t.networkType
            },
            complete: r
          })
        },
        r = function () {
          wx.getSystemInfo({
            success: function (t) {
              _.aldstat_phone_model = t.model, _.aldstat_pixel_ratio = t.pixelRatio, _.aldstat_window_width = t.windowWidth, _.aldstat_window_height = t.windowHeight, _.aldstat_language = t.language, _.aldstat_wechat_version = t.version
            },
            complete: function () {
              u(), s.getUserinfo && i()
            }
          })
        },
        i = function () {
          o(function (t) {
            var a = wx.getStorageSync("aldstat_uuid");
            t.userInfo.uu = a, l(t.userInfo, "POST", "u.php")
          })
        },
        c = function () {
          wx.getLocation({
            type: "wgs84",
            success: function (t) {
              _.aldstat_lat = t.latitude, _.aldstat_lng = t.longitude, _.aldstat_speed = t.speed
            },
            complete: u
          })
        },
        u = function () {
          wx.request({
            url: "https://" + a + ".aldwx.com/l.php",
            data: {},
            method: "GET",
            success: function (t) {
              t.data.success && (_.aldstat_location_name = t.data.country + ":" + t.data.province + ":" + t.data.city)
            }
          })
        };
      n()
    },
    c = function (t, a) {
      var s = getApp();
      this.aldstat_error_count++, s.aldstat_error_count++
    },
    u = function () {
      this.aldstat_showtime = Date.now()
    },
    p = function (a, e) {
      var _ = this;
      _.aldstat_duration += Date.now() - _.aldstat_showtime;
      var n = {
        ak: s.app_key,
        uu: _.aldstat_uuid,
        at: _.aldstat_access_token,
        st: _.aldstat_timestamp,
        dr: _.aldstat_duration,
        et: Date.now(),
        pc: _.aldstat_page_count,
        fp: _.aldstat_first_page,
        lp: _.aldstat_last_page,
        rc: _.aldstat_refresh_count,
        bc: _.aldstat_bottom_count,
        sc: _.page_share_count,
        ec: _.aldstat_error_count,
        nt: _.aldstat_network_type,
        pm: _.aldstat_phone_model,
        pr: _.aldstat_pixel_ratio,
        ww: _.aldstat_window_width,
        wh: _.aldstat_window_height,
        lang: _.aldstat_language,
        wv: _.aldstat_wechat_version,
        lat: _.aldstat_lat,
        lng: _.aldstat_lng,
        spd: _.aldstat_speed,
        v: t,
        ev: "app"
      };
      _.aldstat_is_first_open && (n.ifo = "true"), _.aldstat_location_name && (n.ln = _.aldstat_location_name), _.aldstat_src && (n.sr = _.aldstat_src), _.aldstat_qr && (n.qr = _.aldstat_qr), _.ald_share_src && (n.sc = _.ald_share_src), l(n)
    },
    h = App;
  App = function (t) {
    _(t, "onLaunch", i), _(t, "onShow", u), _(t, "onHide", p), h(t)
  };

  function g(t) {
    for (var a in t) return !1;
    return !0
  }
  var f = function (a, e) {
      var _ = getApp(),
        n = this,
        o = {
          uu: _.aldstat_uuid,
          at: _.aldstat_access_token,
          v: t,
          ak: s.app_key,
          ev: "page",
          st: n.aldstat_start_time,
          dr: Date.now() - n.aldstat_start_time,
          rc: n.aldstat_refresh_count,
          bc: n.aldstat_bottom_count,
          pp: n.__route__,
          sc: n.page_share_count,
          ec: n.aldstat_error_count,
          nt: _.aldstat_network_type,
          pm: _.aldstat_phone_model,
          pr: _.aldstat_pixel_ratio,
          ww: _.aldstat_window_width,
          wh: _.aldstat_window_height,
          lang: _.aldstat_language,
          wv: _.aldstat_wechat_version,
          lat: _.aldstat_lat,
          lng: _.aldstat_lng,
          spd: _.aldstat_speed,
          v: t
        };
      n.aldstat_is_first_page && (o.ifp = "true"), _.aldstat_page_last_page && (o.lp = _.aldstat_page_last_page), _.aldstat_location_name && (o.ln = _.aldstat_location_name), n.aldstat_page_args && (o.ag = n.aldstat_page_args), _.aldstat_src && (o.sr = _.aldstat_src), _.aldstat_qr && (o.qr = _.aldstat_qr), l(o), _.aldstat_page_last_page = n.__route__
    },
    w = function (t, a) {
      var s = wx.getStorageSync("aldstat_src"),
        e = getApp();
      if (s && (e.aldstat_src = s), !g(t)) {
        "undefined" != typeof t.aldsrc && (s ? e.aldstat_qr = t.aldsrc : (wx.setStorageSync("aldstat_src", t.aldsrc), e.aldstat_src = t.aldsrc));
        var _ = wx.getStorageSync("aldstat_uuid");
        if ("undefined" == typeof t.ald_share_src) e.ald_share_src = _;
        else {
          var n = t.ald_share_src.split(",");
          n.length >= 3 && (n.shift(), t.ald_share_src = n.toString());
          for (var o = !1, l = 0; l < n.length; l++) n[l] == _ && (o = !0);
          e.ald_share_src = o ? t.ald_share_src : t.ald_share_src + "," + _
        }
        this.aldstat_page_args = JSON.stringify(t)
      }
    },
    v = function (t, a) {
      var s = getApp(),
        e = wx.getStorageSync(this.__route__);
      this.aldstat_start_time = Date.now(), this.aldstat_refresh_count = 0, this.aldstat_error_count = 0, this.aldstat_bottom_count = 0, this.page_share_count = "" === e ? 0 : e, s.aldstat_page_count ? s.aldstat_page_count++ : s.aldstat_page_count = 1, s.aldstat_first_page || (s.aldstat_first_page = this.__route__, this.aldstat_is_first_page = !0), s.aldstat_last_page = this.__route__
    },
    m = function (t, a) {
      var s = getApp();
      this.aldstat_refresh_count++, s.aldstat_refresh_count++
    },
    y = function (t, a) {
      var s = getApp();
      this.aldstat_bottom_count++, s.aldstat_bottom_count++
    },
    S = Page,
    x = function (t, a) {
      var s = getApp();
      if ("undefined" != typeof t) {
        var e = k(t[1].path),
          _ = wx.getStorageSync(this.__route__);
        t[1].path += Object.keys(e).length > 0 ? "&ald_share_src=" + s.ald_share_src : "?ald_share_src=" + s.ald_share_src, "" === _ ? (wx.setStorageSync(this.__route__, 1), this.page_share_count += 1, s.page_share_count = this.page_share_count) : (this.page_share_count = parseInt(wx.getStorageSync(this.__route__)) + 1, wx.setStorageSync(this.__route__, this.page_share_count), s.page_share_count = this.page_share_count), o(function (t) {
          var a = wx.getStorageSync("aldstat_uuid");
          t.userInfo.uu = a, l(t.userInfo, "POST", "u.php")
        })
      }
    },
    k = function (t) {
      var a = new Object;
      if (-1 != t.indexOf("?"))
        for (var s = t.split("?")[1], e = s.split("&"), _ = 0; _ < e.length; _++) a[e[_].split("=")[0]] = unescape(e[_].split("=")[1]);
      return a
    };
  Page = function (t) {
    _(t, "onLoad", w), _(t, "onUnload", f), _(t, "onShow", v), _(t, "onHide", f), _(t, "onPullDownRefresh", m), _(t, "onReachBottom", y), n(t, "onShareAppMessage", x), S(t)
  }
}();
