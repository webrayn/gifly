"use strict";

const dragTab = require("./dragTab");

function scroll(options = {}) {
  const { distance = 0, scrollBarOnly = false, speed = 0 } = options;
  dragTab.call(this, { distance });
  const container = document.getElementById("tab-list-container");
  const content = container.children[0];
  const margin = 6;
  const visibleContentHeight = container.offsetHeight - margin; // 500
  const wholeContentHeight = container.scrollHeight - margin;
  const hiddenContentHeight = wholeContentHeight - visibleContentHeight;

  // const contentOffsetHeight = content.offsetHeight;
  const scrollbarThumb = document.getElementById("scrollbar-thumb");

  const containerScrollTop = Number.parseFloat(
    container.style.getPropertyValue("--scrolltop") || 0
  );

  const containerToContentRatio = visibleContentHeight / wholeContentHeight;

  // this value doesn't change no matter where thumb is. Max offset is always the same.
  const maxScrollbarThumbOffset = hiddenContentHeight * containerToContentRatio;
  const currentThumbOffset = containerScrollTop * containerToContentRatio;

  if (currentThumbOffset < maxScrollbarThumbOffset) {
    const newScrollbarThumbOffset = distance * containerToContentRatio;
    scrollbarThumb.style.setProperty(
      "--thumb-offset",
      Math.min(newScrollbarThumbOffset, maxScrollbarThumbOffset) + "px"
    );
  }

  // only offset tabList if scrlling using drag
  if (scrollBarOnly == false) {
    content.classList.add("tab-list--scroll");
    const availableScrollDistance = hiddenContentHeight;

    if (containerScrollTop < availableScrollDistance) {
      const maxOffset = (hiddenContentHeight - containerScrollTop) * -1;
      const newOffset = distance * -1;

      content.style.setProperty(
        "--y-offset",
        Math.max(newOffset, maxOffset) + "px"
      );
    }
  }
}

module.exports = scroll;
