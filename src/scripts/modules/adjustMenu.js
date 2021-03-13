"use strict";

/* needs to be called when:
  checking tab checkbox
  unchecking tab checkbox
  deleting tab
  calling filter
*/
function adjustMenu() {
  const state = this;
  const filterIsActive = state.filterIsActive;

  const disableButton = btn => {
    btn.setAttribute("disabled", true);
    btn.classList.add("header__menu-item-button--disabled");
  };

  const enableButton = btn => {
    btn.setAttribute("disabled", false);
    btn.classList.remove("header__menu-item-button--disabled");
  };

  // get the buttons
  const menuButtons = [
    ...document.getElementsByClassName(`header__menu-item-button`)
  ];
  // const moveToTopBtn = document.getElementById("move-to-top-btn");
  // const moveToBottomBtn = document.getElementById("move-to-bottom-btn");
  // const closeSeletedBtn = document.getElementById("close-selected-btn");
  // const closeDuplicatesBtn = document.getElementById("close-duplicates-btn");
  const selectDeselectAllBtn = document.getElementById(
    "select-deselect-all-btn"
  );

  // get currently rendered tabs
  const tabs = document.getElementsByClassName("tab-list-item");
  const visibleTabs = [...tabs].reduce((a, t) => {
    if (!t.classList.contains("tab-list-item--hidden")) {
      a += 1;
    }
    return a;
  }, 0);
  // console.log(listedTabs.length, state.filteredOutTabs);
  // if there are no listed tabs (such as when they are all filtered out), disable all buttons
  if (visibleTabs < 1) {
    menuButtons.forEach(btn => {
      disableButton(btn);
    });
  } else {
    enableButton(selectDeselectAllBtn);
  }
}

module.exports = adjustMenu;
