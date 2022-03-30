import React, { useState } from 'react';

import './style.css';

import WaypointListItem from '../WaypointListItem';

const WaypointList = (props) => {

  const [draggedWaypoint, setDraggedWaypoint] = useState(null);

  return (
    <ul id="waypoint-list">
      {props.waypoints.map((waypoint, index) => (
        <WaypointListItem
          key={waypoint.id}
          text={`Waypoint ${waypoint.id}`}
          handleDelete={() => props.deleteWaypoint(waypoint)}
          handleDragStart={() => setDraggedWaypoint(waypoint)}
          handleDragEnter={() => props.reorderWaypoints(draggedWaypoint, index)}
          handleDragEnd={() => setDraggedWaypoint(null)}
        />
      ))}
    </ul>
  );

}

export default WaypointList;
