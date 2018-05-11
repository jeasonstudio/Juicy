document.onkeydown = function key_down(e) {
  left.last_char = e.key

  // Faster than Electron
  if (e.keyCode == 9) {
    if (e.shiftKey) {
      left.select_synonym();
    }
    else {
      left.select_autocomplete();
    }
    e.preventDefault();
    return;
  }

  // Reset index on space
  if (e.key == " " || e.key == "Enter") {
    left.selection.index = 0;
  }

  if (e.key.substring(0, 5) == "Arrow") {
    setTimeout(() => left.refresh(), 0) //force the refresh event to happen after the selection updates
    return;
  }

  // Slower Refresh
  if (e.key == "Enter" && left.textarea_el.value.length > 50000 || left.textarea_el.value.length < 50000) {
    setTimeout(() => { left.dictionary.update(), left.refresh() }, 0)
    return;
  }
};

document.onkeyup = (e) => {
  if (e.keyCode == 9) {
    return;
  }
  left.refresh();
}

window.addEventListener('dragover', function (e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
});

window.addEventListener('drop', function (e) {
  e.stopPropagation();
  e.preventDefault();

  // Prevent opening a new file when the current file
  // has changes (same behavior as the keyboard shortcut)
  if (left.project.has_changes()) { left.project.alert(); return; }

  var files = e.dataTransfer.files;

  for (id in files) {
    var file = files[id];
    if (file.type && !file.type.match(/text.*/)) { console.log(`Skipped ${file.type} : ${file.path}`); continue; }
    if (file.path && file.path.substr(-3, 3) == "thm") { continue; }
    left.project.add(file.path);
  }
});

document.addEventListener('wheel', function (e) {
  e.preventDefault();
  left.textarea_el.scrollTop += e.wheelDeltaY * -0.25;
  left.navi.update_scrollbar();
}, false)

window.addEventListener('resize', function (e) {
  if (window.innerWidth < 800) {
    document.body.className = "mobile";
  }
  else {
    document.body.className = "";
  }
}, false);

document.onmouseup = function on_mouseup(e) {
  left.selection.index = 0;
  left.operator.stop();
  left.refresh();
}