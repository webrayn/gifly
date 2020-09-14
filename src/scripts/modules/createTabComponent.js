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

  // create active tab indicator
  const activeIndicator = document.createElement("div");
  activeIndicator.classList.add("tab-list-item__active-indicator");

  // create duplicate indicator
  const duplicateIndicator = document.createElement("div");
  duplicateIndicator.classList.add("tab-list-item__duplicate-indicator");

  // create checkbox
  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.classList.add("tab-list-item__checkbox");

  // create favIcon
  const favIcon = document.createElement("img");
  favIcon.classList.add("tab-list-item__favicon");
  if (tab.favIconUrl != "" && tab.favIconUrl != undefined) {
    favIcon.src = tab.favIconUrl;
  } else {
    favIcon.src = "chrome://favicon/" + tab.url;
  }

  const domainName = tab.url.match(/(?<=:\/\/).+?(?=\/|$)/);
  favIcon.alt = domainName;

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
  const deleteIcon = document.createElement("img");
  deleteIcon.src = "images/delete-icon@20x20.svg";
  deleteButton.appendChild(deleteIcon);

  // create tab button
  const tabButton = document.createElement("button");
  tabButton.classList.add("tab-list-item__tab-button");

  tabComponent.appendChild(activeIndicator);
  tabComponent.appendChild(duplicateIndicator);
  tabComponent.appendChild(checkbox);
  tabComponent.appendChild(favIcon);
  tabComponent.appendChild(p);
  tabComponent.appendChild(deleteButton);
  tabComponent.appendChild(tabButton);

  return tabComponent;
}

module.exports = createTabComponent;
