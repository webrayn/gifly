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
    const step = () => {
      if (dragState.shouldScroll()) {
        // const originalListScrolltop = dragState.tabListScrollTop;
        // const listPos = dragState.tabList.getBoundingClientRect().top;
        // const yOffset =
        //   dragState.draggedTabPosition -
        //   dragState.originalTabPositions[dragState.draggedTab.id] +
        //   dragState.tabListScrollTop;
        // const distanceToDrag = Math.max(
        //   dragState.maxTabOffsetAbove,
        //   Math.min(yOffset, dragState.maxTabOffsetBelow)
        // );
        // dragTab.call(this, { distance: distanceToDrag });
        // window.requestAnimationFrame(step);
        const maxOffset = dragState.tabListHeight - 506;
        scroll.call(this, { distance: maxOffset });
      } else {
        dragState.tabList.classList.remove("tab-list--scroll");
      }
    };

    window.requestAnimationFrame(step);
  }

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

module.exports = onTabDrag;
