! function () {
  var t = "5.2",
    a = "log",
    e = require("./ald-stat-conf.js"),
    s = 0,
    n = 0,
    o = 0,
    d = 0;

  function _(t) {
    var a = wx.getStorageSync("aldstat_uuid");
    return a || (a = "" + Date.now() + Math.floor(1e7 * Math.random()), wx.setStorageSync("aldstat_uuid", a), t.aldstat_is_first_open = !0), a
  }

  function r() {
    wx.request({
      url: "https://" + a + ".aldwx.com/config/app.json",
      header: {
        AldStat: "MiniApp-Stat"
      },
      method: "GET",
      success: function (t) {
        if (200 === t.statusCode)
          for (var a in t.data) wx.setStorageSync(a, t.data[a])
      }
    })
  }

  function i(t, a, e) {
    if (t[a]) {
      var s = t[a];
      t[a] = function (t) {
        e.call(this, t, a), s.call(this, t)
      }
    } else t[a] = function (t) {
      e.call(this, t, a)
    }
  }

  function l(t, a, e) {
    if (t[a]) {
      var s = t[a];
      t[a] = function (t) {
        var n = s.call(this, t);
        return e.call(this, [t, n], a), n
      }
    } else t[a] = function (t) {
      e.call(this, t, a)
    }
  }
  var c = function (t) {
      wx.login({
        success: function (a) {
          wx.getUserInfo({
            success: function (a) {
              t(a)
            }
          })
        }
      })
    },
    p = function (t, e, n) {
      "undefined" == typeof arguments[1] && (e = "GET"), "undefined" == typeof arguments[2] && (n = "d.html");
      var o = 0,
        d = function () {
          s += 1, t.rq_c = s, wx.request({
            url: "https://" + a + ".aldwx.com/" + n,
            data: t,
            header: {
              AldStat: "MiniApp-Stat"
            },
            method: e,
            success: function () {},
            fail: function () {
              2 > o && (o++, t.retryTimes = o, d())
            }
          })
        };
      d()
    },
    u = function (a, s, n, o) {
      var d = {
        ak: e.app_key,
        uu: _(a),
        at: a.aldstat_access_token,
        ts: Date.now(),
        tp: n,
        ev: s,
        v: t
      };
      o && (d.ct = o), a.aldstat_qr && (d.qr = a.aldstat_qr), p(d, "GET", "d.html")
    },
    h = function (a, s, n, o) {
      "undefined" == typeof a.aldstat_showoption && (a.aldstat_showoption = []);
      var d = {
        ak: e.app_key,
        wsr: a.aldstat_showoption,
        uu: _(a),
        at: a.aldstat_access_token,
        ts: Date.now(),
        tp: n,
        ev: s,
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
      o && (d.ct = o), a.aldstat_location_name && (d.ln = a.aldstat_location_name), a.aldstat_src && (d.sr = a.aldstat_src), a.aldstat_qr && (d.qr = a.aldstat_qr), p(d, "GET", "d.html")
    };

  function f(t) {
    this.app = t
  }
  f.prototype.debug = function (t) {
    h(this.app, "debug", 0, t)
  }, f.prototype.warn = function (t) {
    h(this.app, "debug", 1, t)
  }, f.prototype.error = function (t) {
    u(this.app, "debug", 2, t)
  }, f.prototype.sendEvent = function (t, a) {
    D(a) ? h(this.app, "event", t) : h(this.app, "event", t, JSON.stringify(a))
  };
  var g = function () {
      var t = this;
      t.aldstat_duration += Date.now() - t.aldstat_showtime, S(t, "app", "unLaunch")
    },
    w = function (t, a, e) {
      "undefined" != typeof wx.getShareInfo ? wx.getShareInfo({
        shareTicket: a,
        success: function (a) {
          h(t, "event", "ald_share_" + e, JSON.stringify(a))
        },
        fail: function () {
          h(t, "event", "ald_share_" + e, "1")
        }
      }) : h(t, "event", "ald_share_" + e, "1")
    },
    v = function (t) {
      r(), this.aldstat = new f(this);
      var a = wx.getStorageSync("aldstat_src");
      a && (this.aldstat_src = a);
      var s = _(this);
      this.aldstat_uuid = s, this.aldstat_timestamp = Date.now(), this.aldstat_showtime = Date.now(), this.aldstat_duration = 0;
      var n = this;
      n.aldstat_error_count = 0, n.aldstat_page_count = 1, n.aldstat_first_page = 0, this.aldstat_showoption = "undefined" != typeof t ? t : {};
      var o = function () {
          wx.getNetworkType({
            success: function (t) {
              n.aldstat_network_type = t.networkType
            },
            complete: d
          })
        },
        d = function () {
          wx.getSystemInfo({
            success: function (t) {
              n.aldstat_vsdk_version = "undefined" == typeof t.SDKVersion ? "1.0.0" : t.SDKVersion, n.aldstat_phone_model = t.model, n.aldstat_pixel_ratio = t.pixelRatio, n.aldstat_window_width = t.windowWidth, n.aldstat_window_height = t.windowHeight, n.aldstat_language = t.language, n.aldstat_wechat_version = t.version
            },
            complete: function () {
              e.getLocation && l(), e.getUserinfo && i()
            }
          })
        },
        i = function () {
          c(function (t) {
            var a = wx.getStorageSync("aldstat_uuid");
            t.userInfo.uu = a, p(t.userInfo, "GET", "u.html")
          })
        },
        l = function () {
          wx.getLocation({
            type: "wgs84",
            success: function (t) {
              n.aldstat_lat = t.latitude, n.aldstat_lng = t.longitude, n.aldstat_speed = t.speed
            }
          })
        };
      o();
      var u = wx.getStorageSync("app_session_key_create_launch_upload");
      u ? u > 0 && "number" == typeof u && (n.aldstat_access_token = "" + Date.now() + Math.floor(1e7 * Math.random())) : n.aldstat_access_token = "" + Date.now() + Math.floor(1e7 * Math.random()), S(n, "app", "launch")
    },
    y = function (t, a) {
      var e = getApp();
      "undefined" == typeof this.aldstat_error_count ? this.aldstat_error_count = 1 : this.aldstat_error_count++, h(e, "event", "ald_error_message", JSON.stringify(t))
    },
    S = function (a, s, r) {
      var i = wx.getStorageSync("app_" + r + "_upload");
      if (!(!i && "launch" !== r || 1 > i && "number" == typeof i)) {
        "undefined" == typeof a.aldstat_timestamp && (a.aldstat_timestamp = Date.now()), a.aldstat_duration += Date.now() - a.aldstat_showtime;
        var l = wx.getSystemInfoSync();
        a.aldstat_vsdk_version = "undefined" == typeof l.SDKVersion ? "1.0.0" : l.SDKVersion, a.aldstat_phone_model = l.model, a.aldstat_pixel_ratio = l.pixelRatio, a.aldstat_window_width = l.windowWidth, a.aldstat_window_height = l.windowHeight, a.aldstat_language = l.language, a.aldstat_wechat_version = l.version;
        var c = wx.getStorageSync("aldstat_vsdk_version"),
          u = {
            ak: e.app_key,
            waid: e.appid,
            wst: e.appsecret,
            uu: _(a),
            at: a.aldstat_access_token,
            wsr: a.aldstat_showoption,
            st: a.aldstat_timestamp,
            dr: a.aldstat_duration,
            et: Date.now(),
            pc: a.aldstat_page_count,
            fp: a.aldstat_first_page,
            lp: a.aldstat_last_page,
            life: r,
            ec: a.aldstat_error_count,
            nt: a.aldstat_network_type,
            pm: a.aldstat_phone_model,
            wsdk: c,
            pr: a.aldstat_pixel_ratio,
            ww: a.aldstat_window_width,
            wh: a.aldstat_window_height,
            lang: a.aldstat_language,
            wv: a.aldstat_wechat_version,
            lat: a.aldstat_lat,
            lng: a.aldstat_lng,
            spd: a.aldstat_speed,
            v: t,
            ev: s
          };
        "launch" === r ? n += 1 : "show" === r ? o += 1 : d += 1, u.la_c = n, u.as_c = o, u.ah_c = d, a.page_share_count && "number" == typeof a.page_share_count && (u.sc = a.page_share_count), a.aldstat_is_first_open && (u.ifo = "true"), a.aldstat_location_name && (u.ln = a.aldstat_location_name), a.aldstat_src && (u.sr = a.aldstat_src), a.aldstat_qr && (u.qr = a.aldstat_qr), a.ald_share_src && (u.usr = a.ald_share_src), p(u, "GET", "d.html")
      }
    },
    m = function (t) {
      this.aldstat_showtime = Date.now(), this.aldstat_showoption = "undefined" != typeof t ? t : {};
      var a = wx.getStorageSync("app_session_key_create_show_upload");
      a && a > 0 && "number" == typeof a && (this.aldstat_access_token = "" + Date.now() + Math.floor(1e7 * Math.random())), this.aldstat_duration += Date.now() - this.aldstat_showtime, S(this, "app", "show"), "undefined" != typeof t && ("undefined" != typeof t.shareTicket ? w(this, t.shareTicket, "click") : "undefined" != typeof t.query && "undefined" != typeof t.query.ald_share_src && w(this, "0", "click"))
    },
    x = function (t, a) {
      var e = this;
      e.aldstat_is_first_open && (e.aldstat_is_first_open = !1), e.aldstat_duration += Date.now() - e.aldstat_showtime, S(e, "app", "hide")
    },
    k = App;
  App = function (t) {
    i(t, "onLaunch", v), i(t, "onUnlaunch", g), i(t, "onShow", m), i(t, "onHide", x), i(t, "onError", y), k(t)
  };

  function D(t) {
    for (var a in t) return !1;
    return !0
  }
  var q = function (t, a) {
      var e = getApp();
      M(e, this, "hide")
    },
    A = function (t, a) {
      var e = getApp();
      M(e, this, "unload")
    },
    T = function (t, a) {
      var e = wx.getStorageSync("aldstat_src");
      "undefined" != typeof wx.showShareMenu;
      var s = getApp();
      if (e && (s.aldstat_src = e), !D(t)) {
        "undefined" != typeof t.aldsrc && (e ? s.aldstat_qr = t.aldsrc : (wx.setStorageSync("aldstat_src", t.aldsrc), s.aldstat_src = t.aldsrc, s.aldstat_qr = t.aldsrc));
        var n = wx.getStorageSync("aldstat_uuid");
        "undefined" != typeof t.ald_share_src && (s.ald_share_src = t.ald_share_src), this.aldstat_page_args = JSON.stringify(t)
      }
      M(s, this, "load")
    },
    M = function (a, s, n) {
      var o = wx.getStorageSync("page_" + n + "_upload");
      if (!(!o && "show" !== n || 1 > o && "number" == typeof o)) {
        s.aldstat_start_time = Date.now(), s.aldstat_error_count = 0, a.aldstat_page_count ? a.aldstat_page_count++ : a.aldstat_page_count = 1, a.aldstat_first_page || (a.aldstat_first_page = s.__route__, s.aldstat_is_first_page = !0), a.aldstat_last_page = s.__route__;
        var d = {
          uu: _(a),
          at: a.aldstat_access_token,
          wsr: a.aldstat_showoption,
          ak: e.app_key,
          ev: "page",
          st: s.aldstat_start_time,
          dr: Date.now() - s.aldstat_start_time,
          pp: s.__route__,
          life: n,
          sc: s.page_share_count,
          ec: s.aldstat_error_count,
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
        s.aldstat_is_first_page && (d.ifp = "true"), a.aldstat_page_last_page && (d.lp = a.aldstat_page_last_page), a.aldstat_location_name && (d.ln = a.aldstat_location_name), s.aldstat_page_args && (d.ag = s.aldstat_page_args), a.aldstat_src && (d.sr = a.aldstat_src), a.aldstat_qr && (d.qr = a.aldstat_qr), a.ald_share_src && (d.usr = a.ald_share_src), a.aldstat_page_last_page = s.__route__, p(d, "GET", "d.html")
      }
    },
    b = function (t, a) {
      var e = getApp();
      M(e, this, "show")
    },
    E = function (t, a) {
      var e = getApp();
      h(e, "event", "ald_pulldownrefresh", 1)
    },
    I = function (t, a) {
      var e = getApp();
      h(e, "event", "ald_reachbottom", 1)
    },
    G = Page,
    O = function (t, a) {
      var e = getApp();
      if ("undefined" != typeof t && "undefined" != typeof t[1]) {
        var s = wx.getStorageSync("aldstat_uuid");
        "undefined" == typeof t[1].path && (t[1].path = this.path);
        var n = N(t[1].path),
          o = wx.getStorageSync(s),
          d = "";
        if ("undefined" !== e.ald_share_src && e.ald_share_src) {
          d = e.ald_share_src;
          var _ = d.split(",");
          _.length >= 3 && (_.shift(), d = _.toString()), "" !== d && (d = d + "," + s)
        } else d = wx.getStorageSync("aldstat_uuid");
        t[1].path += -1 != n.indexOf("?") ? "&ald_share_src=" + d : "?ald_share_src=" + d, h(e, "event", "ald_share_chain", {
          path: e.aldstat_last_page,
          chain: d
        }), "" === o || "undefined" == typeof o ? (wx.setStorageSync(s, 1), o = 1, e.page_share_count = o) : (o = parseInt(wx.getStorageSync(s)) + 1, e.page_share_count = o, wx.setStorageSync(s, o)), c(function (t) {
          var a = wx.getStorageSync("aldstat_uuid");
          t.userInfo.uu = a, p(t.userInfo, "GET", "u.html")
        });
        var r = t[1];
        "undefined" == typeof t[1].success && (t[1].success = function (t) {}), "undefined" == typeof t[1].fail && (t[1].fail = function (t) {});
        var i = t[1].fail,
          l = t[1].success;
        return t[1].success = function (t) {
          var a = new Array;
          if ("object" == typeof t.shareTickets)
            for (var s = 0; s < t.shareTickets.length; s++) w(e, t.shareTickets[s], "user");
          h(e, "event", "ald_share_status", JSON.stringify(t)), l(t)
        }, t[1].fail = function (t) {
          h(e, "event", "ald_share_status", "fail"), i(t)
        }, t[1]
      }
    },
    N = function (t) {
      var a = new Object;
      if (-1 != t.indexOf("?"))
        for (var e = t.split("?")[1], s = e.split("&"), n = 0; n < s.length; n++) a[s[n].split("=")[0]] = unescape(s[n].split("=")[1]);
      else a = t;
      return a
    };
  Page = function (t) {
    i(t, "onLoad", T), i(t, "onUnload", A), i(t, "onShow", b), i(t, "onHide", q), i(t, "onReachBottom", I), i(t, "onPullDownRefresh", E), "undefined" != typeof t.onShareAppMessage && l(t, "onShareAppMessage", O), G(t)
  }
}();