"use strict";

const scroll = require("./scroll");
const dragTab = require("./dragTab");

function onTabDrag(event) {
  const dragState = this.dragState;

  dragState.draggedTabPosition = event.pageY - dragState.shiftY;

  // if (dragState.shouldScroll()) {
  //   const distanceToScroll =
  //     dragState.draggedTabPosition -
  //     Math.max(426, dragState.originalTabPositions[dragState.draggedTab.id]);
  //   scroll.call(this, { distance: distanceToScroll });
  // }

  if (dragState.shouldScroll() == "down") {
    // console.log("should drag down");
    const maxTabListOffset = dragState.tabListHeight - 506;
    scroll.call(this, { distance: maxTabListOffset });

    const step = () => {
      if (dragState.shouldScroll() == "down") {
        const tabListPos = dragState.tabList.getBoundingClientRect().top - 52;
        // must distinguish between pointerPosition and actual tab position
        dragState.draggedTabPosition =
          event.pageY - dragState.shiftY - tabListPos;
        const yOffset =
          dragState.draggedTabPosition -
          dragState.originalTabPositions[dragState.draggedTab.id] +
          dragState.tabListScrollTop;
        dragTab.call(this, { distance: yOffset });
        window.requestAnimationFrame(step);
      } else {
        dragState.tabList.classList.remove("tab-list--scroll");
      }
    };
    if (dragState.animation == null) {
      dragState.animation = window.requestAnimationFrame(step);
    }
  } else {
    const yOffset =
      dragState.draggedTabPosition -
      dragState.originalTabPositions[dragState.draggedTab.id] +
      dragState.tabListScrollTop;

    const distanceToDrag = Math.max(
      dragState.maxTabOffsetAbove,
      Math.min(yOffset, dragState.maxTabOffsetBelow)
    );

    // change dragged tab's position
    dragTab.call(this, { distance: distanceToDrag });
  }
}

module.exports = onTabDrag;
