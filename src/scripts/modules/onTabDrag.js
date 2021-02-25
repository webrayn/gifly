"use strict";

const scroll = require("./scroll");
const dragTab = require("./dragTab");

// function onTabDrag(event) {
//   const dragState = this.dragState;

//   dragState.pointerPosition = event.pageY;
//   dragState.draggedTabPosition = event.pageY - dragState.shiftY;

//   // if (dragState.shouldScroll()) {
//   //   const distanceToScroll =
//   //     dragState.draggedTabPosition -
//   //     Math.max(426, dragState.originalTabPositions[dragState.draggedTab.id]);
//   //   scroll.call(this, { distance: distanceToScroll });
//   // }

//   if (dragState.shouldScroll() == "down") {
//     scroll.call(this, { distance: dragState.maxScrollTop });
//     // scroll.call(this, { distance: 10 });

//     const step = () => {
//       if (dragState.shouldScroll() == "down") {
//         const tabListPos = dragState.tabList.getBoundingClientRect().top - 52;
//         console.log(tabListPos);
//         dragState.tabListOffset = tabListPos;
//         // must distinguish between pointerPosition and actual tab position
//         dragState.draggedTabPosition =
//           event.pageY - dragState.shiftY - tabListPos;
//         const yOffset =
//           dragState.draggedTabPosition -
//           dragState.originalTabPositions[dragState.draggedTab.id] +
//           dragState.tabListScrollTop;
//         dragTab.call(this, { distance: yOffset });
//         window.requestAnimationFrame(step);
//       } else {
//         dragState.tabList.classList.remove("tab-list--scroll");
//         cancelAnimationFrame(dragState.animation);
//         // change actual scrolltop here
//         dragState.tabListContainer.scroll(0, dragState.tabListOffset * -1);
//       }
//     };
//     if (dragState.animation == null) {
//       dragState.animation = window.requestAnimationFrame(step);
//     }
//   } else {
//     const yOffset =
//       dragState.draggedTabPosition -
//       dragState.originalTabPositions[dragState.draggedTab.id] +
//       dragState.tabListScrollTop;

//     const distanceToDrag = Math.max(
//       dragState.maxTabOffsetAbove,
//       Math.min(yOffset, dragState.maxTabOffsetBelow)
//     );

//     // change dragged tab's position
//     dragTab.call(this, { distance: distanceToDrag });
//   }
// }

// function onTabDrag(event) {
//   const dragState = this.dragState;

//   dragState.pointerPosition = event.pageY;
//   dragState.draggedTabPosition = event.pageY - dragState.shiftY;

//   if (dragState.shouldScroll() == "down") {
//     const step = () => {
//       if (dragState.shouldScroll() == "down") {
//         dragState.draggedTabPosition += 1;
//         dragState.tabListOffset += 1;
//         const yOffset =
//           dragState.draggedTabPosition -
//           dragState.originalTabPositions[dragState.draggedTab.id] +
//           dragState.tabListScrollTop;
//         dragTab.call(this, { distance: yOffset });
//         scroll.call(this, { distance: dragState.tabListOffset });
//         window.requestAnimationFrame(step);
//       } else {
//         dragState.tabList.classList.remove("tab-list--scroll");
//         // change actual scrolltop here
//         dragState.tabListContainer.scroll(
//           0,
//           dragState.tabListOffset * -1 + dragState.tabListScrollTop
//         );
//         cancelAnimationFrame(dragState.animation);
//         dragState.animation = null;
//       }
//     };

//     if (dragState.animation == null) {
//       dragState.animation = window.requestAnimationFrame(step);
//     }
//   } else {
//     const yOffset =
//       dragState.draggedTabPosition -
//       dragState.originalTabPositions[dragState.draggedTab.id] +
//       dragState.tabListScrollTop;

//     const distanceToDrag = Math.max(
//       dragState.maxTabOffsetAbove,
//       Math.min(yOffset, dragState.maxTabOffsetBelow)
//     );

//     // change dragged tab's position
//     dragTab.call(this, { distance: distanceToDrag });
//   }
// }

function onTabDrag(event) {
  const dragState = this.dragState;

  dragState.pointerPosition = event.pageY;
  if (dragState.animation == null) {
    dragState.draggedTabPosition = event.pageY - dragState.shiftY;
  }

  if (dragState.shouldScroll() == "down") {
    // function to run every frame
    // while scrolling down and tabListOffset has not reached maximum, user can only control speed of scrolling/dragging, not tab position.
    const step = () => {
      if (
        dragState.shouldScroll() == "down" &&
        dragState.tabListOffset < dragState.maxScrollTop
      ) {
        dragState.draggedTabPosition += 1;
        dragState.tabListOffset += 1;
        const yOffset =
          dragState.draggedTabPosition -
          dragState.originalTabPositions[dragState.draggedTab.id] +
          dragState.tabListScrollTop;
        dragTab.call(this, { distance: yOffset });
        scroll.call(this, { distance: dragState.tabListOffset });
        window.requestAnimationFrame(step);
      } else {
        dragState.tabList.classList.remove("tab-list--scroll");
        // change actual scrolltop here
        console.log(`Scrolling to ${dragState.tabListOffset}`);
        dragState.tabListContainer.scroll(0, dragState.tabListOffset);
        dragState.tabListScrollTop = dragState.tabListOffset;
        this.scrollTop = dragState.tabListOffset;
        const yOffset =
          dragState.draggedTabPosition -
          dragState.originalTabPositions[dragState.draggedTab.id] +
          dragState.tabListScrollTop;
        // console.log(yOffset);
        dragTab.call(this, { distance: yOffset });
        cancelAnimationFrame(dragState.animation);
        dragState.animation = null;
      }
    };

    if (dragState.animation == null) {
      dragState.animation = window.requestAnimationFrame(step);
    }
  } else {
    // dragState.draggedTabPosition = event.pageY - dragState.shiftY;
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
