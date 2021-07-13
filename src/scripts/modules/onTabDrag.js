"use strict";

const scroll = require("./scroll");
const dragTab = require("./dragTab");

// make it so that tab cannot be moved below the body (506 - 46) no matter how far down user's pointer is.
// After scrolling is complete, if user movespointer back up, todo won't move up until the pointer moves over it

function onTabDrag(event) {
  const dragState = this.dragState;
  dragState.pointerPosition = event.pageY;
  const initialTabPos = dragState.initialPosition;

  if (dragState.shouldScroll() == "down") {
    // function to run every frame while scrolling down and tabListOffset has not reached maximum
    // const step = () => {
    //   if (dragState.shouldScroll() == "down") {
    //     // dragState.tabOffset += 1;
    //     dragState.tabListOffset += 1;
    //     dragTab.call(this, { distance: 1 });
    //     dragState.lastTabPos += 1;
    //     scroll.call(this, { distance: dragState.tabListOffset });
    //     window.requestAnimationFrame(step);
    //   } else {
    //     cancelAnimationFrame(dragState.animation);
    //     dragState.animation = null;
    //   }
    // };
    // get the scroll / tabMove speed based on how far the pointer is from the tab
    const step = () => {
      // console.log(dragState.maxTabOffsetBelow, dragState.tabOffset);
      const adjustedTabPos =
        initialTabPos + dragState.tabOffset - dragState.tabListOffset;
      const adjustedPointerPos =
        dragState.pointerPosition - dragState.headerHeight - dragState.shiftY;
      const distance = (adjustedPointerPos - adjustedTabPos) / 10;
      if (dragState.shouldScroll() == "down") {
        dragState.tabListOffset += distance;
        scroll.call(this, { distance: dragState.tabListOffset });
        dragTab.call(this, { distance: distance });
        dragState.lastTabPos += distance;
        window.requestAnimationFrame(step);
      } else if (adjustedTabPos < adjustedPointerPos) {
        dragTab.call(this, { distance: distance });
        dragState.lastTabPos += distance;
        window.requestAnimationFrame(step);
      } else {
        cancelAnimationFrame(dragState.animation);
        dragState.animation = null;
      }

      // console.log(
      //   `tabOffset: ${initialTabPos +
      //   dragState.tabOffset -
      //   dragState.tabListOffset}, pointerPos: ${dragState.pointerPosition -
      //   dragState.headerHeight -
      //   dragState.shiftY}, shiftY: ${dragState.shiftY}`
      // );
    };

    if (dragState.animation == null) {
      dragState.animation = window.requestAnimationFrame(step);
    }
  } else if (dragState.shouldScroll() == "up") {
  } else {
    // the issue here is that distance between pointer and tab can grow while it's being scrolled.
    // we need to divorce pointer position from tab position.
    // or, kep track of the distance between pointer and top of tab, updating it (shiftY?)

    /*
    while (dragState.pointerPosition > tabPosOnScreen + shiftY) {
      dragTabDown
    }
    */
    if (dragState.animation == null) {
      const currentTabPos = dragState.getUpdatedTabPos();
      const distanceToMove = currentTabPos - dragState.lastTabPos;
      // console.log(currentTabPos, dragState.lastTabPos);
      dragState.lastTabPos = currentTabPos;
      dragTab.call(this, { distance: distanceToMove });
      // console.log(
      //   `max offset: ${dragState.maxTabOffsetBelow}, current offset: ${dragState.tabOffset
      //   }`
      // );
    }
  }

  // // dragState.draggedTabPosition = event.pageY - dragState.shiftY;
  // const yOffset =
  //   dragState.draggedTabPosition -
  //   dragState.initialTabPositions[dragState.draggedTab.id] +
  //   dragState.tabListScrollTop -
  //   dragState.tabListOffset;

  // // const distanceToDrag = Math.max(
  // //   dragState.maxTabOffsetAbove,
  // //   Math.min(yOffset, dragState.maxTabOffsetBelow)
  // // );

  // console.log(`yOffset: ${yOffset}`);

  // change dragged tab's position
  // dragTab.call(this, { distance: distanceToMove });
}

module.exports = onTabDrag;
