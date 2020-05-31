const createTabListItem = require("./modules/createTabListItem");

chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, function (
  tabs
) {
  // chrome.tabs.update(tabs[0].id, { url: newUrl });
  const tabsList = document.getElementById("tabs-list");
  tabs.forEach(tab => {
    tabsList.appendChild(createTabListItem(tab));
  });
});

document.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    // alert(e.target.parentElement.id)
    chrome.tabs.remove(parseInt(e.target.parentElement.id), () => {
      const tabListItem = document.getElementById(e.target.parentElement.id);
      tabListItem.remove();
    });
    // chrome.tabs.remove(39)
  }
});
