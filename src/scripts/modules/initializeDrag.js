"use strict";
const onTabDrag = require("./onTabDrag");
const onTabDragEnd = require("./onTabDragEnd");
const getListedTabs = require("./util").getListedTabs;

// this function declares and initializes the variables needed for handling all aspects of dragging a tab
function initializeDrag(event) {
  const tabListContainer = document.getElementById("tab-list-container");
  const tabListScrollTop = this.scrollTop;
  const tabList = document.getElementById("tab-list");
  const tabListHeight = tabList.offsetHeight;
  const margin = 6;
  // tabListContainer.style.setProperty("--scrolltop", tabListScrollTop);
  const listedTabs = getListedTabs();
  const headerHeight = document.getElementById("header").offsetHeight;
  const draggedTab = event.target.parentElement;
  const shiftY = event.clientY - draggedTab.getBoundingClientRect().top;
  const draggedTabPosition = event.pageY - shiftY;
  const tabIndex = listedTabs.findIndex(t => t.id === draggedTab.id);
  const tabsAbove = listedTabs.slice(0, tabIndex);
  const tabsBelow = listedTabs.slice(tabIndex + 1);
  draggedTab.setPointerCapture(event.pointerId);
  draggedTab.classList.add("tab-list-item--draggable");
  draggedTab.classList.remove("tab-list-item--held-down");
  listedTabs
    .filter(t => t.id != draggedTab.id)
    .forEach(t => {
      t.classList.add("tab-list-item--moveable", "tab-list-item--moving");
    });
  const originalTabPositions = listedTabs.reduce((a, t) => {
    a[t.id] = t.offsetTop + headerHeight;
    return a;
  }, {});

  this.dragState = {
    active: true,
    draggedTab,
    pointerPosition: 0,
    draggedTabPosition,
    headerHeight,
    tabList,
    tabListHeight,
    tabListContainer,
    tabListScrollTop,
    margin,
    tabHeight: 40,
    shiftY,
    listedTabs,
    tabIndex,
    tabsAbove,
    tabsBelow,
    originalTabPositions,
    maxTabOffsetBelow:
      tabListHeight -
      margin +
      headerHeight -
      draggedTab.offsetHeight -
      originalTabPositions[draggedTab.id],
    shouldScroll() {
      return this.draggedTabPosition > 426;
    }
  };

  draggedTab.onpointermove = onTabDrag.bind(this);
  draggedTab.onpointerup = onTabDragEnd.bind(this);
  // document.addEventListener("pointerup", onTabDrag, { once: true });
}

module.exports = initializeDrag;
