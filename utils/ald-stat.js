! function() {
  var t = "1.0",
    n = "log",
    e = require("./ald-stat-conf.js");

  function o(t, n, e) {
    if (t[n]) {
      var o = t[n];
      t[n] = function(t) {
        e.call(this, t, n), o.call(this, t)
      }
    } else t[n] = function(t) {
      e.call(this, t, n)
    }
  }
  var a = function(t) {
      var e = 0,
        o = function() {
          wx.request({
            "url": "https://" + n + ".aldwx.com/d.php",
            "data": t,
            "method": "GET",
            "fail": function() {
              e < 2 && (e++, o())
            }
          })
        };
      o()
    },
    i = function(n, o, i) {
      var u = getApp();
      if (u) {
        var c = {
          "ak": e.app_key,
          "uu": u.a,
          "at": u.b,
          "ts": Date.now(),
          "tp": o,
          "ev": n,
          "v": t
        };
        i && (c["ct"] = i), a(c)
      }
    },
    u = {};
  u["debug"] = function(t) {
    i("debug", 0, t)
  }, u["warn"] = function(t) {
    i("debug", 1, t)
  }, u["error"] = function(t) {
    i("debug", 2, t)
  }, u["reportRegsiterSuccess"] = function() {
    i("event", "reg")
  }, u["reportPurchaseSuccess"] = function() {
    i("event", "buy")
  };
  var c = function() {
      this["aldstat"] = u
    },
    s = function() {
      this.c = Date.now();
      var t = wx.getStorageSync("aldstat_uuid");
      t || (t = "" + Date.now() + Math.floor(1e7 * Math.random()), wx.setStorageSync("aldstat_uuid", t), this.d = !0), this.a = t, this.b = "" + Date.now() + Math.floor(1e7 * Math.random());
      var e = this;
      e.e = 0, e.f = 0, e.g = 0, e.h = "";
      var o = function() {
          wx.getNetworkType({
            "success": function(t) {
              e.i = t["networkType"]
            },
            "complete": a
          })
        },
        a = function() {
          wx.getSystemInfo({
            "success": function(t) {
              e.j = t["model"], e.k = t["pixelRatio"], e.l = t["windowWidth"], e.m = t["windowHeight"], e.n = t["language"], e.o = t["version"]
            },
            "complete": i
          })
        },
        i = function() {
          wx.getLocation({
            "type": "wgs84",
            "success": function(t) {
              e.p = t["latitude"], e.q = t["longitude"], e.r = t["speed"]
            },
            "complete": u
          })
        },
        u = function() {
          wx.request({
            "url": "https://" + n + ".aldwx.com/l.php",
            "data": {
              "lat": e.p,
              "lng": e.q
            },
            "method": "GET",
            "success": function(t) {
              t["data"]["success"] && (e.s = t["data"]["country"] + ":" + t["data"]["province"] + ":" + t["data"]["city"])
            }
          })
        };
      o()
    },
    p = function(n, o) {
      var i = getApp(),
        u = {
          "ak": e.app_key,
          "uu": i.a,
          "at": i.b,
          "st": i.c,
          "dr": Date.now() - i.c,
          "pc": i.g,
          "fp": i.h,
          "lp": i.t,
          "rc": i.e,
          "bc": i.f,
          "nt": i.i,
          "pm": i.j,
          "pr": i.k,
          "ww": i.l,
          "wh": i.m,
          "lang": i.n,
          "wv": i.o,
          "lat": i.p,
          "lng": i.q,
          "spd": i.r,
          "v": t,
          "ev": "app"
        };
      i.d && (u["ifo"] = "true"), i.s && (u["ln"] = i.s), a(u)
    },
    r = App;
  App = function(t) {
    o(t, "onLaunch", c), o(t, "onShow", s), o(t, "onHide", p), r(t)
  };
  var f = function(n, o) {
      var i = getApp(),
        u = this,
        c = {
          "uu": i.a,
          "at": i.b,
          "v": t,
          "ak": e.app_key,
          "ev": "page",
          "st": u.u,
          "dr": Date.now() - u.u,
          "rc": u.e,
          "bc": u.f,
          "pp": u["__route__"],
          "nt": i.i,
          "pm": i.j,
          "pr": i.k,
          "ww": i.l,
          "wh": i.m,
          "lang": i.n,
          "wv": i.o,
          "lat": i.p,
          "lng": i.q,
          "spd": i.r,
          "v": t
        };
      i.v && (c["lp"] = i.v), i.s && (c["ln"] = i.s), a(c), i.v = u["__route__"]
    },
    l = function(t, n) {
      var e = getApp();
      this.u = Date.now(), this.e = 0, this.f = 0, e.g ? e.g++ : e.g = 1, e.h || (e.h = this["__route__"]), e.t = this["__route__"]
    },
    h = function(t, n) {
      var e = getApp();
      this.e++, e.e++
    },
    d = function(t, n) {
      var e = getApp();
      this.f++, e.f++
    },
    g = Page;
  Page = function(t) {
    o(t, "onUnload", f), o(t, "onShow", l), o(t, "onHide", f), o(t, "onPullDownRefresh", h), o(t, "onReachBottom", d), g(t)
  }
}();