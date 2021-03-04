"use strict";

const util = require("./util");
const adjustMenu = require("./adjustMenu");

// in order for dragTab to work, it's first necessary to calculate offsetTops of all filtered tabs based on their offset value. It's not too hard.
// also need to keep scrollTop in mind.
function filter() {
  const state = this;
  state.filteredOutTabs = 0;
  const input = document.getElementById("filter");
  const filter = input.value.toLowerCase();

  const hideTab = tab => {
    tab.ariaHidden = "true";
    tab.classList.add("tab-list-item--hidden");
    tab.setAttribute("disabled", true);
  };

  const unhideTab = tab => {
    tab.ariaHidden = "false";
    tab.classList.remove("tab-list-item--hidden");
    tab.setAttribute("disabled", false);
  };
  // ensure that tabList stays original height, but hide the scrollbar if appropriate
  document.getElementById("tab-list").classList.add("tab-list--filtered");

  util.adjustScrollbar();

  // document.getElementById("tab-list").classList.remove("tab-list--filtered");
  // setTimeout(() => state.filterIsActive)
  state.totalFilteredOutTabs = 0;
  state.lastFilteredOutTabs = 0;
  let filteredInTabs = 0;
  // state.filteredInTabs = 0;

  const listedTabs = [...document.getElementsByClassName("tab-list-item")];
  // const filteredTabs = listedTabs.filter(tab => tab.title.includes(filter));

  listedTabs.forEach(tab => {
    tab.style.setProperty("--y-offset", 0);
    tab.style.setProperty("--delay", 0);
    tab.style.setProperty("--speed", "1000ms");
    const title = state.tabs[tab.id].title.toLowerCase();
    tab.style.setProperty(
      "--y-offset",
      state.totalFilteredOutTabs * -46 + "px"
    );
    // if tab's title doesn't include filter
    if (!title.includes(filter)) {
      state.totalFilteredOutTabs += 1;
      // if tab isn't already hidden
      if (!tab.classList.contains("tab-list-item--hidden")) {
        hideTab(tab);
        tab.classList.remove("tab-list-item--filtered");
      }
      // if tab's title does include the filter
    } else {
      tab.style.setProperty("--delay", filteredInTabs ? "0ms" : "1000ms");
      tab.classList.add("tab-list-item--filtered");
      // if tab is hidden, unhide it
      if (tab.classList.contains("tab-list-item--hidden")) {
        unhideTab(tab);
        tab.style.setProperty("--delay", "1000ms");
        tab.style.setProperty("--speed", "0ms");
        filteredInTabs += 1;
      }
    }
  });

  console.log(state.totalFilteredOutTabs);

  // adjustMenu.call(state);
}

module.exports = filter;
