"use strict";

const scroll = require("./scroll");
const dragTab = require("./dragTab");

// function onTabDrag(event) {
//   const dragState = this.dragState;

//   dragState.pointerPosition = event.pageY;
//   if (dragState.animation == null) {
//     dragState.draggedTabPosition = event.pageY - dragState.shiftY;
//   }

//   if (dragState.shouldScroll() == "down") {
//     // function to run every frame
//     // while scrolling down and tabListOffset has not reached maximum, user can only control speed of scrolling/dragging, not tab position.
//     const step = () => {
//       if (
//         dragState.shouldScroll() == "down" &&
//         dragState.tabListOffset < dragState.maxScrollTop
//       ) {
//         dragState.draggedTabPosition += 2;
//         dragState.tabListOffset += 2;
//         const yOffset =
//           dragState.draggedTabPosition -
//           dragState.initialTabPositions[dragState.draggedTab.id] +
//           dragState.tabListScrollTop;
//         dragTab.call(this, { distance: yOffset });
//         scroll.call(this, { distance: dragState.tabListOffset });
//         window.requestAnimationFrame(step);
//       } else {
//         dragState.tabList.classList.remove("tab-list--scroll");
//         // change actual scrolltop here
//         // console.log(
//         //   `dragState.tabListOffset: ${dragState.tabListOffset
//         //   }, dragState.draggedTabPosition: ${dragState.draggedTabPosition}`
//         // );
//         dragState.tabListContainer.scroll(0, dragState.tabListOffset);
//         dragState.tabListScrollTop = dragState.tabListOffset;
//         this.scrollTop = dragState.tabListOffset;
//         dragState.draggedTabPosition -= dragState.tabListOffset;
//         const yOffset =
//           dragState.draggedTabPosition -
//           dragState.initialTabPositions[dragState.draggedTab.id] +
//           dragState.tabListScrollTop;
//         // console.log(yOffset);
//         dragTab.call(this, { distance: yOffset });
//         cancelAnimationFrame(dragState.animation);
//         dragState.animation = null;
//       }
//     };

//     if (dragState.animation == null) {
//       dragState.animation = window.requestAnimationFrame(step);
//     }
//   } else {
//     // dragState.draggedTabPosition = event.pageY - dragState.shiftY;
//     const yOffset =
//       dragState.draggedTabPosition -
//       dragState.initialTabPositions[dragState.draggedTab.id] +
//       dragState.tabListScrollTop;

//     const distanceToDrag = Math.max(
//       dragState.maxTabOffsetAbove,
//       Math.min(yOffset, dragState.maxTabOffsetBelow)
//     );

//     // change dragged tab's position
//     dragTab.call(this, { distance: distanceToDrag });
//   }
// }

// make it so that tab cannot be moved below the body (506 - 46) no matter how far down user's pointer is.
// After scrolling is complete, if user movespointer back up, todo won't move up until the pointer moves over it

function onTabDrag(event) {
  const dragState = this.dragState;
  const currentTabPos = dragState.getTabTopPosInList();

  // update pointer position
  dragState.pointerPosition = event.pageY;

  // if (dragState.animation == null) {
  //   dragState.draggedTabPosition = event.pageY - dragState.shiftY;
  // }

  const newTabPos = dragState.getTabTopPosInList();
  const tabOffset = currentTabPos - newTabPos;
  // console.log(tabOffset);

  // make sure newTabPosition doesn't exceed maxTabPosition

  if (dragState.shouldScroll() == "down") {
    // function to run every frame while scrolling down and tabListOffset has not reached maximum
    const step = () => {
      if (dragState.shouldScroll() == "down") {
        // dragState.draggedTabPosition += 2;
        dragState.tabListOffset += 2;
        dragTab.call(this, { distance: 2 });
        scroll.call(this, { distance: dragState.tabListOffset });
        // console.log(dragState.getTabTopPosInList());
        window.requestAnimationFrame(step);
      } else {
        // dragState.tabList.classList.remove("tab-list--scroll");
        // change actual scrolltop here
        // console.log(
        //   `dragState.tabListOffset: ${dragState.tabListOffset
        //   }, dragState.draggedTabPosition: ${dragState.draggedTabPosition}`
        // );
        // there is no reason to actually scroll just yet. It can wait until dragEnd, when user releases mouse button. Then you can do all the calculations
        // dragState.tabListContainer.scroll(0, dragState.tabListOffset);
        // dragState.tabListScrollTop = dragState.tabListOffset;
        // this.scrollTop = dragState.tabListOffset;
        // dragState.draggedTabPosition -= dragState.tabListOffset;
        // const yOffset =
        //   dragState.draggedTabPosition -
        //   dragState.initialTabPositions[dragState.draggedTab.id] +
        //   dragState.tabListScrollTop;
        // console.log(yOffset);
        // dragTab.call(this, { distance: yOffset });
        cancelAnimationFrame(dragState.animation);
        dragState.animation = null;
      }
    };

    if (dragState.animation == null) {
      dragState.animation = window.requestAnimationFrame(step);
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
  dragTab.call(this, { distance: tabOffset });
}

module.exports = onTabDrag;
