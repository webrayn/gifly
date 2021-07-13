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
  const initialTabPositions = listedTabs.reduce((a, t) => {
    a[t.id] = t.offsetTop;
    return a;
  }, {});
  const headerHeight = document.getElementById("header").offsetHeight;
  const tabListOffset = 0;
  const draggedTab = event.target.parentElement;
  const shiftY = event.clientY - draggedTab.getBoundingClientRect().top;
  const pointerPosition = event.pageY;
  const draggedTabPosition = pointerPosition - shiftY;
  const tabTopPosInViewport = pointerPosition - shiftY;
  const maxTabPosition = tabListHeight - margin - draggedTab.offsetHeight;
  const minTabPosition = 0;
  let lastTabPos =
    pointerPosition - shiftY - headerHeight + tabListScrollTop + tabListOffset;
  lastTabPos = Math.min(maxTabPosition, Math.max(minTabPosition, lastTabPos));
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

  this.dragState = {
    animation: null,
    scroll: false,
    draggedTab,
    pointerPosition,
    draggedTabPosition,
    headerHeight,
    tabList,
    tabListHeight,
    tabListContainer,
    tabListScrollTop,
    initialPosition: initialTabPositions[draggedTab.id],
    maxScrollTop,
    tabOffset: 0,
    tabListOffset,
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
    minTabPosition,
    maxTabPosition,
    maxTabOffsetAbove: headerHeight - initialTabPositions[draggedTab.id],
    maxTabOffsetBelow:
      tabListHeight -
      margin -
      draggedTab.offsetHeight -
      initialTabPositions[draggedTab.id],
    lastTabPos,
    getUpdatedTabPos() {
      // console.log(
      //   `pointerPosition: ${this.pointerPosition}, shiftY: ${this.shiftY
      //   }, headerHeight: ${this.headerHeight}, tabListScrollTop: ${this.tabListScrollTop
      //   }, tabListOffset: ${this.tabListOffset}`
      // );
      const position =
        this.pointerPosition -
        this.shiftY -
        this.headerHeight +
        this.tabListScrollTop +
        this.tabListOffset;
      // const position =
      //   this.initialPosition +
      //   this.tabOffset +
      //   this.headerHeight +
      //   this.tabListScrollTop +
      //   this.tabListOffset;

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
