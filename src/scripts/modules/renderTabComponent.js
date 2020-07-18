"use strict";

// const util = require("./util");
const createTabComponent = require("./createTabComponent");

function renderTabComponent(tab) {
  const tabsList = document.getElementById("tabs-list");
  const tabComponent = createTabComponent.call(this, tab);
  tabsList.appendChild(tabComponent);
  adjustBodyPadding();
}

function adjustBodyPadding() {
  // if html has a vertical scrollbar, padding-right should be adjusted on the body to avoid unsightly gap
  if (
    document.documentElement.scrollHeight >
    document.documentElement.clientHeight
  ) {
    document.body.classList.add("scroll");
  } else {
    document.body.classList.remove("scroll");
  }
}

module.exports = renderTabComponent;
