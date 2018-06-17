# Left

Left is a simple open-source distractionless writing application created to help organize ideas. 

<img src='https://raw.githubusercontent.com/hundredrabbits/Left/master/PREVIEW.jpg' width="600"/>

## Guide

Left is a simple, minimalist, open-source and cross-platform text editor. 

- Create markers by beginning lines with `#`, `##` or `--`.
- Open a text file by dragging it, or with `ctrl o`.
- Highlight some text and press `ctrl k` to enable the speed reader.
- Press `tab` to auto-complete a previously used, or common, word.
- Press `shift tab` to scroll through the selected word's synonyms.

### Details

- `L`, stands for Lines.
- `W`, stands for Words.
- `V`, stands for Vocabulary, or unique words.
- `C`, stands for Characters.

## Controls

## default Mode

### File
- New: `CmdOrCtrl+N`
- Open: `CmdOrCtrl+O`
- Save: `CmdOrCtrl+S`
- Save As: `CmdOrCtrl+Shift+S`
- Discard Changes: `CmdOrCtrl+D`
- Close File: `CmdOrCtrl+W`
- Force Close: `CmdOrCtrl+Shift+W`

### Select
- Select Autocomplete: `Tab`
- Select Synonym: `Shift+Tab`

### Navigation
- Next Marker: `CmdOrCtrl+]`
- Prev Marker: `CmdOrCtrl+[`
- Next File: `CmdOrCtrl+Shift+]`
- Prev File: `CmdOrCtrl+Shift+[`
- Find: `CmdOrCtrl+F`

### View
- Inc Zoom: `CmdOrCtrl+Plus`
- Dec Zoom: `CmdOrCtrl+-`
- Reset Zoom: `CmdOrCtrl+0`

### Mode
- Reader: `CmdOrCtrl+K`
- Operator: `CmdOrCtrl+F`
- Insert: `CmdOrCtrl+I`

## reader Mode

### Reader
- Stop: `Esc`

## operator Mode

### Operator
- Stop: `Esc`

## insert Mode

### Insert
- Date: `CmdOrCtrl+D`
- Time: `CmdOrCtrl+T`
- Path: `CmdOrCtrl+P`
- Header: `CmdOrCtrl+H`
- SubHeader: `CmdOrCtrl+Shift+H`
- Comment: `CmdOrCtrl+/`
- Line: `CmdOrCtrl+L`

### Mode
- Stop: `Esc`

<img src='https://cdn.rawgit.com/hundredrabbits/Left/master/LAYOUT.svg?v=1' width="600"/>

## Extras

- Download additional [themes](https://github.com/hundredrabbits/Themes).
- Support this project through [Patreon](https://patreon.com/100).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).

## Todos

* [x] 翻译划词
* [x] 自定义译文
* [ ] 使用共享译文
* [x] 替换原文
* [x] 译文切换
* [ ] 记忆译文
* [ ] 推荐译文
* [ ] 生词簿
* [ ] 译文打分
* [x] 保存文件


```
{
  user: { '[id]': { name, password } },
  share: { '[id]': { userId, original, translated } }, // === custom translate
  
}
```