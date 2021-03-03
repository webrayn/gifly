"use strict";
const onTabDrag = require("./onTabDrag");
const onTabDragEnd = require("./onTabDragEnd");
const getListedTabs = require("./util").getListedTabs;

// this function declares and initializes the variables needed for handling all aspects of dragging a tab
function initializeDrag(event) {
  const tabListContainer = document.getElementById("tab-list-container");
  const tabListScrollTop = this.scrollTop;
  const maxScrollTop =
    tabListContainer.scrollHeight - tabListContainer.offsetHeight;
  const tabList = document.getElementById("tab-list");
  const tabListHeight = tabList.offsetHeight;
  const margin = 6;
  // tabListContainer.style.setProperty("--scrolltop", tabListScrollTop);
  const listedTabs = getListedTabs();
  const headerHeight = document.getElementById("header").offsetHeight;
  const draggedTab = event.target.parentElement;
  const shiftY = event.clientY - draggedTab.getBoundingClientRect().top;
  const draggedTabPosition = event.pageY - shiftY;
  const tabTopPosInViewport = event.pageY - shiftY;
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
  const initialTabPositions = listedTabs.reduce((a, t) => {
    a[t.id] = t.offsetTop;
    return a;
  }, {});

  this.dragState = {
    animation: null,
    scroll: false,
    draggedTab,
    pointerPosition: 0,
    draggedTabPosition,
    headerHeight,
    tabList,
    tabListHeight,
    tabListContainer,
    tabListScrollTop,
    maxScrollTop,
    tabOffset: 0,
    tabListOffset: 0,
    maxTabListOffset: maxScrollTop,
    margin,
    tabHeight: 40,
    shiftY,
    listedTabs,
    tabIndex,
    tabsAbove,
    tabsBelow,
    initialTabPositions,
    tabTopPosInViewport,
    tabPositionInTheList: 0,
    minTabPosition: 0,
    maxTabPosition: tabListHeight - margin - draggedTab.offsetHeight,
    maxTabOffsetAbove: headerHeight - initialTabPositions[draggedTab.id],
    maxTabOffsetBelow:
      tabListHeight -
      margin +
      headerHeight -
      draggedTab.offsetHeight -
      initialTabPositions[draggedTab.id],
    getTabTopPosInList() {
      const position =
        this.pointerPosition -
        this.shiftY -
        this.headerHeight +
        this.tabListScrollTop +
        this.tabListOffset;

      const correctedPosition = Math.min(
        this.maxTabPosition,
        Math.max(this.minTabPosition, position)
      );

      return correctedPosition;
    },
    shouldScroll() {
      const tabTopPosInViewport = this.pointerPosition - this.shiftY;
      const tabBottomPosInViewport = tabTopPosInViewport + this.tabHeight;
      if (tabTopPosInViewport < 184) {
        return "up";
      } else if (
        tabBottomPosInViewport > 420 &&
        this.tabListOffset < this.maxTabListOffset &&
        this.tabListScrollTop < this.maxScrollTop
      ) {
        return "down";
      } else return false;
    },
    getScrollSpeed() {
      const difference = this.draggedTabPosition - 426;
      if (difference < 10) {
        return "1000ms";
      } else if (difference < 30) {
        return "600ms";
      } else {
        return "200ms";
      }
    }
  };

  draggedTab.onpointermove = onTabDrag.bind(this);
  draggedTab.onpointerup = onTabDragEnd.bind(this);
  // document.addEventListener("pointerup", onTabDrag, { once: true });
}

module.exports = initializeDrag;
