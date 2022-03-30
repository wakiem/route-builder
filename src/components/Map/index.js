import React, { useRef, useEffect } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import './style.css';

const MAP_TILE = L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const MAP_PARAMS = {
  center: [0, 0],
  zoom: 16,
  zoomControl: false,
  layers: [MAP_TILE]
};

const Map = (props) => {

  const mapRef = useRef(null);
  const layerRef = useRef(null);

  // Only executed on mount and unmount
  useEffect(() => {
    // Set reference to map
    mapRef.current = L.map('map', MAP_PARAMS);
    // Ask user's position and center map on that position
    navigator.geolocation.getCurrentPosition(function(position) {
      mapRef.current.setView([position.coords.latitude, position.coords.longitude]);
    });
    // Add onClick handler to map
    mapRef.current.on('click', (e) => {
      props.addWaypoint(e.latlng.lat, e.latlng.lng);
    });
    // Add the layer on which we draw the waypoints and the route
    layerRef.current = L.layerGroup().addTo(mapRef.current);
  }, []);

  // Executed on mount, unmount, and whenever the waypoints array changes
  useEffect(() => {
    // Clear the waypoints and the route from the map
    layerRef.current.clearLayers()
    // Loop over the waypoints to print them on the map, and to put together the route
    const route = [];
    props.waypoints.forEach((waypoint) => {
      const markerIcon = L.divIcon({
        html: `<span>${waypoint.id}</span>`,
        className: 'waypoint-marker',
        iconSize: [25, 25],
      });
      const marker = L.marker([waypoint.lat, waypoint.lng], { icon: markerIcon });
      marker.on('click', (e) => {
        // Avoid double waypoints: Without this we could add the same (Lat, Lng) multiple times
        L.DomEvent.stop(e);
      })
      marker.addTo(layerRef.current);
      route.push([waypoint.lat, waypoint.lng]);
    });
    // Print the route on the map
    L.polyline(route, { color: '#0E86E8', weight: 4 }).addTo(layerRef.current);
  }, [props.waypoints]);

  return (
    <div id="map" />
  );

}

export default Map;
