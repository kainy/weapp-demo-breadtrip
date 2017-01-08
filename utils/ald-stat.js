! function () {
  var t = "1.3",
    n = "log",
    o = require("./ald-stat-conf.js");

  function e(t, n, o) {
    if (t[n]) {
      var e = t[n];
      t[n] = function (t) {
        o.call(this, t, n), e.call(this, t)
      }
    } else t[n] = function (t) {
      o.call(this, t, n)
    }
  }
  var a = function (t) {
      var o = 0,
        e = function () {
          wx.request({
            "url": "https://" + n + ".aldwx.com/d.php",
            "data": t,
            "method": "GET",
            "fail": function () {
              o < 2 && (o++, e())
            }
          })
        };
      e()
    },
    i = function (n, e, i, s) {
      var u = {
        "ak": o["app_key"],
        "uu": n.a,
        "at": n.b,
        "ts": Date.now(),
        "tp": i,
        "ev": e,
        "nt": n.c,
        "pm": n.d,
        "pr": n.e,
        "ww": n.f,
        "wh": n.g,
        "lang": n.h,
        "wv": n.i,
        "lat": n.j,
        "lng": n.k,
        "spd": n.l,
        "v": t
      };
      s && (u["ct"] = s), n.m && (u["ln"] = n.m), n.n && (u["sr"] = n.n), a(u)
    };

  function s(t) {
    this.o = t
  }
  s.prototype["debug"] = function (t) {
    i(this.o, "debug", 0, t)
  }, s.prototype["warn"] = function (t) {
    i(this.o, "debug", 1, t)
  }, s.prototype["error"] = function (t) {
    i(this.o, "debug", 2, t)
  }, s.prototype["sendEvent"] = function (t, n) {
    h(n) ? i(this.o, "event", t) : i(this.o, "event", t, JSON.stringify(n))
  };
  var u = function () {
      this["aldstat"] = new s(this), this.n = Math.ceil(4 * Math.random());
      var t = wx.getStorageSync("aldstat_uuid");
      t || (t = "" + Date.now() + Math.floor(1e7 * Math.random()), wx.setStorageSync("aldstat_uuid", t), this.p = !0), this.a = t, this.q = Date.now(), this.r = Date.now(), this.s = 0, this.b = "" + Date.now() + Math.floor(1e7 * Math.random());
      var e = this;
      e.t = 0, e.u = 0, e.v = 0;
      var a = function () {
          wx.getNetworkType({
            "success": function (t) {
              e.c = t["networkType"]
            },
            "complete": i
          })
        },
        i = function () {
          wx.getSystemInfo({
            "success": function (t) {
              e.d = t["model"], e.e = t["pixelRatio"], e.f = t["windowWidth"], e.g = t["windowHeight"], e.h = t["language"], e.i = t["version"]
            },
            "complete": function () {
              o.getLocation && u()
            }
          })
        },
        u = function () {
          wx.getLocation({
            "type": "wgs84",
            "success": function (t) {
              e.j = t["latitude"], e.k = t["longitude"], e.l = t["speed"]
            },
            "complete": c
          })
        },
        c = function () {
          wx.request({
            "url": "https://" + n + ".aldwx.com/l.php",
            "data": {
              "lat": e.j,
              "lng": e.k
            },
            "method": "GET",
            "success": function (t) {
              t["data"]["success"] && (e.m = t["data"]["country"] + ":" + t["data"]["province"] + ":" + t["data"]["city"])
            }
          })
        };
      a()
    },
    c = function () {
      this.r = Date.now()
    },
    r = function (n, e) {
      var i = this;
      i.s += Date.now() - i.r;
      var s = {
        "ak": o["app_key"],
        "uu": i.a,
        "at": i.b,
        "st": i.q,
        "dr": i.s,
        "et": Date.now(),
        "pc": i.v,
        "fp": i.w,
        "lp": i.x,
        "rc": i.t,
        "bc": i.u,
        "nt": i.c,
        "pm": i.d,
        "pr": i.e,
        "ww": i.f,
        "wh": i.g,
        "lang": i.h,
        "wv": i.i,
        "lat": i.j,
        "lng": i.k,
        "spd": i.l,
        "v": t,
        "ev": "app"
      };
      i.p && (s["ifo"] = "true"), i.m && (s["ln"] = i.m), i.n && (s["sr"] = i.n), a(s)
    },
    p = App;
  App = function (t) {
    e(t, "onLaunch", u), e(t, "onShow", c), e(t, "onHide", r), p(t)
  };

  function h(t) {
    for (var n in t) return !1;
    return !0
  }
  var l = function (n, e) {
      var i = getApp(),
        s = this,
        u = {
          "uu": i.a,
          "at": i.b,
          "v": t,
          "ak": o["app_key"],
          "ev": "page",
          "st": s.y,
          "dr": Date.now() - s.y,
          "rc": s.t,
          "bc": s.u,
          "pp": s["__route__"],
          "nt": i.c,
          "pm": i.d,
          "pr": i.e,
          "ww": i.f,
          "wh": i.g,
          "lang": i.h,
          "wv": i.i,
          "lat": i.j,
          "lng": i.k,
          "spd": i.l,
          "v": t
        };
      s.z && (u["ifp"] = "true"), i.A && (u["lp"] = i.A), i.m && (u["ln"] = i.m), s.B && (u["ag"] = s.B), i.n && (u["sr"] = i.n), a(u), i.A = s["__route__"]
    },
    f = function (t, n) {
      h(t) || (this.B = JSON.stringify(t))
    },
    w = function (t, n) {
      var o = getApp();
      this.y = Date.now(), this.t = 0, this.u = 0, o.v ? o.v++ : o.v = 1, o.w || (o.w = this["__route__"], this.z = !0), o.x = this["__route__"]
    },
    d = function (t, n) {
      var o = getApp();
      this.t++, o.t++
    },
    g = function (t, n) {
      var o = getApp();
      this.u++, o.u++
    },
    v = Page;
  Page = function (t) {
    e(t, "onLoad", f), e(t, "onUnload", l), e(t, "onShow", w), e(t, "onHide", l), e(t, "onPullDownRefresh", d), e(t, "onReachBottom", g), v(t)
  }
}();