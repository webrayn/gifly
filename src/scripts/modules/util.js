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

module.exports = {
  adjustBodyPadding,
  addNewColor,
  getListedTabs,
  adjustScrollbarHeight,
  calculateScrollbarHeight,
  scroll,
  dragTab
};
