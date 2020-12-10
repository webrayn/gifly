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
  util.adjustScrollbarHeight();
  // util.adjustBodyPadding();
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

const tabListContainer = document.getElementById("tab-list-container");

tabListContainer.addEventListener("scroll", e => {
  util.scroll(e.target.scrollTop, true);
  e.target.style.setProperty("--scrolltop", e.target.scrollTop);
});

document.addEventListener("pointerdown", e => {
  if (e.target.classList.contains("tab-list-item__tab-button")) {
    let lastPointerPos = 0; //change this each time pointermove event fires. Store Y position. If it's below 426, that means scroll.
    const headerHeight = document.getElementById("header").offsetHeight;
    const tabList = document.getElementById("tab-list");
    const tabListHeight = tabList.offsetHeight;
    const tabListContainer = document.getElementById("tab-list-container");
    // const tabListContainerHeight =
    //   tabListContainer.offsetTop + tabListContainer.offsetHeight;
    const tabListContainerHeight = tabListContainer.offsetHeight; // 506 when there are 11 tabs
    // this value will have to change if user drags todo far enough below or above
    let tabListScrollTop = tabListContainer.scrollTop;
    tabListContainer.style.setProperty("--scrolltop", tabListScrollTop);
    const tab = e.target.parentElement;
    const margin = 6;
    const tabHeight = 40;
    const shiftY = e.clientY - tab.getBoundingClientRect().top;
    const tabListPosition = tabList.offsetTop;
    const listedTabs = util.getListedTabs();
    const tabIndex = listedTabs.findIndex(t => t.id === tab.id);
    const tabsAbove = listedTabs.slice(0, tabIndex);
    const tabsBelow = listedTabs.slice(tabIndex + 1);
    const scrollbarThumb = document.getElementById("scrollbar-thumb");
    const originalTabPositions = listedTabs.reduce((a, t) => {
      a[t.id] = t.offsetTop + headerHeight;
      return a;
    }, {});
    let maxTabOffsetAbove =
      originalTabPositions[tab.id] - headerHeight - tabListScrollTop;

    let maxTabOffsetBelow =
      tabListHeight -
      margin +
      headerHeight -
      tab.offsetHeight -
      originalTabPositions[tab.id];
    console.log(
      `Above: ${maxTabOffsetAbove}, below: ${maxTabOffsetBelow}, scrollTop: ${tabListScrollTop}`
    );

    listedTabs
      .filter(t => t.id != tab.id)
      .forEach(t => t.classList.add("tab-list-item--moving"));

    tab.classList.add("tab-list-item--draggable");
    tab.setPointerCapture(e.pointerId);

    tab.onpointermove = function (event) {
      const currentTabTopPosition = event.pageY - shiftY + tabListScrollTop;
      // console.log(tabListScrollTop);
      // console.log(currentTabTopPosition, maxTabOffsetBelow);

      const yOffset = currentTabTopPosition - originalTabPositions[tab.id];
      // const yOffset = currentTabTopPosition - originalTabPositions[tab.id];
      // change dragged tab's position
      // tab.style.setProperty("--y-offset", yOffset + "px");
      tab.style.setProperty(
        "--y-offset",
        Math.min(yOffset, maxTabOffsetBelow) + "px"
      );
      // console.log(event.pageY);
      // console.log(maxTabOffsetBelow);

      // NOTE: event.pageY ignores scrolltop of tabListContainer (naturally) so you have to consider this in calculations

      if (event.pageY - shiftY > 426) {
        tabList.classList.add("tab-list--scroll");
        util.scroll(
          event.pageY -
          shiftY -
          Math.max(426, originalTabPositions[tab.id] - tabListScrollTop)
        );
        // util.scroll(event.pageY - shiftY - 426);
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
          Math.max(Math.abs(offset - 23) / 23, 0.62)
        );
        tab.style.setProperty(
          "--scale",
          Math.max(Math.abs(offset - 23) / 23, 0.98)
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
          Math.max(Math.abs(offset + 23) / 23, 0.62)
        );
        tab.style.setProperty(
          "--scale",
          Math.max(Math.abs(offset + 23) / 23, 0.98)
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
        tabList.classList.remove("tab-list--scroll");
        tabListContainer.scroll(0, (tabListOffset - tabListScrollTop) * -1);
        tabListContainer.style.setProperty("--scrolltop", tabListScrollTop);

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
