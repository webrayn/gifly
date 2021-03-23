"use strict";

const renderTabComponent = require("./renderTabComponent");
const getNewDuplicateColor = require("./util").getNewDuplicateColor;

function addTab(tab) {
  const state = this;
  state.tabs[`tab-${tab.id}`] = {
    index: tab.index,
    url: tab.url,
    title: tab.title
  };
  // if entry doesn't already exist for this tab's URL, create a new entry
  if (!state.tabIdsByURL[tab.url]) {
    state.tabIdsByURL[tab.url] = [`tab-${tab.id}`];
  } else {
    // if entry already exists, it means tab is a duplicate. Add current tab ID to the URL entry.
    state.tabIdsByURL[tab.url].push(`tab-${tab.id}`);
    // if this is the first duplicate, a color needs to be assigned to these tabs
    if (state.tabIdsByURL[tab.url].length == 2) {
      // if any discarded colors exist, use one of them instead of creating a new one
      if (state.availableColors.length > 0) {
        // state.tabIdsByURL[tab.url].color = state.availableColors.pop();
        state.duplicateColorsByURL[tab.url] = state.availableColors.pop();
        // save available colors to storage API here
        // { code here }
      } else {
        // addNewColor.call(state, tab.url);
        state.duplicateColorsByURL[tab.url] = getNewDuplicateColor.call(state);
      }
      // the first tab with the same title needs its indicator color updated, since it just became a duplicate
      const olderTabComponent = document.getElementById(
        state.tabIdsByURL[tab.url][0]
      );
      olderTabComponent.style.setProperty(
        "--duplicate-indicator-color",
        state.duplicateColorsByURL[tab.url]
      );
      olderTabComponent.classList.add("tab-list-item--duplicate");
    }
  }
  renderTabComponent.call(state, tab);
}

module.exports = addTab;
