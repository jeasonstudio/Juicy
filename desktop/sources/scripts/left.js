// const fs = require('fs')

function renderResult(gResult, yResult, bResult, shareList) {
  let html = '';
  html += `<div class="f-container">`;
  html += `<h2 class="f-title g-title">谷歌翻译结果:</h2>`;
  html += `<div class="g-res t-res"><span>${gResult}</span><span class="btn-list"><div class="use-button" type="submit" onclick="useG()">&radic;</div><div class="use-button" type="submit" id="share-sg" onclick="shareTranslate('share-sg','${gResult}')">S</div><div class="use-button" type="submit" id="book-sg" onclick="bookTranslate('book-sg','${gResult}')">B</div></span></div>`
  html += `<h2 class="f-title y-title">有道翻译结果:</h2>`;
  html += `<div class="y-res t-res"><span>${yResult}</span><span class="btn-list"><div class="use-button" type="submit" onclick="useY()">&radic;</div><div class="use-button" type="submit" id="share-sy" onclick="shareTranslate('share-sy','${yResult}')">S</div><div class="use-button" type="submit" id="book-sy" onclick="bookTranslate('book-sy','${yResult}')">B</div></span></div>`
  html += `<h2 class="f-title b-title">百度翻译结果:</h2>`;
  html += `<div class="b-res t-res"><span>${bResult}</span><span class="btn-list"><div class="use-button" type="submit" onclick="useB()">&radic;</div><div class="use-button" type="submit" id="share-sb" onclick="shareTranslate('share-sb','${bResult}')">S</div><div class="use-button" type="submit" id="book-sb" onclick="bookTranslate('book-sb','${bResult}')">B</div></span></div>`
  html += `<h2 class="f-title b-title">自定义结果:</h2>`;
  html += `<div class="b-res t-res"><input id="own-input-trans" /><span class="btn-list"><div class="use-button" type="submit" onclick="useO()">&radic;</div><div class="use-button" type="submit" id='share-sc' onclick="shareTranslate('share-sc')">S</div><div class="use-button" type="submit" id='book-sc' onclick="bookTranslate('book-sc')">B</div></span></div>`
  if (shareList.length !== 0) {
    html += `<h2 class="f-title b-title">共享结果:</h2>`;
    shareList.forEach(({ user: { name }, translate }) => {
      html += `<div class="b-res t-res"><span>${translate}  - by ${name}</span><span class="btn-list"><div class="use-button" type="submit" onclick="useShared('${translate}')">&radic;</div></span></div>`
    })
  }
  html += `</div>`
  return html
}

window.userInfo = {};

window.translateMap = {};

/**
 * 翻译 => 原文哈希 map
 *
 * @param {String} t 翻译
 * @param {String} o 原文
 */
function addTranslate(t, o) {
  if (!window.translateMap) window.translateMap = {};
  window.translateMap[t] = o;
}

/**
 * 根据翻译获取原文
 *
 * @param {String} t 翻译
 * @returns {String} 原文
 */
function getOriginFromMap(t) {
  if (!window.translateMap) window.translateMap = {};
  return window.translateMap[t]
}

/**
 * 记忆译文
 * @param {String} oo 原文
 */
function memoryTrans (oo) {
  if (!window.translateMap) return;
  let findr = undefined;
  Object.entries(window.translateMap).forEach(([t, o]) => {
    if (o === oo) findr = t;
  });
  return findr;
}

function Left() {
  this.theme = new Theme();
  this.controller = new Controller();
  this.dictionary = new Dict();
  this.operator = new Operator();
  this.navi = new Navi();
  this.project = new Project();
  this.options = new Options();
  this.reader = new Reader();
  this.insert = new Insert();

  this.textarea_el = document.createElement('textarea');
  this.stats_el = document.createElement('stats');
  this.scroll_el = document.createElement('scrollbar');
  this.drag_el = document.createElement('drag');

  this.selection = { word: null, index: 1 };
  this.all_selection = { text: null, index: 1 };

  this.words_count = null;
  this.lines_count = null;
  this.chars_count = null;
  this.suggestion = null;
  this.synonyms = null;
  this.last_char = "s"; // this is not a typo. it's bad code, but it has to be a length one string

  document.body.appendChild(this.navi.el);
  document.body.appendChild(this.textarea_el);
  document.body.appendChild(this.stats_el);
  document.body.appendChild(this.scroll_el);
  document.body.appendChild(this.drag_el);
  document.body.appendChild(this.operator.el);
  document.body.className = window.location.hash.replace("#", "");

  this.textarea_el.setAttribute("autocomplete", "off");
  this.textarea_el.setAttribute("autocorrect", "off");
  this.textarea_el.setAttribute("autocapitalize", "off");
  this.textarea_el.setAttribute("spellcheck", "false");
  this.textarea_el.setAttribute("type", "text");

  this.api = window.api;

  var left = this;

  this.start = function () {
    this.theme.start();
    this.dictionary.start();

    this.textarea_el.focus();

    this.textarea_el.value = this.splash();
    // this.reset();
    this.textarea_el.setSelectionRange(0, 0);

    this.controller.add("default", "*", "关于", () => { require('electron').shell.openExternal('https://github.com/jeasonstudio/Juicy'); }, "CmdOrCtrl+,");
    this.controller.add("default", "*", "全屏", () => { app.toggle_fullscreen(); }, "CmdOrCtrl+Enter");
    this.controller.add("default", "*", "隐藏", () => { app.toggle_visible(); }, "CmdOrCtrl+H");
    this.controller.add("default", "*", "调试", () => { app.inspect(); }, "CmdOrCtrl+.");
    this.controller.add("default", "*", "文档", () => { left.controller.docs(); }, "CmdOrCtrl+Esc");
    this.controller.add("default", "*", "重置", () => { left.theme.reset(); }, "CmdOrCtrl+Backspace");
    this.controller.add("default", "*", "退出", () => { left.project.quit(); }, "CmdOrCtrl+Q");
    this.controller.add("default", "*", "注册", () => { left.register(); });
    this.controller.add("default", "*", "登录", () => { left.login(); });

    this.controller.add("default", "File", "新建", () => { left.project.new(); }, "CmdOrCtrl+N");
    this.controller.add("default", "File", "打开", () => { left.project.open(); }, "CmdOrCtrl+O");
    this.controller.add("default", "File", "储存", () => { left.project.save(); }, "CmdOrCtrl+S");
    this.controller.add("default", "File", "储存为", () => { left.project.save_as(); }, "CmdOrCtrl+Shift+S");
    this.controller.add("default", "File", "撤销修改", () => { left.project.discard(); }, "CmdOrCtrl+D");
    this.controller.add("default", "File", "关闭文件", () => { left.project.close(); }, "CmdOrCtrl+W");
    this.controller.add("default", "File", "强制关闭", () => { left.project.force_close(); }, "CmdOrCtrl+Shift+W");
    this.controller.add("default", "File", "打开生词本", () => { left.getBooks(); });

    this.controller.add_role("default", "Edit", "撤销");
    this.controller.add_role("default", "Edit", "重做");
    this.controller.add_role("default", "Edit", "剪切");
    this.controller.add_role("default", "Edit", "复制");
    this.controller.add_role("default", "Edit", "粘贴");
    this.controller.add_role("default", "Edit", "删除");
    this.controller.add_role("default", "Edit", "全选");

    // this.controller.add("default", "Select", "Select Autocomplete", () => { left.select_autocomplete(); }, "Tab");
    this.controller.add("default", "Select", "同义词", () => { left.select_synonym(); }, "Shift+Tab");
    this.controller.add("default", "Select", "选中翻译", () => { left.select_translate(); }, "CmdOrCtrl+T");
    this.controller.add("default", "Select", "选中复原", () => { left.translate_to_original(); }, "CmdOrCtrl+Y");

    this.controller.add("default", "Navigation", "下一处标记", () => { left.navi.next(); }, "CmdOrCtrl+]");
    this.controller.add("default", "Navigation", "上一处标记", () => { left.navi.prev(); }, "CmdOrCtrl+[");
    this.controller.add("default", "Navigation", "下一个文件", () => { left.project.next(); }, "CmdOrCtrl+Shift+]");
    this.controller.add("default", "Navigation", "上一个文件", () => { left.project.prev(); }, "CmdOrCtrl+Shift+[");
    // this.controller.add("default", "Navigation", "Find", () => { left.operator.start(); }, "CmdOrCtrl+F");

    this.controller.add("default", "View", "放大", () => { left.options.set_zoom(left.options.zoom + 0.1) }, "CmdOrCtrl+Plus");
    this.controller.add("default", "View", "缩小", () => { left.options.set_zoom(left.options.zoom - 0.1) }, "CmdOrCtrl+-");
    this.controller.add("default", "View", "还原", () => { left.options.set_zoom(1) }, "CmdOrCtrl+0");

    this.controller.add("default", "Mode", "只读", () => { left.reader.start(); }, "CmdOrCtrl+K");
    this.controller.add("default", "Mode", "网页", () => { left.operator.start(); }, "CmdOrCtrl+F");
    // this.controller.add("default", "Mode", "Insert", () => { left.insert.start(); }, "CmdOrCtrl+I");

    this.controller.add("reader", "*", "关于", () => { require('electron').shell.openExternal('https://github.com/jeasonstudio/Juicy'); }, "CmdOrCtrl+,");
    this.controller.add("reader", "*", "全屏", () => { app.toggle_fullscreen(); }, "CmdOrCtrl+Enter");
    this.controller.add("reader", "*", "隐藏", () => { app.toggle_visible(); }, "CmdOrCtrl+H");
    this.controller.add("reader", "*", "调试", () => { app.inspect(); }, "CmdOrCtrl+.");
    this.controller.add("reader", "*", "文档", () => { left.controller.docs(); }, "CmdOrCtrl+Esc");
    this.controller.add("reader", "*", "重置", () => { left.theme.reset(); }, "CmdOrCtrl+Backspace");
    this.controller.add("reader", "*", "退出", () => { left.project.quit(); }, "CmdOrCtrl+Q");
    this.controller.add("reader", "Reader", "Stop", () => { left.reader.stop(); }, "Esc");

    this.controller.add("operator", "*", "About", () => { require('electron').shell.openExternal('https://github.com/jeasonstudio/Juicy'); }, "CmdOrCtrl+,");
    this.controller.add("operator", "*", "Fullscreen", () => { app.toggle_fullscreen(); }, "CmdOrCtrl+Enter");
    this.controller.add("operator", "*", "Hide", () => { app.toggle_visible(); }, "CmdOrCtrl+H");
    this.controller.add("operator", "*", "Inspect", () => { app.inspect(); }, "CmdOrCtrl+.");
    this.controller.add("operator", "*", "Documentation", () => { left.controller.docs(); }, "CmdOrCtrl+Esc");
    this.controller.add("operator", "*", "Reset", () => { left.theme.reset(); }, "CmdOrCtrl+Backspace");
    this.controller.add("operator", "*", "Quit", () => { left.project.quit(); }, "CmdOrCtrl+Q");

    this.controller.add("insert", "*", "About", () => { require('electron').shell.openExternal('https://github.com/jeasonstudio/Juicy'); }, "CmdOrCtrl+,");
    this.controller.add("insert", "*", "Fullscreen", () => { app.toggle_fullscreen(); }, "CmdOrCtrl+Enter");
    this.controller.add("insert", "*", "Hide", () => { app.toggle_visible(); }, "CmdOrCtrl+H");
    this.controller.add("insert", "*", "Inspect", () => { app.inspect(); }, "CmdOrCtrl+.");
    this.controller.add("insert", "*", "Documentation", () => { left.controller.docs(); }, "CmdOrCtrl+Esc");
    this.controller.add("insert", "*", "Reset", () => { left.theme.reset(); }, "CmdOrCtrl+Backspace");
    this.controller.add("insert", "*", "Quit", () => { left.project.quit(); }, "CmdOrCtrl+Q");

    this.controller.add("insert", "Insert", "Date", () => { left.insert.date(); }, "CmdOrCtrl+D");
    this.controller.add("insert", "Insert", "Time", () => { left.insert.time(); }, "CmdOrCtrl+T");
    this.controller.add("insert", "Insert", "Path", () => { left.insert.path(); }, "CmdOrCtrl+P");
    this.controller.add("insert", "Insert", "Header", () => { left.insert.header(); }, "CmdOrCtrl+H");
    this.controller.add("insert", "Insert", "SubHeader", () => { left.insert.subheader(); }, "CmdOrCtrl+Shift+H");
    this.controller.add("insert", "Insert", "Comment", () => { left.insert.comment(); }, "CmdOrCtrl+/");
    this.controller.add("insert", "Insert", "Line", () => { left.insert.line(); }, "CmdOrCtrl+L");
    this.controller.add("insert", "Mode", "Stop", () => { left.insert.stop(); }, "Esc");

    this.controller.add_role("operator", "Edit", "undo");
    this.controller.add_role("operator", "Edit", "redo");
    this.controller.add_role("operator", "Edit", "cut");
    this.controller.add_role("operator", "Edit", "copy");
    this.controller.add_role("operator", "Edit", "paste");
    this.controller.add_role("operator", "Edit", "delete");
    this.controller.add_role("operator", "Edit", "selectall");

    this.controller.add("operator", "Operator", "Stop", () => { left.operator.stop(); }, "Esc");

    this.controller.commit();

    this.dictionary.update();
    this.refresh();
  }

  this.register = function () {
    console.log('reg');
    swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2']
    }).queue([{
      title: '注册',
      text: '请输入用户名'
    }, {
      title: '注册',
      text: '请输入密码',
      input: 'password'
    }]).then(({ value }) => {
      const userId = left.api.register({ name: value[0], password: value[1] });
      window.userInfo = left.api.getUserInfo({ userId });
      window.userInfo.id = userId;
      if (userId) {
        swal({
          type: 'success',
          title: '注册成功',
          timer: 1000
        })
      }
    })
  }

  this.login = function () {
    console.log('login');
    swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2']
    }).queue([{
      title: '登录',
      text: '请输入用户名'
    }, {
      title: '登录',
      text: '请输入密码',
      input: 'password'
    }]).then(({ value }) => {
      const userId = left.api.login({ name: value[0], password: value[1] });
      if (userId) {
        window.userInfo = left.api.getUserInfo({ userId });
        window.userInfo.id = userId;
        swal({
          type: 'success',
          title: '登录成功',
          timer: 1000
        })
      }
    })
  }

  this.getBooks = function () {
    if (!window.userInfo.id) {
      throwErr('请先登录');
      return;
    }
    const bookText = left.api.getBook({ userId: window.userInfo.id });
    left.textarea_el.value = bookText;
    left.refresh();
  }

  this.select_autocomplete = function () {
    if (left.selection.word.trim() != "" && left.suggestion && left.suggestion.toLowerCase() != left.active_word().toLowerCase()) {
      left.autocomplete();
    } else {
      left.inject("\u00a0\u00a0")
    }
  }

  this.select_synonym = function () {
    if (left.synonyms) {
      left.replace_active_word_with(left.synonyms[left.selection.index % left.synonyms.length]);
      left.update_stats();
      left.selection.index += 1;
    }
  }

  this.translate_to_original = function () {
    const textObj = left.get_selections();
    const text = (textObj || {}).text; 
    if (text === '') return;

    const original = getOriginFromMap(text);
    if (!original) return;

    // left.textarea_el.focus();
    left.replace_selection_with(original);
    left.update_stats();
    left.selection.index += 1;
  }

  this.select_translate = async function () {
    const textObj = left.get_selections();
    const text = (textObj || {}).text;

    // 译文记忆
    const mem = memoryTrans(text);
    if (!!mem) {
      left.replace_selection_with(mem);
      left.update_stats();
      left.selection.index += 1;
      return;
    }

    if (text === '') return;
    swal({
      title: '正在为你提供翻译...',
      position: 'top-end',
      onOpen: async () => {
        swal.showLoading()

        // 分享
        window.shareTranslate = (btnId, text2) => {
          if (!window.userInfo.id) {
            throwErr('请先登录');
            return;
          }
          if (!text2) {
            text2 = document.getElementById('own-input-trans').value;
          }
          left.api.share({ userId: window.userInfo.id, translate: text2, original: text })
          const theShareBtn = document.getElementById(btnId);
          theShareBtn.style.background = '#43853d';
          theShareBtn.style.color = '#fff';
        }

        window.bookTranslate = (bid, text2) => {
          if (!window.userInfo.id) {
            throwErr('请先登录');
            return;
          }
          if (!text2) {
            text2 = document.getElementById('own-input-trans').value;
          }
          left.api.book({ userId: window.userInfo.id, translate: text2, original: text })
          const theShareBtn = document.getElementById(bid);
          theShareBtn.style.background = '#0084ff';
          theShareBtn.style.color = '#fff';
        }

        // 获取分享列表
        const shareList = left.api.getShare({ original: text });

        const [{ result: gResult }, { result: yResult }, { result: bResult }] = await Promise.all([
          google.translate(text),
          youdao.translate(text),
          baidu.translate(text)
        ])
        window.useG = () => {
          console.log('G', gResult.join(' '));
          swal.close();
          left.textarea_el.focus();
          left.replace_selection_with(gResult.join(' '));
          addTranslate(gResult.join(' '), text);
          left.update_stats();
          left.selection.index += 1;
        }
        window.useY = () => {
          console.log('Y', yResult.join(' '));
          swal.close();
          left.textarea_el.focus();
          left.replace_selection_with(yResult.join(' '));
          addTranslate(yResult.join(' '), text);
          left.update_stats();
          left.selection.index += 1;
        }
        window.useB = () => {
          console.log('B', bResult.join(' '));
          swal.close();
          left.textarea_el.focus();
          left.replace_selection_with(bResult.join(' '));
          addTranslate(bResult.join(' '), text);
          left.update_stats();
          left.selection.index += 1;
        }
        window.useO = () => {
          let ores = document.getElementById('own-input-trans').value;
          console.log('O', ores);
          swal.close();
          left.textarea_el.focus();
          left.replace_selection_with(ores);
          addTranslate(ores, text);
          left.update_stats();
          left.selection.index += 1;
        }
        window.useShared = (translateShared) => {
          console.log('S', translateShared);
          swal.close();
          left.textarea_el.focus();
          left.replace_selection_with(translateShared);
          addTranslate(translateShared, text);
          left.update_stats();
          left.selection.index += 1;
        }
        swal.hideLoading();
        swal.close();
        swal({
          title: '翻译结果',
          html: renderResult(
            gResult.join(''), yResult.join(''), bResult.join(''), shareList
          ),
          position: 'top-end',
          showCloseButton: true,
          showCancelButton: false,
          showConfirmButton: false
        })
      }
    })
  }

  this.refresh = function () {
    left.selection.word = this.active_word();

    // Only look for suggestion is at the end of word, or text.
    var next_char = this.textarea_el.value.substr(left.textarea_el.selectionEnd, 1);

    left.suggestion = (next_char == "" || next_char == " " || next_char == "\n") ? left.dictionary.find_suggestion(left.selection.word) : null;

    this.options.update();
    this.navi.update();
    this.update_stats();
  }

  this.update_stats = function () {
    var stats = left.parse_stats(left.selected());

    var suggestion_html = "";
    var synonym_html = ` <b>${left.selection.word}</b> `;

    if (left.insert.is_active) {
      left.stats_el.innerHTML = left.insert.status();
      return;
    }
    else if (left.selection.word && left.suggestion && left.selection.word != left.suggestion) {
      suggestion_html = ` <t>${left.selection.word}<b>${left.suggestion.substr(left.selection.word.length, left.suggestion.length)}</b></t>`;
    }
    else {
      left.synonyms = this.dictionary.find_synonym(left.selection.word);
      for (syn_id in left.synonyms) {
        synonym_html += syn_id == (left.selection.index % left.synonyms.length) ? `<i>${left.synonyms[syn_id]}</i> ` : left.synonyms[syn_id] + " ";
      }
    }
    left.stats_el.innerHTML = left.synonyms && left.selected().length < 5 ? synonym_html : (left.textarea_el.selectionStart != left.textarea_el.selectionEnd ? "<b>[" + left.textarea_el.selectionStart + "," + left.textarea_el.selectionEnd + "]</b> " : '') + (`${stats.l}L ${stats.w}W ${stats.v}V ${stats.c}C ${suggestion_html}`);
  }

  this.parse_stats = function (text = left.textarea_el.value) {
    text = text.length > 5 ? text.trim() : left.textarea_el.value;

    var h = {};
    var words = text.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(" ");
    for (id in words) {
      h[words[id]] = 1
    }

    var stats = {};
    stats.l = text.split("\n").length; // lines_count
    stats.w = text.split(" ").length; // words_count
    stats.c = text.length; // chars_count
    stats.v = Object.keys(h).length;
    return stats;
  }

  // Location tools

  this.selected = function () {
    var value = left.textarea_el.value.substr(left.textarea_el.selectionStart, left.textarea_el.selectionEnd - left.textarea_el.selectionStart);
    return value;
  }

  this.active_line_id = function () {
    var segments = left.textarea_el.value.substr(0, left.textarea_el.selectionEnd).split("\n");
    return segments.length - 1;
  }

  this.active_word_location = function (position = left.textarea_el.selectionEnd) {
    var from = position - 1;

    // Find beginning of word 
    while (from > -1) {
      char = this.textarea_el.value[from];
      if (!char || !char.match(/[a-z]/i)) {
        break;
      }
      from -= 1;
    }

    // Find end of word
    var to = from + 1;
    while (to < from + 30) {
      char = this.textarea_el.value[to];
      if (!char || !char.match(/[a-z]/i)) {
        break;
      }
      to += 1;
    }

    from += 1;

    return { from: from, to: to };
  }

  this.active_word = function () {
    var l = this.active_word_location();
    return left.textarea_el.value.substr(l.from, l.to - l.from);
  }

  this.prev_character = function () {
    var l = this.active_word_location();
    return left.textarea_el.value.substr(l.from - 1, 1);
  }

  this.replace_active_word_with = function (word) {
    var l = this.active_word_location();
    var w = left.textarea_el.value.substr(l.from, l.to - l.from);

    // Preserve capitalization
    if (w.substr(0, 1) == w.substr(0, 1).toUpperCase()) {
      word = word.substr(0, 1).toUpperCase() + word.substr(1, word.length);
    }

    this.textarea_el.setSelectionRange(l.from, l.to);

    document.execCommand('insertText', false, word);

    this.textarea_el.focus();
  }

  this.get_selections = function () {
    this.all_selection.index = this.textarea_el.selectionStart;
    this.all_selection.text = this.textarea_el.value.substr(this.all_selection.index, this.textarea_el.selectionEnd - this.all_selection.index);
    return this.all_selection
  }

  this.replace_selection_with = function (characters) {
    document.execCommand('insertText', false, characters);
    this.refresh();
  }

  this.inject = function (characters = "__") {
    var pos = this.textarea_el.selectionStart;
    this.textarea_el.setSelectionRange(pos, pos);
    document.execCommand('insertText', false, characters);
    this.refresh();
  }

  this.autocomplete = function () {
    var suggestion = left.suggestion;
    console.log(left.selection.word.length, suggestion.length)
    this.inject(suggestion.substr(left.selection.word.length, suggestion.length) + " ");
  }

  this.replace_line = function (id, new_text, del = false) {
    // optional arg for deleting the line, used in actions
    let lineArr = this.textarea_el.value.split("\n", parseInt(id) + 1)
    let arrJoin = lineArr.join("\n")

    let from = arrJoin.length - lineArr[id].length;
    let to = arrJoin.length;

    //splicing the string
    let new_text_value = this.textarea_el.value.slice(0, del ? from - 1 : from) + new_text + this.textarea_el.value.slice(to)

    // the cursor automatically moves to the changed position, so we have to set it back
    let cursor_start = this.textarea_el.selectionStart;
    let cursor_end = this.textarea_el.selectionEnd;
    let old_length = this.textarea_el.value.length
    let old_scroll = this.textarea_el.scrollTop
    //setting text area
    this.textarea_el.value = new_text_value
    //adjusting the cursor position for the change in length
    let length_dif = this.textarea_el.value.length - old_length
    if (cursor_start > to) {
      cursor_start += length_dif
      cursor_end += length_dif
    }
    //setting the cursor position
    if (this.textarea_el.setSelectionRange) {
      this.textarea_el.setSelectionRange(cursor_start, cursor_end);
    }
    else if (this.textarea_el.createTextRange) {
      var range = this.textarea_el.createTextRange();
      range.collapse(true);
      range.moveEnd('character', cursor_end);
      range.moveStart('character', cursor_start);
      range.select();
    }
    //setting the scroll position
    this.textarea_el.scrollTop = old_scroll
    //this function turned out a lot longer than I was expecting. Ah well :/
  }

  this.go_to_line = function (id) {
    let lineArr = this.textarea_el.value.split("\n", parseInt(id) + 1)
    let arrJoin = lineArr.join("\n")

    let from = arrJoin.length - lineArr[id].length;
    let to = arrJoin.length;

    this.go_to_fromTo(from, to)
  }

  this.go_to = function (selection) {
    var from = this.textarea_el.value.indexOf(selection);
    var to = from + selection.length;

    this.go_to_fromTo(from, to)
  }

  this.go_to_fromTo = function (from, to) {
    if (this.textarea_el.setSelectionRange) {
      this.textarea_el.setSelectionRange(from, to);
    }
    else if (this.textarea_el.createTextRange) {
      var range = this.textarea_el.createTextRange();
      range.collapse(true);
      range.moveEnd('character', to);
      range.moveStart('character', from);
      range.select();
    }
    this.textarea_el.focus();
    this.scroll_to(from, to)
    return from == -1 ? null : from;
  }

  this.scroll_to = function (from, to) { //creates a temp div which 
    let text_val = this.textarea_el.value
    var div = document.createElement("div");
    div.innerHTML = text_val.slice(0, to);
    document.body.appendChild(div);
    this.textarea_el.scrollTop = div.offsetHeight - 60
    div.remove()
  }

  this.go_to_word = function (word, from = 0, tries = 0, starting_with = false, ending_with = false) {
    var target = word;
    if (starting_with) { target = target.substr(0, target.length - 1); }
    if (ending_with) { target = target.substr(1, target.length - 1); }

    if (this.textarea_el.value.substr(from, length).indexOf(target) == -1 || tries < 1) { console.log("failed"); return; }

    var length = this.textarea_el.value.length - from;
    var segment = this.textarea_el.value.substr(from, length)
    var location = segment.indexOf(target);
    var char_before = segment.substr(location - 1, 1);
    var char_after = segment.substr(location + target.length, 1);

    // Check for full word
    if (!starting_with && !ending_with && !char_before.match(/[a-z]/i) && !char_after.match(/[a-z]/i)) {
      left.select(location + from, location + from + target.length);
      var perc = (left.textarea_el.selectionEnd / parseFloat(left.chars_count));
      var offset = 60;
      this.textarea_el.scrollTop = (this.textarea_el.scrollHeight * perc) - offset;
      return location;
    }
    else if (starting_with && !char_before.match(/[a-z]/i) && char_after.match(/[a-z]/i)) {
      left.select(location + from, location + from + target.length);
      var perc = (left.textarea_el.selectionEnd / parseFloat(left.chars_count));
      var offset = 60;
      this.textarea_el.scrollTop = (this.textarea_el.scrollHeight * perc) - offset;
      return location;
    }
    else if (ending_with && char_before.match(/[a-z]/i) && !char_after.match(/[a-z]/i)) {
      left.select(location + from, location + from + target.length);
      var perc = (left.textarea_el.selectionEnd / parseFloat(left.chars_count));
      var offset = 60;
      this.textarea_el.scrollTop = (this.textarea_el.scrollHeight * perc) - offset;
      return location;
    }

    left.go_to_word(word, location + target.length, tries - 1, starting_with, ending_with);
  }

  this.select = function (from, to) {
    left.textarea_el.setSelectionRange(from, to);
  }

  this.time = function () {
    var d = new Date(), e = new Date(d);
    var since_midnight = e - d.setHours(0, 0, 0, 0);
    var timestamp = parseInt((since_midnight / 864) * 10);

    return timestamp / 1000;
  }

  this.splash = function (word) {
    // return 'Maybe you are my baby.'
    // These are the old ways to show welcome.
    // var time = this.time();
    // if (time > 800) { return "Good evening."; }
    // if (time > 600) { return "Good afternoon."; }
    // if (time < 350) { return "Good morning."; }
    // return "Good day.";
    // return word || 'Hello World.\nHello World.'
    return '';
  }

  this.reset = function () {
    left.textarea_el.value = left.splash();
    // left.textarea_el.value = left.project.openStart();
    left.dictionary.update();
    left.refresh();
  }
}

function is_json(text) {
  try {
    JSON.parse(text);
    return true;
  }
  catch (error) {
    return false;
  }
}