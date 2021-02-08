const util = require("./modules/util");
const createTabComponent = require("./modules/createTabComponent");
const renderTabComponent = require("./modules/renderTabComponent");
const initializeDrag = require("./modules/initializeDrag");
const scroll = require("./modules/scroll");
const filter = require("./modules/filter");

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
      url: tab.url,
      title: tab.title
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
    const tabListContainer = document.getElementById("tab-list-container");
    this.scrolltop = tabListContainer.scrollTop;
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
      util.adjustScrollbar();
      setTimeout(() => tabsList.classList.remove("tab-list--deleting"), 1400);
      this.scrolltop -= 40;
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
  availableColors: [],
  renderedTabs: [],
  dragState: null,
  dragTimer: null,
  scrolltop: null
};

// render tabs
chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, function (
  tabs
) {
  // chrome.tabs.update(tabs[0].id, { url: newUrl });
  // const tabsList = document.getElementById("tabs-list");
  // tabs.forEach(tab => state.addTab(tab.url));
  tabs.forEach(tab => state.addTab(tab));
  util.adjustScrollbar();
  state.renderedTabs = util.getListedTabs();
});

// document.addEventListener("pointermove", e => {
//   console.log(e.clientX, e.clientY);
// });

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
  const scrollTop = e.target.scrollTop;
  const scrollOptions = { distance: scrollTop, scrollBarOnly: true };
  scroll.call(state, scrollOptions);
  e.target.style.setProperty("--scrolltop", e.target.scrollTop);
});

document.addEventListener("pointerdown", e => {
  if (e.target.classList.contains("tab-list-item__tab-button")) {
    const tabButton = e.target;
    tabButton.parentElement.classList.add("tab-list-item--held-down");
    state.dragTimer = setTimeout(initializeDrag.bind(state, e), 300);
    tabButton.onpointerup = () => {
      clearTimeout(state.dragTimer);
    };
  }
});

document.addEventListener("contextmenu", e => {
  if (e.target.classList.contains("tab-list-item__tab-button")) {
    e.target.parentElement.classList.remove("tab-list-item--held-down");
  }
});

document.addEventListener("keyup", filter.bind(state));
