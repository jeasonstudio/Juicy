function Navi() {
  this.el = document.createElement('navi');
  this.markers = [];

  this.update = function () {
    this.el.innerHTML = "";

    if (left.project.paths.length > 0) {
      this.project_markers();
    }
    else {
      this.display_markers();
    }

    this.update_scrollbar();
  }

  this.project_markers = function () {
    for (var id = 0; id < left.project.paths.length; id++) {
      // Project markers
      var path = left.project.paths[id];
      var parts = path.replace(/\\/g, "/").split("/")
      var file_name = parts[parts.length - 1]
      var file_el = document.createElement('li');
      file_el.destination = id;
      file_el.className = left.project.index == id ? 'file active' : 'file';
      file_el.textContent = file_name.substr(-file_name.length, 20);
      this.el.appendChild(file_el);
      file_el.onmouseup = function on_mouseup(e) { left.project.show_file(e.target.destination); }
      // File Markers
      if (id != left.project.index) { continue; }
      file_el.className += left.project.has_changes() ? " changes" : "";
      this.display_markers();
    }
  }

  this.display_markers = function () {
    this.update_markers();

    var active_line_id = left.active_line_id();
    var i = 0;
    var marker_num = left.options.marker_num
    for (var marker_id = 0; marker_id < this.markers.length; marker_id++) {
      var marker = this.markers[marker_id];
      var next_marker = this.markers[i + 1];
      var el = document.createElement('li');
      el.destination = marker.line;
      if (marker_num) {
        el.innerHTML = marker.text + "<span>" + marker.line + "</span>";
      } else {
        el.innerHTML = marker.text;
      }
      el.className = active_line_id >= marker.line && (!(next_marker) || active_line_id < next_marker.line) ? marker.type + " active fh" : marker.type + " fm";
      el.className += marker.type == "header" ? " fh" : "";
      el.onmouseup = function on_mouseup(e) { left.go_to_line(e.target.destination); }
      this.el.appendChild(el);
      i += 1;
    }

  }

  this.update_markers = function () {
    var text = left.textarea_el.value;
    var lines = text.split("\n");
    this.markers = [];

    left.lines_count = lines.length;
    let regex = new RegExp(/[\w][^\w\-]+[\w]/g), matches = [], match;
    while (match = regex.exec(text)) {
      matches.push(match);
      regex.lastIndex = match.index + 1;
    }
    left.words_count = matches.length + 1;
    left.chars_count = text.length;

    for (var line_id in lines) {
      var line = lines[line_id];
      if (line.substr(0, 2).replace(/@/g, "#") == "##") {
        var text = line.substring(2).trim();
        text = text.replace(/[@#]+/, (match) => { return new Array(match.length + 1).join("\u200b ") })
        this.markers.push({ text: text, line: line_id, type: "note" });
      }
      else if (line.substr(0, 1).replace(/@/g, "#") == "#") {
        var text = line.substring(1).trim();
        this.markers.push({ text: text, line: line_id, type: "header" });
      }
      else if (line.substr(0, 2).replace(/@/g, "#") == "--") {
        var text = line.substring(2).trim();
        if (text.indexOf(" : ")) {
          text = text.split(" : ")[0].trim();
        }
        this.markers.push({ text: text, line: line_id, type: "comment" });
      }
    }
    // End
  }

  this.update_scrollbar = function () {
    var scroll_distance = left.textarea_el.scrollTop;
    var scroll_max = left.textarea_el.scrollHeight - left.textarea_el.offsetHeight;
    var scroll_perc = (scroll_max == 0) ? 0 : (scroll_distance / scroll_max);

    // scrollTop is floating point while others are rounded down to int,
    // which sometimes makes the percentage go over 100%
    scroll_perc = Math.min(1, scroll_perc);

    left.scroll_el.style.transform = "scaleX(" + scroll_perc + ")";

    // % of navi which is overflowing (we need this because translateY is in % of navi height)
    var navi_overflow_perc = (left.navi.el.scrollHeight / window.innerHeight) - 1;

    // don't go below zero if the whole navi fits
    navi_overflow_perc = Math.max(0, navi_overflow_perc);

    left.navi.el.style.transform = "translateY(" + (-100 * scroll_perc * navi_overflow_perc) + "%)";
  }

  this.next = function () {
    var active_line_id = left.active_line_id();

    for (marker_id in this.markers) {
      var marker = this.markers[marker_id];
      if (marker.line > active_line_id) {
        left.go_to_line(marker.line);
        break;
      }
    }
  }

  this.prev = function () {
    var active_line_id = left.active_line_id();

    for (marker_id in this.markers) {
      var marker = this.markers[this.markers.length - (parseInt(marker_id) + 1)];
      if (marker.line < active_line_id) {
        left.go_to_line(marker.line);
        break;
      }
    }
  }
}
