"use strict";

const util = require("./util");
const adjustMenu = require("./adjustMenu");

// function filter() {
//   const input = document.getElementById("filter");
//   const filter = input.value.toLowerCase();
//   // ensure that tabList stays original height, but hide the scrollbar if appropriate
//   if (filter != "") {
//     util.adjustScrollbar();
//   } else {
//     // setTimeout(() => this.filterIsActive)
//     this.filteredOutTabs = 0;
//   }
//   const listedTabs = [...document.getElementsByClassName("tab-list-item")];
//   listedTabs.forEach(tab => {
//     const title = this.tabs[tab.id].title.toLowerCase();
//     if (!title.includes(filter)) {
//       tab.ariaHidden = "true";
//       tab.classList.add("tab-list-item--hidden");
//       // tab.classList.remove("tab-list-item--filtered");
//       this.filteredOutTabs += 1;
//     } else {
//       tab.style.setProperty("--y-offset", this.filteredOutTabs * 46 + "px");
//       tab.ariaHidden = "false";
//       tab.classList.remove("tab-list-item--hidden");
//       if (this.filteredOutTabs > 0) {
//         this.filteredOutTabs -= 1;
//       }
//       tab.style.setProperty("--offset-speed", 1000 + "ms");
//       tab.classList.add("tab-list-item--filtered");
//     }
//     // tab.style.setProperty("--y-offset", this.filteredOutTabs * 46 * -1 + "px");
//   });
// }
function filter() {
  const state = this;
  state.filteredOutTabs = 0;
  const input = document.getElementById("filter");
  const filter = input.value.toLowerCase();

  const hideTab = tab => { };
  // ensure that tabList stays original height, but hide the scrollbar if appropriate
  document.getElementById("tab-list").classList.add("tab-list--filtered");

  util.adjustScrollbar();

  // document.getElementById("tab-list").classList.remove("tab-list--filtered");
  // setTimeout(() => state.filterIsActive)
  state.filteredOutTabs = 0;

  const listedTabs = [...document.getElementsByClassName("tab-list-item")];
  // const filteredTabs = listedTabs.filter(tab => tab.title.includes(filter));

  listedTabs.forEach(tab => {
    // as long as filter is active, all tabs are filtered
    // tab.classList.add("tab-list-item--filtered");
    // tab.style.setProperty("--y-offset", 0);
    tab.classList.remove("tab-list-item--hidden");
    tab.classList.remove("tab-list-item--filtered");
    const title = state.tabs[tab.id].title.toLowerCase();

    // if tab's title doesn't include filter
    if (!title.includes(filter)) {
      tab.style.setProperty("--y-offset", state.filteredOutTabs * -46 + "px");
      // if tab isn't already hidden
      if (!tab.classList.contains("tab-list-item--hidden")) {
        tab.ariaHidden = "true";
        tab.classList.add("tab-list-item--hidden");
        tab.setAttribute("disabled", true);
        state.filteredOutTabs += 1;
      }
      // if tab's title does include the filter
    } else {
      tab.style.setProperty("--y-offset", state.filteredOutTabs * -46 + "px");
      tab.classList.add("tab-list-item--filtered");
      // if tab is hidden, unhide it
      if (tab.classList.contains("tab-list-item--hidden")) {
        tab.ariaHidden = "false";
        tab.classList.remove("tab-list-item--hidden");
        state.filteredOutTabs -= 1;
      }
    }
  });

  console.log(state.filteredOutTabs);

  // adjustMenu.call(state);
}

module.exports = filter;
