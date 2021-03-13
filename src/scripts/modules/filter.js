"use strict";

const util = require("./util");
const adjustMenu = require("./adjustMenu");

// in order for dragTab to work, it's first necessary to calculate offsetTops of all filtered tabs based on their offset value. It's not too hard.
// also need to keep scrollTop in mind.
// function filter() {
//   const state = this;
//   state.filteredOutTabs = 0;
//   const input = document.getElementById("filter");
//   const filter = input.value.toLowerCase();

//   const hideTab = tab => {
//     tab.ariaHidden = "true";
//     tab.classList.add("tab-list-item--hidden");
//     tab.setAttribute("disabled", true);
//   };

//   const unhideTab = tab => {
//     tab.ariaHidden = "false";
//     tab.classList.remove("tab-list-item--hidden");
//     tab.setAttribute("disabled", false);
//   };
//   // ensure that tabList stays original height, but hide the scrollbar if appropriate
//   document.getElementById("tab-list").classList.add("tab-list--filtered");

//   // document.getElementById("tab-list").classList.remove("tab-list--filtered");
//   // setTimeout(() => state.filterIsActive)
//   state.totalFilteredOutTabs = 0;
//   let filteredInTabs = 0;
//   // state.filteredInTabs = 0;

//   const listedTabs = [...document.getElementsByClassName("tab-list-item")];
//   // const filteredTabs = listedTabs.filter(tab => tab.title.includes(filter));

//   listedTabs.forEach(tab => {
//     // tab.classList.remove("tab-list-item--filtered");
//     // tab.classList.remove("tab-list-item--hidden");
//     tab.style.setProperty("--y-offset", 0);
//     tab.style.setProperty("--delay", 0);
//     tab.style.setProperty("--speed", "1000ms");
//     const title = state.tabs[tab.id].title.toLowerCase();
//     tab.style.setProperty(
//       "--y-offset",
//       state.totalFilteredOutTabs * -46 + "px"
//     );
//     // if tab's title doesn't include filter
//     if (!title.includes(filter)) {
//       state.totalFilteredOutTabs += 1;
//       // if tab isn't already hidden
//       if (!tab.classList.contains("tab-list-item--hidden")) {
//         hideTab(tab);
//         tab.classList.remove("tab-list-item--filtered");
//       }
//       // if tab's title does include the filter
//     } else {
//       tab.style.setProperty("--delay", filteredInTabs ? "0ms" : "1000ms");
//       tab.classList.add("tab-list-item--filtered");
//       // if tab is hidden, unhide it
//       if (tab.classList.contains("tab-list-item--hidden")) {
//         unhideTab(tab);
//         tab.style.setProperty("--delay", "1000ms");
//         tab.style.setProperty("--speed", "0ms");
//         filteredInTabs += 1;
//       }
//     }
//   });

//   // if filter is empty, filter classes should be removed from tabs
//   // if (filter == "") {
//   //   setTimeout(() => {
//   //     listedTabs.forEach(tab => {
//   //       tab.classList.remove("tab-list-item--filtered");
//   //       tab.classList.remove("tab-list-item--hidden");
//   //       tab.style.setProperty("--y-offset", 0);
//   //       tab.style.setProperty("--delay", 0);
//   //       tab.style.setProperty("--speed", "1000ms");
//   //       state.totalFilteredOutTabs = 0;
//   //     });
//   //   }, 2000);
//   // }

//   // console.log(state.totalFilteredOutTabs);
//   util.adjustScrollbar();
//   // adjustMenu.call(state);
// }
// function filter() {
//   const state = this;
//   state.filteredOutTabs = 0;
//   const input = document.getElementById("filter");
//   const filter = input.value.toLowerCase();

//   const hideTab = tab => {
//     tab.ariaHidden = "true";
//     tab.classList.add("tab-list-item--hidden");
//     tab.setAttribute("disabled", true);
//   };

//   const unhideTab = tab => {
//     tab.ariaHidden = "false";
//     tab.classList.remove("tab-list-item--hidden");
//     tab.setAttribute("disabled", false);
//   };

//   state.totalFilteredOutTabs = 0;
//   let filteredOutTabs = 0;
//   let filteredInTabs = 0;

//   const tabs = [...document.getElementsByClassName("tab-list-item")];

//   // determine which tabs include the filter
//   const tabMatches = tabs.map(tab => {
//     const title = state.tabs[tab.id].title.toLowerCase();
//     if (title.includes(filter)) {
//       return true;
//     } else {
//       return false;
//     }
//   });

//   // style tabs based on whether they (or those that preceed/follow them) match the filter
//   tabs.forEach(tab => {
//     tab.style.setProperty(
//       "--y-offset",
//       state.totalFilteredOutTabs * -46 + "px"
//     );
//     const title = state.tabs[tab.id].title.toLowerCase();

//     // if tab's title DOES NOT include filter
//     if (!title.includes(filter)) {
//       state.totalFilteredOutTabs += 1;
//       // if tab is not already hidden
//       if (!tab.classList.contains("tab-list-item--hidden")) {
//         hideTab(tab);
//         tab.classList.remove("tab-list-item--filtered");
//         filteredOutTabs += 1;
//       }
//     } else {
//       // if tab's title DOES include filter
//       tab.classList.add("tab-list-item--filtered");
//       tab.style.setProperty(
//         "--opacity-delay",
//         filteredOutTabs > 0 ? "1000ms" : "0ms"
//       );

//       if (!tab.classList.contains("tab-list-item--hidden")) {
//         // console.log(`Filter: ${filter} - ${title} is already visible!`);
//         // if tab is already visible
//         tab.style.setProperty("--speed", "1000ms");
//         tab.style.setProperty(
//           "--delay",
//           filteredOutTabs > 0 ? "1000ms" : "0ms"
//         );
//         // tab.style.setProperty("--delay", "1000ms");
//       } else {
//         // if tab is hidden, UNHIDE it
//         unhideTab(tab);
//         // if there are VISIBLE TABS after current tab, it needs opacity delay in order to wait for tabs that follow to move out the way
//         // it has nothing to do with how many tabs are filtered

//         if (filteredInTabs > 0 || filteredOutTabs > 0) {
//           tab.style.setProperty("--opacity-delay", "1000ms");
//         } else {
//           tab.style.setProperty("--opacity-delay", "0ms");
//         }
//         tab.style.setProperty("--delay", "0ms");
//         // console.log(title, filteredOutTabs);
//         tab.style.setProperty("--speed", "0ms");
//         filteredInTabs += 1;
//       }

//       tab.classList.add("tab-list-item--filtered");
//     }
//   });

//   // console.log(state.totalFilteredOutTabs);
//   util.adjustScrollbar();
//   // adjustMenu.call(state);
// }
function filter() {
  const state = this;
  const filterState = state.filterState;
  state.filteredOutTabs = 0;
  const input = document.getElementById("filter");
  const filter = input.value.toLowerCase();

  // scroll to the top of the list
  const tabListContainer = document.getElementById("tab-list-container");
  tabListContainer.scroll({
    top: 0,
    left: 0,
    behavior: "smooth"
  });

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

  state.totalFilteredOutTabs = 0;
  filterState.visibleTabs = 0;
  let filteredOutTabs = 0;
  let filteredInTabs = 0;

  const tabs = [...document.getElementsByClassName("tab-list-item")];

  // determine which tabs include the filter
  const titleIncludesFilter = tabs.map(tab => {
    const title = state.tabs[tab.id].title.toLowerCase();
    if (title.includes(filter)) {
      return true;
    } else {
      return false;
    }
  });

  // style tabs based on whether they (or those that preceed/follow them) match the filter
  tabs.forEach((tab, index) => {
    tab.style.setProperty(
      "--y-offset",
      state.totalFilteredOutTabs * -46 + "px"
    );

    // if tab's title DOES NOT include filter
    if (!titleIncludesFilter[index]) {
      state.totalFilteredOutTabs += 1;
      // if tab is not already hidden
      if (!tab.classList.contains("tab-list-item--hidden")) {
        hideTab(tab);
        tab.classList.remove("tab-list-item--filtered");
        filteredOutTabs += 1;
        filterState.visibleTabs -= 1;
      }
    } else {
      // if tab's title DOES include filter
      filterState.visibleTabs += 1;
      tab.classList.add("tab-list-item--filtered");
      tab.style.setProperty(
        "--opacity-delay",
        filteredOutTabs > 0 ? "1000ms" : "0ms"
      );

      if (!tab.classList.contains("tab-list-item--hidden")) {
        // if tab is already visible
        tab.style.setProperty("--speed", "1000ms");
        tab.style.setProperty(
          "--delay",
          filteredOutTabs > 0 ? "1000ms" : "0ms"
        );
        // tab.style.setProperty("--delay", "1000ms");
      } else {
        // if tab is hidden, UNHIDE it
        unhideTab(tab);
        // if there are VISIBLE TABS after current tab, it needs opacity delay in order to wait for tabs that follow to move out the way
        // it has nothing to do with how many tabs are filtered

        // this can be optimized by keeping record of next visible tab
        if (
          filteredInTabs > 0 ||
          filteredOutTabs > 0 ||
          titleIncludesFilter.slice(index).some(t => t == true)
        ) {
          tab.style.setProperty("--opacity-delay", "1000ms");
        } else {
          tab.style.setProperty("--opacity-delay", "0ms");
        }
        tab.style.setProperty("--delay", "0ms");
        // console.log(title, filteredOutTabs);
        tab.style.setProperty("--speed", "0ms");
        filteredInTabs += 1;
      }

      tab.classList.add("tab-list-item--filtered");
    }
  });

  // console.log(state.totalFilteredOutTabs);
  util.adjustScrollbar();
  adjustMenu.call(state);
}

module.exports = filter;
