"use strict";

function dragTab(options = {}) {
  const { distance = 0, speed = 0 } = options;
  const dragState = this.dragState;

  if (dragState) {
    // console.log("firing");
    // change position of the dragged tab
    dragState.draggedTab.style.setProperty("--y-offset", distance + "px");
    dragState.tabsAbove.forEach(tab => {
      const totalDifference =
        dragState.originalTabPositions[tab.id] -
        dragState.draggedTabPosition -
        dragState.tabListScrollTop;
      // get the difference between the bottom of todo and the top of draggable todo.
      const difference = totalDifference + dragState.tabHeight;
      // calculate tab offset (should be min of 0, max of 46)
      const offset = Math.max(
        Math.min(difference * 1.3, dragState.tabHeight + dragState.margin),
        0
      );

      tab.style.setProperty("--y-offset", offset + "px");
      tab.style.setProperty(
        "--opacity",
        Math.max(Math.abs(offset - 23) / 23, 0.62)
      );
      // the largest sale for moving tab is 0.99. Smallest is 0.98.
      tab.style.setProperty(
        "--scale",
        Math.max(Math.abs(offset - 23) / 23 - 0.01, 0.98)
      );
    });

    dragState.tabsBelow.forEach(tab => {
      const totalDifference =
        dragState.originalTabPositions[tab.id] -
        dragState.draggedTabPosition -
        dragState.tabListScrollTop;
      const difference = totalDifference - dragState.tabHeight;
      const offset = Math.min(
        Math.max(
          difference * 1.3,
          (dragState.tabHeight + dragState.margin) * -1
        ),
        0
      );

      tab.style.setProperty("--y-offset", offset + "px");
      tab.style.setProperty(
        "--opacity",
        Math.max(Math.abs(offset + 23) / 23, 0.62)
      );
      // the largest sale for moving tab is 0.99. Smallest is 0.98.
      tab.style.setProperty(
        "--scale",
        Math.max(Math.abs(offset + 23) / 23 - 0.01, 0.98)
      );
    });
  } else {
    throw new Error("dragState object is not initialized");
  }
}

module.exports = dragTab;
