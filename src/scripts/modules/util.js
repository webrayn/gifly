"use strict";

function adjustBodyPadding() {
  // if html has a vertical scrollbar, padding-right should be adjusted on the body to avoid unsightly gap
  const tabList = document.getElementById("tab-list");
  // console.log(
  //   `list scroll height: ${tabList.scrollHeight}, list clientHeight: ${
  //   tabList.clientHeight
  //   }`
  // );
  if (tabList.scrollHeight > 554) {
    tabList.classList.add("tab-list--scroll");
  } else {
    console.log("removing scroll class");
    tabList.classList.remove("tab-list--scroll");
  }
}

function addNewColor(URL) {
  this.tabURLs[URL].color = `hsl(${this.hue}, 100%, ${this.lightness}%)`;
  if (this.hue <= 280) {
    this.hue += 40;
  } else if (this.lightness == 60) {
    this.hue = 0;
    this.lightness = 40;
  }
}

function getListedTabs() {
  return [...document.getElementsByClassName("tab-list-item")] || [];
}

function calculateScrollbarHeight() {
  const container = document.getElementById("tab-list-container");
  const margin = 6;
  const visibleContentHeight = container.offsetHeight - margin; // 500
  const wholeContentHeight = container.scrollHeight - margin;
  const contentHeightRatio = visibleContentHeight / wholeContentHeight;
  const scrollbarHeight = visibleContentHeight * contentHeightRatio;
  return scrollbarHeight;
}

function adjustScrollbarHeight() {
  const scrollbarThumb = document.getElementById("scrollbar-thumb");

  scrollbarThumb.style.setProperty(
    "--thumb-height",
    calculateScrollbarHeight() + "px"
  );
}

function calculateScrollSpeed() { }

function dragTab(options = {}) {
  const { distance = 0, speed = 0 } = options;
  const draggedTab = document.getElementsByClassName(
    "tab-list-item--draggable"
  )[0];
  if (draggedTab) {
    draggedTab.style.setProperty("--y-offset", distance + "px");
  }
}

function scroll(distance, options = {}) {
  const { scrollBarOnly = false, speed = 0 } = options;
  dragTab({ distance });
  const container = document.getElementById("tab-list-container");
  const content = container.children[0];
  const margin = 6;
  const visibleContentHeight = container.offsetHeight - margin; // 500
  const wholeContentHeight = container.scrollHeight - margin;
  const hiddenContentHeight = wholeContentHeight - visibleContentHeight;

  // const contentOffsetHeight = content.offsetHeight;
  const scrollbarThumb = document.getElementById("scrollbar-thumb");

  const containerScrollTop = Number.parseFloat(
    container.style.getPropertyValue("--scrolltop") || 0
  );

  const containerToContentRatio = visibleContentHeight / wholeContentHeight;
  // this value doesn't change no matter where thumb is. Max offset is always the same.
  const maxScrollbarThumbOffset = hiddenContentHeight * containerToContentRatio;
  const currentThumbOffset = containerScrollTop * containerToContentRatio;

  if (currentThumbOffset < maxScrollbarThumbOffset) {
    const newScrollbarThumbOffset = distance * containerToContentRatio;

    scrollbarThumb.style.setProperty(
      "--thumb-offset",
      Math.min(newScrollbarThumbOffset, maxScrollbarThumbOffset) + "px"
    );
  }

  if (scrollBarOnly == false) {
    content.classList.add("tab-list--scroll");
    const availableScrollDistance = hiddenContentHeight;

    if (containerScrollTop < availableScrollDistance) {
      const maxOffset = (hiddenContentHeight - containerScrollTop) * -1;
      const newOffset = distance * -1;

      content.style.setProperty(
        "--y-offset",
        Math.max(newOffset, maxOffset) + "px"
      );
    }
  }
}

module.exports = {
  adjustBodyPadding,
  addNewColor,
  getListedTabs,
  adjustScrollbarHeight,
  calculateScrollbarHeight,
  scroll,
  dragTab
};
