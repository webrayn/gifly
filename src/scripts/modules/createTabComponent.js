"use strict";

function createTabComponent(tab) {
  const tabComponent = document.createElement("li");
  tabComponent.id = `tab-${tab.id}`;
  tabComponent.classList.add("tab-list-item");
  if (tab.active === true) {
    tabComponent.classList.add("tab-list-item--active");
  }
  if (this.tabURLs[tab.url].color != null) {
    tabComponent.classList.add("tab-list-item--duplicate");
  }

  // create checkbox
  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.classList.add("tab-list-item__checkbox");

  // create duplicate indicator
  // const duplicateIndicator = document.createElement("div");
  // duplicateIndicator.classList.add("tab-list-item__duplicate-indicator");

  // create favIcon
  const favIcon = document.createElement("img");
  if (tab.favIconUrl != "") {
    favIcon.src = tab.favIconUrl;
  } else {
    favIcon.src = "chrome://favicon/" + tab.url;
  }

  // create tab Title
  const p = document.createElement("p");
  p.classList.add("tab-list-item__title");
  tabComponent.style.setProperty(
    "--duplicate-indicator-color",
    this.tabURLs[tab.url].color
  );
  // p.style.backgroundColor = state.tabTitles[tab.title];
  p.textContent = tab.title.substring(0, 60);

  // create delete button
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("tab-list-item__delete-button");

  // create tab button
  const tabButton = document.createElement("button");
  tabButton.classList.add("tab-list-item__tab-button");

  tabComponent.appendChild(checkbox);
  tabComponent.appendChild(favIcon);
  tabComponent.appendChild(p);
  tabComponent.appendChild(deleteButton);
  tabComponent.appendChild(tabButton);

  return tabComponent;
}

module.exports = createTabComponent;
