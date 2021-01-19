"use strict";

function onTabDragEnd(event) {
  // get tabList offset value, and scroll by that amount
  // remember to hide system scrollbar and add custom one that scrolls with the offset
  const tabListOffset = Number.parseFloat(
    this.tabList.style.getPropertyValue("--y-offset") || 0
  );
  this.tabList.style.setProperty("--y-offset", 0 + "px");
  this.tabList.classList.remove("tab-list--scroll");
  this.tabListContainer.scroll(0, (tabListOffset - this.tabListScrollTop) * -1);
  this.tabListContainer.style.setProperty("--scrolltop", this.tabListScrollTop);

  this.draggedTab.onpointermove = null;
  this.draggedTab.onpointerup = null;
  const currentTabTopPosition =
    event.pageY - this.shiftY + this.tabListScrollTop;

  this.draggedTab.classList.remove("tab-list-item--draggable");
  this.listedTabs.forEach(t => {
    t.style.setProperty("--y-offset", 0);
    t.classList.remove("tab-list-item--moving");
  });

  if (currentTabTopPosition < this.originalTabPositions[this.draggedTab.id]) {
    this.tabsAbove.forEach(t => {
      if (
        this.originalTabPositions[t.id] + 23 > currentTabTopPosition &&
        this.originalTabPositions[t.id] - this.margin - 23 <
        currentTabTopPosition
      ) {
        this.tabList.insertBefore(this.draggedTab, t);
      }
    });
  } else if (
    currentTabTopPosition > this.originalTabPositions[this.draggedTab.id]
  ) {
    this.tabsBelow.forEach(t => {
      if (
        this.originalTabPositions[t.id] + 23 - this.margin <
        currentTabTopPosition + this.tabHeight
        // originalTabPositions[t.id] + tabHeight + margin + 23 >
        // currentTabTopPosition + tabHeight
      ) {
        this.tabList.insertBefore(this.draggedTab, t.nextSibling);
      }
    });
  }
}

module.exports = onTabDragEnd;
