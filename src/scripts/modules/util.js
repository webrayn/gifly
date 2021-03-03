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

// this will be called when tabs are first rendered, when a tab is deleted, and when tabs are filtered
function adjustScrollbar() {
  // determine if scrollbar is needed, and if it's not then remove it
  const container = document.getElementById("tab-list-container");
  const margin = 6;
  const numOfTabs = document.getElementsByClassName("tab-list-item").length;
  // console.log(numOfTabs);
  const visibleContentHeight = container.offsetHeight - margin; // 500
  const wholeContentHeight = container.scrollHeight - margin;
  const hiddenContentHeight = wholeContentHeight - visibleContentHeight;
  const containerToContentRatio = visibleContentHeight / wholeContentHeight;
  const scrollbarTrack = document.getElementById("scrollbar-track");
  if (numOfTabs > 11) {
    container.children[0].classList.add("tab-list--scrollable");
    scrollbarTrack.classList.remove("scrollbar-track--hidden");
  } else {
    container.children[0].classList.remove("tab-list--scrollable");
    scrollbarTrack.classList.add("scrollbar-track--hidden");
  }

  // const content = container.children[0];

  const scrollbarThumb = document.getElementById("scrollbar-thumb");
  const scrollbarHeight = calculateScrollbarHeight();

  const containerScrollTop = Number.parseFloat(
    container.style.getPropertyValue("--scrolltop") || 0
  );

  // this value doesn't change no matter where thumb is. Max offset is always the same.
  this.maxScrollbarThumbOffset = hiddenContentHeight * containerToContentRatio;
  const currentThumbOffset = containerScrollTop * containerToContentRatio;

  if (currentThumbOffset > this.maxScrollbarThumbOffset) {
    const newScrollbarThumbOffset = this.maxScrollbarThumbOffset;
    scrollbarThumb.style.setProperty(
      "--thumb-offset",
      Math.min(newScrollbarThumbOffset, this.maxScrollbarThumbOffset) + "px"
    );
  }

  scrollbarThumb.style.setProperty("--thumb-height", scrollbarHeight + "px");
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

module.exports = {
  adjustBodyPadding,
  addNewColor,
  getListedTabs,
  adjustScrollbar,
  calculateScrollbarHeight,
  scroll,
  dragTab
};
