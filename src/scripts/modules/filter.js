"use strict";

// function filter() {
//   const input = document.getElementById("filter");
//   const filter = input.value;
//   const tabList = document.getElementById("tab-list");
//   const listedTabs = [...document.getElementsByClassName("tab-list-item")];
//   const filteredTabs = listedTabs.filter(tab => {
//     const title = tab.children[3];
//     return title.innerText.includes(filter);
//   });
//   const fragment = document.createDocumentFragment();
//   filteredTabs.forEach(tab => fragment.appendChild(tab));
//   while (tabList.firstChild) {
//     tabList.removeChild(tabList.firstChild);
//   }
//   tabList.appendChild(fragment);
//   // no need to remove dom elements, just hide them instead.
// }
function filter() {
  const input = document.getElementById("filter");
  const filter = input.value.toLowerCase();
  const listedTabs = [...document.getElementsByClassName("tab-list-item")];
  listedTabs.forEach((tab, index) => {
    // const title = tab.children[3].innerText.toLowerCase();
    const title = this.tabs[tab.id].title.toLowerCase();
    console.log(`Tab index: ${index}, filter: ${filter}, title: ${title}`);
    tab.classList.remove("tab-list-item--hidden");
    if (!title.includes(filter)) {
      tab.classList.add("tab-list-item--hidden");
    }
  });
}

module.exports = filter;