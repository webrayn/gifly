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

  // get the buttons
  const menuButtons = [
    ...document.getElementsByClassName(`header__menu-item-button`)
  ];
  // const moveToTopBtn = document.getElementById("move-to-top-btn");
  // const moveToBottomBtn = document.getElementById("move-to-bottom-btn");
  // const closeSeletedBtn = document.getElementById("close-selected-btn");
  // const closeDuplicatesBtn = document.getElementById("close-duplicates-btn");
  // const selectDeselectAllBtn = document.getElementById(
  //   "select-deselect-all-btn"
  // );

  // get currently rendered tabs
  const listedTabs = document.getElementsByClassName("tab-list-item");
  // console.log(listedTabs.length, state.filteredOutTabs);
  // if there are no listed tabs (such as when they are all filtered out), disable all buttons
  if (listedTabs.length == state.filteredOutTabs) {
    menuButtons.forEach(btn => {
      btn.setAttribute("disabled", true);
      btn.classList.add("header__menu-item-button--disabled");
    });
  }
}

module.exports = adjustMenu;
