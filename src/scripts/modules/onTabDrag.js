"use strict";

const scroll = require("./scroll");
const dragTab = require("./dragTab");

function onTabDrag(event) {
  // it's possible that scrolltop was updated while tab was already being dragged, when user scrolled via mouse wheel. So we have to get it on every mouse move.
  this.tabListScrollTop = +this.tabListContainer.style.getPropertyValue(
    "--scrolltop"
  );

  // const currentTabTopPosition = event.pageY - shiftY + tabListScrollTop;
  this.draggedTabPosition = event.pageY - this.shiftY;

  if (this.shouldScroll()) {
    const distanceToScroll =
      this.draggedTabPosition -
      Math.max(426, this.originalTabPositions[this.draggedTab.id]);
    scroll.call(this, { distance: distanceToScroll });
  }

  const yOffset =
    this.draggedTabPosition -
    this.originalTabPositions[this.draggedTab.id] +
    this.tabListScrollTop;

  const distanceToDrag = Math.min(yOffset, this.maxTabOffsetBelow);

  // change dragged tab's position
  dragTab.call(this, { distance: distanceToDrag });
}

module.exports = onTabDrag;
