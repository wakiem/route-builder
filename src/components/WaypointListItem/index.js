import React, { useState } from 'react';

import './style.css';

import { BarsIcon, TrashIcon } from '../Icons';

const WaypointListItem = (props) => {

  const [isWaypointDraggable, setIsWaypointDraggable] = useState(false);

  const onDragEnd = (e) => {
    setIsWaypointDraggable(false);
    props.handleDragEnd();
  }

  const onTouchMove = (e) => {
    if (isWaypointDraggable) {
      const currentTouchLocation = e.touches[0];
      const htmlTarget = document.elementFromPoint(currentTouchLocation.clientX, currentTouchLocation.clientY);
      const waypointLiTarget = htmlTarget.closest('#waypoint-list > li');
      const waypointTargetIndex = waypointLiTarget && waypointLiTarget.getAttribute('data-index') && Number.parseInt(waypointLiTarget.getAttribute('data-index'));
      if (waypointTargetIndex || waypointTargetIndex === 0) {
        props.handleTouchMove(waypointTargetIndex);
      }
    }
  }

  const onTouchEnd = (e) => {
    e.preventDefault();
    // If we only "touch click" on the bars (without any moving/dragging), the onTouchEnd will fire before the onMouseDown
    // and we would end up with setting the waypoint draggable (in the mousedown), but not unsetting it again
    // The preventDefault will prevent the onMouseDown from firing and will avoid this scenario
    onDragEnd();
  }

  /*
    Approach for non-touch screens:
    1. When we mouse down on the <BarsIcon /> of the <li> we set the <li> as draggable.
    2. When we then start dragging the mouse we set this <li> as the waypoint that is being dragged.
    3. When we drag the mouse over another <li> we reorder the waypoints list.
    4. When the drag finishes we make the waypoint undraggable (undo 1) and unset the waypoint that is being dragged (undo 2) 
  */

  /*
    Approach for touch screens:
    1a. On the touch of a <li> we set this <li> as the waypoint that is being dragged.
        This is regardless of whether the touch was on the <BarsIcon /> or not:
        In this one touch event we have to capture both the onMouseDown and onDragStart.
        Another option could be to wait with this and do it when onTouchMove fires, but then we would either have to check there whether the draggedWaypoint is already set (and at the moment we don't have access to that here), or set it every time, which is also not really clean...
    1b. On touch of the <BarsIcon /> of the <li> we set the waypoint as draggable.
    2.  On touch move we will check if the waypoint is draggable and only do something if it is indeed draggable (so if the touch started at the <BarsIcon/>).
        We then check over which element the user is touching at each moment, and if it is another waypoint, we will reorder the list.
    3.  When the touch event finishes we unset the waypoint that is being dragged (undo 1a) and make the waypoint undraggable (undo 1b)
  */

  return (
    <li
      data-index={props.index}
      draggable={isWaypointDraggable}
      onDragStart={props.handleDragStart}
      onDragEnter={props.handleDragEnter}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()} // Prevent weird shadow bounceback
      onTouchStart={props.handleDragStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <div
        onMouseDown={() => setIsWaypointDraggable(true)}
        onTouchStart={() => setIsWaypointDraggable(true)}
      >
        <BarsIcon />
      </div>
      <span>{props.text}</span>
      <TrashIcon onClick={props.handleDelete} />
    </li>
  );

};

export default WaypointListItem;
