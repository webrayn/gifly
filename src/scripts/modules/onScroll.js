"use strict";

const scroll = require("./scroll");
const dragTab = require("./dragTab");

function onScroll(e) {
  const container = e.target;
  const scrollTop = container.scrollTop;
  const scrollOptions = { distance: scrollTop, scrollBarOnly: true };

  // check if a tab is being dragged right now
  // if so, update the ScrollTop variable inside the dragState object
  // to make sure other functions have the most updated value
  const dragState = this.dragState;
  if (dragState) {
    dragState.tabListScrollTop = scrollTop;
    dragTab.call(this, { distance: scrollTop });
    // const yOffset =
    //   dragState.draggedTabPosition -
    //   dragState.originalTabPositions[dragState.draggedTab.id] +
    //   dragState.tabListScrollTop;
    // const distanceToDrag = Math.min(yOffset, dragState.maxTabOffsetBelow);
    // dragTab.call(this, { distance: distanceToDrag });
  }

  scroll.call(this, scrollOptions);
  container.style.setProperty("--scrolltop", e.target.scrollTop);
}

module.exports = onScroll;
