const path = require('path');
var got = require('got');
var http = require('http');

if (!fs) {
  var fs = require('fs');
}

window.DB = null;

var api = {
  register, login, getUserInfo, share, getShare, saveShare, book, getBook
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

 async function loadDb () {
  if (!!window.DB) return window.DB;
  // const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, './db.json'), 'utf8'));
  // window.DB = db;
  const aaaa = await got('http://123.206.14.30:7777');
  const ddd = aaaa.body.replace(/\//g, '');
  window.DB = JSON.parse(ddd);
  return ddd;
}

function saveDb (db) {
  db = db || window.DB;
  fetch(`http://123.206.14.30:7777?db=${JSON.stringify(db)}`);
  // await got(`http://123.206.14.30:7777?db=${JSON.stringify(db)}`);
  // fs.writeFileSync(path.resolve(__dirname, './db.json'), JSON.stringify(db, null, 2));
}

loadDb();

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
  .map(({ userId, translate,star }) => {
    return {
      user: getUserInfo({ userId }),
      translate,
      star
    }
  })
}

function book ({ userId, translate, original }) {
  const book = window.DB.book;
  if (!userId || !translate || !original) {
    throwErr('保存单词本失败, 请确认翻译不为空');
    return;
  }
  if (!book[userId]) book[userId] = '';

  book[userId] += '\n'
  book[userId] += `${original}\t${translate}`
  saveDb(window.DB)
}

function getBook ({ userId }) {
  const book = window.DB.book;
  if (!book[userId]) return '';
  return book[userId];
}

function saveShare (shareList) {
  window.DB.share = shareList;
  saveDb(window.DB);
}