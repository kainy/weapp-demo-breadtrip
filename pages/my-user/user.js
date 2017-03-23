const app = getApp();
const { User } = app.AV;

Page({
  data: {
    user: null,
    username: '',
    password: '',
    error: null,
  },
  onLoad() {
    this.setData({
      user: User.current(),
    });
  },
  updateUsername({
    detail: {
      value,
    },
  }) {
    this.setData({
      username: value,
    });
  },
  updatePassword({
    detail: {
      value,
    },
  }) {
    this.setData({
      password: value,
    });
  },
  save() {
    this.setData({
      error: null,
    });
    const { username, password } = this.data;
    const user = User.current();
    if (username) user.set({ username });
    if (password) user.set({ password });
    user.save().then(() => {
      wx.showToast({
        title: '更新成功',
        icon: 'success',
      });
    }).catch((error) => {
      this.setData({
        error: error.message,
      });
    });
  },
});
