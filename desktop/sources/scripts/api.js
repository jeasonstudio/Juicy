const path = require('path');

if (!fs) {
  var fs = require('fs');
}

window.DB = null;

var api = {
  register, login, getUserInfo, share, getShare
}

function throwErr (err) {
  console.info(err);
  swal({
    type: 'error',
    title: '失败',
    text: err
  })
}

function aiKey (Obj) {
  const keys = Object.keys(Obj).map(k => Number(k));
  if (keys.length === 0) return 1;
  const maxKey = Math.max(...keys) || 0;
  return maxKey + 1;
}

 function loadDb () {
  if (!!window.DB) return window.DB;
  const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, './db.json'), 'utf8'));
  window.DB = db;
  return db;
}

function saveDb (db) {
  db = db || window.DB;
  fs.writeFileSync(path.resolve(__dirname, './db.json'), JSON.stringify(db, null, 2));
}

function register ({ name, password }) {
  loadDb();
  const user = window.DB.user;
  if (Object.values(user).some(({ name: on }) => on === name)) {
    throwErr('用户名已经被占用');
    return;
  }
  const newId = aiKey(window.DB.user);
  user[newId] = { name, password };
  saveDb(window.DB);
  return newId;
}

 function login ({ name, password }) {
  const user = window.DB.user;
  const uu = Object.entries(user)
  const findr = uu.find(([id, { name: nn, password: np }]) => (name === nn && password === np));
  if (findr && findr[0]) {
    return findr[0];
  }
  throwErr('用户名/密码错误');
}

function getUserInfo ({ userId }) {
  const user = window.DB.user;
  if (user[userId]) {
    return user[userId];
  }
  throwErr('没有找到用户 Userid: ', userId);
}

function share ({ userId, translate, original }) {
  const share = window.DB.share;
  if (!userId || !translate || !original) {
    throwErr('共享失败, 请确认翻译不为空');
    return;
  }
  share.push({ userId, translate, original });
  saveDb(window.DB);
}

function getShare ({ original: ooo }) {
  if (!ooo) {
    throwErr('先选择英文原文');
    return;
  }
  const tshare = window.DB.share;
  return tshare.filter(s => s.original === ooo)
  .map(({ userId, translate }) => {
    return {
      user: getUserInfo({ userId }),
      translate
    }
  })
}