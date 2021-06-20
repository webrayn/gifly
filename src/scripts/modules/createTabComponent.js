"use strict";

function createTabComponent(tab) {
  const tabComponent = document.createElement("li");
  tabComponent.id = `tab-${tab.id}`;
  tabComponent.classList.add("tab-list-item");
  if (tab.active === true) {
    tabComponent.classList.add("tab-list-item--active");
  }
  if (this.duplicateColorsByURL[tab.url] != undefined) {
    tabComponent.classList.add("tab-list-item--duplicate");
    tabComponent.style.setProperty(
      "--duplicate-indicator-color",
      this.duplicateColorsByURL[tab.url]
    );
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
    // get back to this part after Chrome implements the new favicon API for manifest v3
    // favIcon.src = "chrome://favicon/" + tab.url;
    favIcon.src = "images/default20.png";
  }

  const domainName = tab.url.match(/(?<=:\/\/).+?(?=\/|$)/);
  favIcon.alt = domainName;

  // create tab Title
  const p = document.createElement("p");
  p.classList.add("tab-list-item__title");

  // this soulution isn't good, can't handle 44 Ws
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

  tabComponent.appendChild(tabButton);
  tabComponent.appendChild(checkbox);
  tabComponent.appendChild(favIcon);
  tabComponent.appendChild(p);
  tabComponent.appendChild(activeIndicator);
  tabComponent.appendChild(duplicateIndicator);
  tabComponent.appendChild(deleteButton);

  return tabComponent;
}

module.exports = createTabComponent;
