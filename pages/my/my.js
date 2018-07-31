// index.js
// 获取应用实例
const app = getApp();
const AV = app.AV;
const Todo = require('../../model/todo');
const util = require('../../utils/util.js');

Page({
  data: {
    userInfo: null,
    todos: [],
    editedTodo: {},
    draft: '',
    editDraft: null,
  },
  onLoad() {
    util.showLoading();
  },
  loginAndFetchTodos() {
    return app.loginOrSignup().then((user) => {
      this.setData({
        userInfo: user,
      });
      this.fetchTodos(user);
      app.syncUserInfo(user).then((userInfo) => {
        this.setData({
          userInfo,
        });
      }).catch(console.error);
    }).catch(() => {
      util.alert('登陆失败，请点击头像重试，如问题持续，请点击右下方按钮联系我们');
    });
  },
  fetchTodos(user) {
    return new AV.Query('Todo')
      .equalTo('user', AV.Object.createWithoutData('User', user.id))
      .descending('createdAt')
      .find()
      .then(this.setTodos)
      .catch(console.error);
  },
  onReady() {
    this.loginAndFetchTodos();
  },
  onPullDownRefresh() {
    this.loginAndFetchTodos().then(wx.stopPullDownRefresh);
  },
  setTodos(todos = []) {
    const activeTodos = todos.filter(todo => !todo.done);
    this.setData({
      todos,
      activeTodos,
    });
    util.hideLoading();
  },
  updateDraft({
    detail: {
      value,
    },
  }) {
    this.setData({
      draft: value,
    });
  },
  addTodo() {
    const value = this.data.draft && this.data.draft.trim();
    if (!value) {
      return;
    }
    const acl = new AV.ACL();
    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
    acl.setReadAccess(AV.User.current(), true);
    acl.setWriteAccess(AV.User.current(), true);
    new Todo({
      content: value,
      done: false,
      user: AV.User.current(),
    }).setACL(acl).save().then((todo) => {
      this.setTodos([todo, ...this.data.todos]);
    })
      .catch(console.error);
    this.setData({
      draft: '',
    });
  },
  toggleDone({
    target: {
      dataset: {
        id,
      },
    },
  }) {
    const { todos } = this.data;
    const currentTodo = todos.filter(todo => todo.id === id)[0];
    currentTodo.done = !currentTodo.done;
    currentTodo.save()
      .then(() => this.setTodos(todos))
      .catch(console.error);
  },
  editTodo({
    target: {
      dataset: {
        id,
      },
    },
  }) {
    this.setData({
      editDraft: null,
      editedTodo: this.data.todos.filter(todo => todo.id === id)[0] || {},
    });
  },
  updateEditedContent({
    detail: {
      value,
    },
  }) {
    this.setData({
      editDraft: value,
    });
  },
  doneEdit({
    target: {
      dataset: {
        id,
      },
    },
  }) {
    const { todos, editDraft } = this.data;
    this.setData({
      editedTodo: {},
    });
    if (editDraft === null) return;
    const currentTodo = todos.filter(todo => todo.id === id)[0];
    if (editDraft === currentTodo.content) return;
    currentTodo.content = editDraft;
    currentTodo.save().then(() => {
      this.setTodos(todos);
    }).catch(console.error);
  },
  removeDone() {
    AV.Object.destroyAll(this.data.todos.filter(todo => todo.done)).then(() => {
      this.setTodos(this.data.activeTodos);
    }).catch(console.error);
  },
  setting() {
    wx.navigateTo({
      url: '../setting/setting',
    });
  },
  tapAvatar() {
    app.syncUserInfo(AV.User.current()).catch(() => {
      util.alert('获取微信头像失败，请删除“跨时空”小程序后重新搜索进入并授权。');
    });
  },
});
