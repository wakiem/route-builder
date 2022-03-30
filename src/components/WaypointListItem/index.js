import React, { useState } from 'react';

import './style.css';

import { BarsIcon, TrashIcon } from '../Icons';

const WaypointListItem = (props) => {

  const [isWaypointDraggable, setIsWaypointDraggable] = useState(false);

  const onDragEnd = () => {
    setIsWaypointDraggable(false);
    props.handleDragEnd();
  }

  return (
    <li
      draggable={isWaypointDraggable}
      onDragStart={props.handleDragStart}
      onDragEnter={props.handleDragEnter}
      onDragOver={(e) => e.preventDefault()} // Prevent weird shadow bounceback
      onDragEnd={onDragEnd}
    >
      <BarsIcon onMouseDown={() => setIsWaypointDraggable(true)} />
      <span>{props.text}</span>
      <TrashIcon onClick={props.handleDelete} />
    </li>
  );

};

export default WaypointListItem;
