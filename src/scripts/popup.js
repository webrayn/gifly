const createTabComponent = require("./modules/createTabComponent");
const renderTabComponent = require("./modules/renderTabComponent");
const util = require("./modules/util");

// before closing browser, call localStorage.removeItem(key) for all the titles, removing everything

// use storage api to store data colors by tab id. Can't store them by URL because that's a security risk.

// colors = {
// 1: null,
// 3: hsl(50, 100, 70)
//
//
//
//
// }
//
// filter = "Youtube"
//
//
//
//

// What to do when:
// Closing tab from chrome: remove color, if applicable, from storage
// Closing tab on popup: smae as above, plus update UI (animate removing tabComponent, remove color from duplicate component if needed)
// Clicking on tab in chrome: nothing. If popup is open, it will close automatically.
// Clicking on tabComponent on the popup: nothing, because popup will close when user is directed to the tab
//
//
//
// when loading popup, get current actual tab Ids, and also remove tabIds from storage that are not present among current tabs
//
//
//
//
//
//

const state = {
  // make sure to save thes in localStorage so they persist between tabs
  hue: 0,
  lightness: 60,
  tabLastMovedDown: null,
  tabs: {
    // "tab-12": {
    //   index: tab.index,
    //   url: "https://www.youtube.com"
    // }
  },
  tabURLs: {
    // "https://www.google.com" : {
    //   ids: [],
    //   color: "transparent"
    // }
  },
  addTab(tab) {
    this.tabs[`tab-${tab.id}`] = {
      index: tab.index,
      url: tab.url
    };
    // if tab's url isn't already listed
    if (!this.tabURLs[tab.url]) {
      this.tabURLs[tab.url] = {
        ids: [`tab-${tab.id}`],
        color: null
      };
    } else {
      this.tabURLs[tab.url].ids.push(`tab-${tab.id}`);
      // if this is the first duplicate, it needs a color
      if (this.tabURLs[tab.url].ids.length == 2) {
        // if any discarded colors exist, use one of them instead of creating a new one
        if (this.availableColors.length > 0) {
          this.tabURLs[tab.url].color = this.availableColors.pop();
          // save available colors to storage API here
          // { code here }
        } else {
          util.addNewColor.call(this, tab.url);
        }
        // the older tab with same title needs its color updated, since it just became a duplicate
        const olderTabComponent = document.getElementById(
          this.tabURLs[tab.url].ids[0]
        );
        olderTabComponent.style.setProperty(
          "--duplicate-indicator-color",
          this.tabURLs[tab.url].color
        );
        olderTabComponent.classList.add("tab-list-item--duplicate");
      }
    }
    renderTabComponent.call(this, tab);
  },
  deleteTab(id) {
    const tabUrl = this.tabs[id].url;
    // remove ID of deleted tab from the list of ids associated with tab URL
    this.tabURLs[tabUrl].ids = this.tabURLs[tabUrl].ids.filter(
      tabId => tabId != id
    );
    const tabsList = document.getElementById("tab-list");
    const tabsListItem = document.getElementById(id);

    tabsListItem.classList.add("tab-list-item--deleted");
    tabsList.classList.add("tab-list--deleting");
    setTimeout(() => {
      // tabsList.classList.add("tab-list--deleting");
      tabsListItem.remove();
      util.adjustBodyPadding();
      setTimeout(() => tabsList.classList.remove("tab-list--deleting"), 1400);
    }, 1400);
    // if there are no more tabs with this title, tab object can be removed
    if (this.tabURLs[tabUrl].ids.length == 0) {
      delete this.tabURLs[tabUrl];
      // if there are fewer than 2 tabs with this title, they are no longer duplicates and don't need their color
    } else if (this.tabURLs[tabUrl].ids.length < 2) {
      this.availableColors.push(this.tabURLs[tabUrl].color);
      // remove color and uplicate class from the one remaining tab (the DOM element) with this title
    }
  },
  // have to keep order of all tab Ids so that they can be moved on UI (before actual browser tabs are moved)
  availableColors: []
};

// render tabs
chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, function (
  tabs
) {
  // chrome.tabs.update(tabs[0].id, { url: newUrl });
  // const tabsList = document.getElementById("tabs-list");
  // tabs.forEach(tab => state.addTab(tab.url));
  tabs.forEach(tab => state.addTab(tab));
  util.adjustBodyPadding();
});

document.addEventListener("click", e => {
  if (e.target.classList.contains("tab-list-item__delete-button")) {
    // alert(e.target.parentElement.id);
    const tabListItemId = e.target.parentElement.id;
    state.deleteTab(tabListItemId);
    const tabId = parseInt(tabListItemId.split("-")[1]);
    chrome.tabs.remove(tabId, () => {
      // const tabListItem = document.getElementById(tabListItemId);
      // tabListItem.remove();
    });
    // chrome.tabs.remove(39)
  } else if (e.target.classList.contains("tab-list-item__tab-button")) {
    const tabId = parseInt(e.target.parentElement.id.split("-")[1]);
    chrome.tabs.get(tabId, function (tab) {
      chrome.tabs.highlight({ tabs: tab.index }, function () { });
    });
    // chrome.browserAction.openPopup()
  }
});

// const tabListContainer = document.getElementById("tab-list-container");

// tabListContainer.addEventListener("scroll", e => {
//   // e.preventDefault();
//   console.log(e);
//   // if (e.target.classList.contains("tab-list")) {
//   const tabList = document.getElementById("tab-list");
//   const currentTabListOffset = Number.parseFloat(
//     tabList.style.getPropertyValue("--y-offset") || 0
//   );
//   tabList.style.setProperty("--y-offset", currentTabListOffset - 20 + "px");
//   // }
// });

document.addEventListener("pointerdown", e => {
  if (e.target.classList.contains("tab-list-item__tab-button")) {
    const headerHeight = document.getElementById("header").offsetHeight;
    const tabList = document.getElementById("tab-list");
    const tabListContainer = document.getElementById("tab-list-container");
    const tabListBottom =
      tabListContainer.offsetTop + tabListContainer.offsetHeight;
    // this value will have to change if user drags todo far enough below or above
    let tabListScrollTop = tabListContainer.scrollTop;
    const tab = e.target.parentElement;
    const margin = 6;
    const tabHeight = 40;
    const shiftY = e.clientY - tab.getBoundingClientRect().top;
    const tabListPosition = tabList.offsetTop;
    const listedTabs = [...document.getElementsByClassName("tab-list-item")];
    const tabIndex = listedTabs.findIndex(t => t.id === tab.id);
    const tabsAbove = listedTabs.slice(0, tabIndex);
    const tabsBelow = listedTabs.slice(tabIndex + 1);
    const originalTabPositions = listedTabs.reduce((a, t) => {
      a[t.id] = t.offsetTop + headerHeight;
      return a;
    }, {});
    let maxTabOffsetAbove =
      (originalTabPositions[tab.id] -
        headerHeight -
        margin -
        tabListScrollTop) *
      -1;
    let maxTabOffsetBelow =
      tabListBottom -
      originalTabPositions[tab.id] -
      headerHeight +
      tabListScrollTop;
    listedTabs
      .filter(t => t.id != tab.id)
      .forEach(t => t.classList.add("tab-list-item--moving"));

    tab.classList.add("tab-list-item--draggable");
    tab.setPointerCapture(e.pointerId);

    tab.onpointermove = function (event) {
      // console.log(event.pageY);
      // const currentTabTopPosition = Math.max(
      //   Math.min(
      //     event.pageY - shiftY + tabListScrollTop,
      //     originalTabPositions[tab.id] + maxTabOffsetBelow
      //   ),
      //   originalTabPositions[tab.id] + maxTabOffsetAbove
      // );
      const currentTabTopPosition = event.pageY - shiftY + tabListScrollTop;

      const yOffset = currentTabTopPosition - originalTabPositions[tab.id];
      // change dragged tab's position
      tab.style.setProperty("--y-offset", yOffset + "px");

      // scroll if necessary. Add check to see if pointer is below its original position within tab
      if (
        currentTabTopPosition >=
        originalTabPositions[tab.id] + maxTabOffsetBelow
      ) {
        // tabListScrollTop += Math.min(event.pageY - shiftY - 506, 4);
        // maxTabOffsetBelow =
        //   tabListBottom -
        //   originalTabPositions[tab.id] -
        //   tabListPosition +
        //   tabListScrollTop;
        // maxTabOffsetAbove =
        //   (originalTabPositions[tab.id] -
        //     tabListPosition -
        //     margin -
        //     tabListScrollTop) *
        //   -1;
        // tabListContainer.scrollBy(0, 50);
        tabList.style.setProperty(
          "--y-offset",
          (event.pageY - shiftY - 506) * -1 + "px"
        );
      }

      tabsAbove.forEach(tab => {
        const totalDifference =
          originalTabPositions[tab.id] - currentTabTopPosition;
        // get the difference between the bottom of todo and the top of draggable todo.
        const difference = totalDifference + tabHeight;
        // calculate tab offset (should be min of 0, max of 46)
        const offset = Math.max(
          Math.min(difference * 1.3, tabHeight + margin),
          0
        );

        tab.style.setProperty("--y-offset", offset + "px");
        tab.style.setProperty(
          "--opacity",
          Math.max(Math.abs((offset % 46) - 23) / 23, 0.62)
        );
        tab.style.setProperty(
          "--scale",
          Math.max(Math.abs((offset % 46) - 23) / 23, 0.98)
        );
      });

      tabsBelow.forEach(tab => {
        const totalDifference =
          originalTabPositions[tab.id] - currentTabTopPosition;
        const difference = totalDifference - tabHeight;
        const offset = Math.min(
          Math.max(difference * 1.3, (tabHeight + margin) * -1),
          0
        );

        tab.style.setProperty("--y-offset", offset + "px");
        tab.style.setProperty(
          "--opacity",
          Math.max(Math.abs((offset % 46) + 23) / 23, 0.62)
        );
        tab.style.setProperty(
          "--scale",
          Math.max(Math.abs((offset % 46) + 23) / 23, 0.98)
        );
      });
    };

    document.addEventListener(
      "pointerup",
      event => {
        // get tabList offset value, and scroll by that amount
        // remember to hide system scrollbar and add custom one that scrolls with the offset
        const tabListOffset = Number.parseFloat(
          tabList.style.getPropertyValue("--y-offset") || 0
        );
        tabList.style.setProperty("--y-offset", 0 + "px");
        tabListContainer.scroll(0, tabListOffset * -1);

        tab.onpointermove = null;
        const currentTabTopPosition = event.pageY - shiftY + tabListScrollTop;

        tab.classList.remove("tab-list-item--draggable");
        listedTabs.forEach(t => {
          t.style.setProperty("--y-offset", 0);
          t.classList.remove("tab-list-item--moving");
        });

        if (currentTabTopPosition < originalTabPositions[tab.id]) {
          tabsAbove.forEach(t => {
            if (
              originalTabPositions[t.id] + 23 > currentTabTopPosition &&
              originalTabPositions[t.id] - margin - 23 < currentTabTopPosition
            ) {
              tabList.insertBefore(tab, t);
            }
          });
        } else if (currentTabTopPosition > originalTabPositions[tab.id]) {
          tabsBelow.forEach(t => {
            if (
              originalTabPositions[t.id] + 23 - margin <
              currentTabTopPosition + tabHeight
              // originalTabPositions[t.id] + tabHeight + margin + 23 >
              // currentTabTopPosition + tabHeight
            ) {
              tabList.insertBefore(tab, t.nextSibling);
            }
          });
        }
      },
      { once: true }
    );
  }
});

// // there is no reason to get listedTabs each time on mousedown. listedTabs should be in outer scope, gathered during app start and/or filter call.
// // same applies to their positions.
// const listedTabs = [...document.getElementsByClassName("tab-list-item")];
// const headerHeight = 46;
// const tabComponentIndex = listedTabs.findIndex(
//   tab => tab.id === tabComponent.id
// );

// const tabPositions = listedTabs.map(tab => tab.offsetTop + headerHeight);
// const draggedTabOriginalPosition = tabPositions[tabComponentIndex];
// const tabList = document.getElementById("tab-list");
// const tabListBottom = tabList.offsetTop + tabList.offsetHeight;
// const maxTabOffsetAbove = (draggedTabOriginalPosition - 52) * -1;
// const maxTabOffsetBelow = tabListBottom - draggedTabOriginalPosition - 46;

// listedTabs
//   .filter((tab, index) => index != tabComponentIndex)
//   .forEach(tab => tab.classList.add("tab-list-item--moving"));

// // get the position of the cursor within the tabComponent
// let shiftY = e.clientY - tabComponent.getBoundingClientRect().top;

// tabComponent.classList.add("tab-list-item--draggable");
// tabComponent.ondragstart = function () {
//   return false;
// };

// // moves tab up or down
// const moveAt = function (pageY) {
//   let yOffset =
//     pageY +
//     tabList.scrollTop -
//     tabComponent.offsetTop -
//     shiftY -
//     headerHeight;
//   // if (yOffset < maxTabOffsetAbove) {
//   //   yOffset = maxTabOffsetAbove;
//   // } else if (yOffset > maxTabOffsetBelow) {
//   //   yOffset = maxTabOffsetBelow;
//   // }
//   tabComponent.style.setProperty("--y-pos", yOffset + "px");
// };

// const onMouseMove = function (event) {
//   moveAt(event.pageY);
//   const currentTabTopPosition = tabComponent.getBoundingClientRect().top;
//   const currentTabBottomPosition = tabComponent.getBoundingClientRect()
//     .bottom;

//   listedTabs.forEach((tab, index) => {
//     // if tab is above current tab
//     if (index < tabComponentIndex) {
//       const totalDifference = Math.max(
//         tabPositions[index] -
//         tabList.scrollTop +
//         46 -
//         currentTabTopPosition,
//         0
//       );
//       const actualDifference = Math.min(totalDifference, 46);
//       tab.style.setProperty("--y-offset", actualDifference + "px");
//       tab.style.setProperty(
//         "--opacity",
//         Math.max(Math.abs((actualDifference % 46) - 23) / 23, 0.62)
//       );
//       tab.style.setProperty(
//         "--scale",
//         Math.max(Math.abs((actualDifference % 46) - 23) / 23, 0.98)
//       );
//       // console.log(`${tab.id} offest by ${Math.min(difference, 46)}`);
//     } else if (index > tabComponentIndex) {
//       const totalDifference = Math.min(
//         tabPositions[index] -
//         tabList.scrollTop -
//         6 -
//         currentTabBottomPosition,
//         0
//       );
//       const actualDifference = Math.max(totalDifference, -46);
//       tab.style.setProperty("--y-offset", actualDifference + "px");
//       tab.style.setProperty(
//         "--opacity",
//         Math.max(Math.abs((actualDifference % 46) + 23) / 23, 0.62)
//       );
//       tab.style.setProperty(
//         "--scale",
//         Math.max(Math.abs((actualDifference % 46) + 23) / 23, 0.98)
//       );
//       // tab.style.setProperty("--opacity", actualDifference);
//       // console.log(`${tab.id} offest by ${Math.max(difference, -46)}`);
//     }
//   });
// };

// moveAt(e.pageY);

// document.addEventListener("mousemove", onMouseMove);

// document.onmouseup = function () {
//   document.removeEventListener("mousemove", onMouseMove);
//   tabComponent.onmouseup = null;
//   // tabComponent.style.top = 0;
//   tabComponent.classList.remove("tab-list-item--draggable");
//   const currentTabTopPosition =
//     tabComponent.getBoundingClientRect().top + tabList.scrollTop;
//   // const tabList = document.getElementById("tab-list");
//   listedTabs.forEach((tab, index) => {
//     tab.style.setProperty("--y-offset", 0);
//     // setTimeout(() => tab.classList.remove("tab-list-item--moving"), 140);
//     tab.classList.remove("tab-list-item--moving");
//     // insert tab in new position
//     if (
//       tabPositions[index] + 23 > currentTabTopPosition &&
//       tabPositions[index] - 23 < currentTabTopPosition
//     ) {
//       // console.log(currentTabTopPosition);
//       tabList.insertBefore(tabComponent, tab);
//     }
//   });
// };
//   }
// });

// document.addEventListener("mouseup", e => {
//   document.removeEventListener("mousemove", onMouseMove);
//   tabComponent.onmouseup = null;
//   tabComponent.classList.remove("tab-list-item--draggable");
// }

// document.addEventListener("pointermove", e => {
//   if (e.target.classList.contains("tab-list-item__tab-button")) {
//     const tabComponent = e.target.parentElement;
//     let newTop = e.clientY - tabComponent.getBoundingClientRect().top;
//     tabComponent.style.top = newTop + "px";
//   }
// });

// document.addEventListener("pointerup", e => {
//   if (e.target.classList.contains("tab-list-item__tab-button")) {
//     const tabComponent = e.target.parentElement;
//     // const tabComponentRect = tabComponent.getBoundingClientRect();
//     // alert(tabComponentRect.top);
//     tabComponent.classList.remove("tab-list-item--draggable");
//   }
// });

// document.addEventListener("mouseover", e => {
//   if (e.target.classList.contains("tab-list-item")) {
//     const tabId = parseInt(e.target.id.split("-")[1]);
//     chrome.tabs.get(tabId, function (tab) {
//       chrome.tabs.highlight({ tabs: tab.index }, function () {
//         chrome.browserAction.openPopup();
//       });
//     });
//     // chrome.tabs.highlight({ tabs: [tabId] });
//   }
// });
