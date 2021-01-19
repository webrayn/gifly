"use strict";

function dragTab(options = {}) {
  const { distance = 0, speed = 0 } = options;
  // const draggedTab = document.getElementsByClassName(
  //   "tab-list-item--draggable"
  // )[0];
  if (this.draggedTab) {
    this.draggedTab.style.setProperty("--y-offset", distance + "px");
  }

  this.tabsAbove.forEach(tab => {
    const totalDifference =
      this.originalTabPositions[tab.id] -
      this.draggedTabPosition -
      this.tabListScrollTop;
    // get the difference between the bottom of todo and the top of draggable todo.
    const difference = totalDifference + this.tabHeight;
    // calculate tab offset (should be min of 0, max of 46)
    const offset = Math.max(
      Math.min(difference * 1.3, this.tabHeight + this.margin),
      0
    );

    tab.style.setProperty("--y-offset", offset + "px");
    tab.style.setProperty(
      "--opacity",
      Math.max(Math.abs(offset - 23) / 23, 0.62)
    );
    tab.style.setProperty(
      "--scale",
      Math.max(Math.abs(offset - 23) / 23, 0.98)
    );
  });

  this.tabsBelow.forEach(tab => {
    const totalDifference =
      this.originalTabPositions[tab.id] -
      this.draggedTabPosition -
      this.tabListScrollTop;
    const difference = totalDifference - this.tabHeight;
    const offset = Math.min(
      Math.max(difference * 1.3, (this.tabHeight + this.margin) * -1),
      0
    );

    tab.style.setProperty("--y-offset", offset + "px");
    tab.style.setProperty(
      "--opacity",
      Math.max(Math.abs(offset + 23) / 23, 0.62)
    );
    tab.style.setProperty(
      "--scale",
      Math.max(Math.abs(offset + 23) / 23, 0.98)
    );
  });
}

module.exports = dragTab;
