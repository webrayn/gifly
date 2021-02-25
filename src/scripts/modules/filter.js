"use strict";

const util = require("./util");

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
  const input = document.getElementById("filter");
  const filter = input.value.toLowerCase();
  // ensure that tabList stays original height, but hide the scrollbar if appropriate
  document.getElementById("tab-list").classList.add("tab-list--filtered");
  if (filter != "") {
    util.adjustScrollbar();
  } else {
    // document.getElementById("tab-list").classList.remove("tab-list--filtered");
    // setTimeout(() => this.filterIsActive)
    this.filteredOutTabs = 0;
  }
  const listedTabs = [...document.getElementsByClassName("tab-list-item")];

  listedTabs.forEach(tab => {
    tab.classList.remove("tab-list-item--filtered");
    tab.classList.remove("tab-list-item--hidden");
    const title = this.tabs[tab.id].title.toLowerCase();
    if (!title.includes(filter)) {
      tab.ariaHidden = "true";
      tab.classList.add("tab-list-item--hidden");
      this.filteredOutTabs += 1;
    } else {
      tab.ariaHidden = "false";
      tab.style.setProperty("--y-offset", this.filteredOutTabs * 46 + "px");
      tab.classList.remove("tab-list-item--hidden");
      // if (this.filteredOutTabs > 0) {
      //   this.filteredOutTabs -= 1;
      // }
      tab.style.setProperty("--offset-speed", 1000 + "ms");
      tab.classList.add("tab-list-item--filtered");
    }
    // tab.style.setProperty("--y-offset", this.filteredOutTabs * 46 * -1 + "px");
  });
}

module.exports = filter;
