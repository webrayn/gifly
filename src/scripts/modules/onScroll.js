"use strict";

const scroll = require("./scroll");
const dragTab = require("./dragTab");

function onScroll(e) {
  const container = e.target;
  const scrollTop = container.scrollTop;
  const scrollOptions = { distance: scrollTop, scrollBarOnly: true };
  // update scrolltop in state so that other functions get the latest value without having to use elem.scrollTop and forcing reflow
  this.scrollTop = scrollTop;

  // check if a tab is being dragged right now
  // if so, drag the tab to keep up with the changing scrolltop
  if (this.dragState) {
    // state.dragState.scrollTop = scrollTop;
    dragTab.call(this, { distance: scrollTop });
  }

  scroll.call(this, scrollOptions);
  // container.style.setProperty("--scrolltop", e.target.scrollTop);
}

module.exports = onScroll;
