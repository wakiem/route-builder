import React, { useState } from 'react';

import WaypointList from './components/WaypointList';
import DownloadButton from './components/DownloadButton';
import Map from './components/Map';

import Waypoint from './utils/waypoint';

import './App.css';
import { BarsIcon, XmarkIcon } from './components/Icons';

const App = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [state, setState] = useState({ waypoints: [], nextWayPointId: 1 });

  const addWaypoint = (lat, lng) => {
    setState((prevState) => ({
      waypoints: [...prevState.waypoints, new Waypoint(prevState.nextWayPointId, lat, lng)],
      nextWayPointId: prevState.nextWayPointId + 1,
    }));
  }

  const deleteWaypoint = (waypointToDelete) => {
    setState((prevState) => ({
      ...prevState,
      waypoints: prevState.waypoints.filter((waypoint) => waypoint !== waypointToDelete),
    }));
  }

  const reorderWaypoints = (waypointToMove, newIndexForWaypoint) => {
    setState((prevState) => {
      // Create a copy of the waypoints array without the waypoint that we're moving
      const reorderedWaypoints = prevState.waypoints.filter((waypoint) => waypoint !== waypointToMove);
      // Reinsert this waypoint at its new index
      reorderedWaypoints.splice(newIndexForWaypoint, 0, waypointToMove);
      return {
        ...prevState,
        waypoints: reorderedWaypoints,
      };
    });
  }

  return (
    <React.Fragment>
      <button id="open-sidebar-container" onClick={() => setIsSidebarOpen(true)}>
        <BarsIcon className="fa-1x" />
      </button>
      <div id="sidebar-container" className={isSidebarOpen ? 'opened' : null}>
        <button id="close-sidebar-container" onClick={() => setIsSidebarOpen(false)}>
          <XmarkIcon className="fa-1x" />
        </button>
        <h1 id="app-title">Route Builder</h1>
        <WaypointList waypoints={state.waypoints} deleteWaypoint={deleteWaypoint} reorderWaypoints={reorderWaypoints} />
        <DownloadButton waypoints={state.waypoints} disabled={state.waypoints.length < 2} />
      </div>
      <div id="map-container">
        <Map waypoints={state.waypoints} addWaypoint={addWaypoint} />
      </div>
    </React.Fragment>
  );

}

export default App;
