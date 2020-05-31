function createTabListItem(tab) {
  const tabListItem = document.createElement("li");
  tabListItem.id = tab.id;
  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  const p = document.createElement("p");
  p.textContent = tab.title;
  const deleteButton = document.createElement("button");
  tabListItem.appendChild(checkbox);
  tabListItem.appendChild(p);
  tabListItem.appendChild(deleteButton);
  return tabListItem;
}

module.exports = createTabListItem;
