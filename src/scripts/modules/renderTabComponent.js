"use strict";

// const util = require("./util");
const createTabComponent = require("./createTabComponent");

function renderTabComponent(tab) {
  const tabsList = document.getElementById("tab-list");
  const tabComponent = createTabComponent.call(this, tab);
  tabsList.appendChild(tabComponent);
  adjustBodyPadding();
}

function adjustBodyPadding() {
  // if html has a vertical scrollbar, padding-right should be adjusted on the body to avoid unsightly gap
  const tabList = document.getElementById("tab-list");
  if (tabList.scrollHeight > tabList.clientHeight) {
    tabList.classList.add("tab-list--scroll");
  } else {
    tabList.classList.remove("tab-list--scroll");
  }
}

module.exports = renderTabComponent;
