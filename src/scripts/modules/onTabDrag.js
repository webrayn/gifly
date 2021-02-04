"use strict";

const scroll = require("./scroll");
const dragTab = require("./dragTab");

function onTabDrag(event) {
  const dragState = this.dragState;

  // it's possible that scrolltop was updated while tab was already being dragged, when user scrolled via mouse wheel. So we have to get it on every mouse move.
  dragState.tabListScrollTop = +dragState.tabListContainer.style.getPropertyValue(
    "--scrolltop"
  );

  // const currentTabTopPosition = event.pageY - shiftY + tabListScrollTop;
  dragState.draggedTabPosition = event.pageY - dragState.shiftY;

  if (dragState.shouldScroll()) {
    const distanceToScroll =
      dragState.draggedTabPosition -
      Math.max(426, dragState.originalTabPositions[dragState.draggedTab.id]);
    scroll.call(dragState, { distance: distanceToScroll });
  }

  const yOffset =
    dragState.draggedTabPosition -
    dragState.originalTabPositions[dragState.draggedTab.id] +
    dragState.tabListScrollTop;

  const distanceToDrag = Math.min(yOffset, dragState.maxTabOffsetBelow);

  // change dragged tab's position
  dragTab.call(this, { distance: distanceToDrag });
}

module.exports = onTabDrag;
