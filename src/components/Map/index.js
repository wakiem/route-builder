import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import './style.css';

const MAP_TILE = L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const MAP_PARAMS = {
  zoom: 14,
  zoomControl: false,
  layers: [MAP_TILE]
};

const Map = (props) => {

  const [isMapInitialized, setIsMapInitialized] = useState(false);

  const mapRef = useRef(null);
  const layerRef = useRef(null);

  // Initialization of the map, only executed on mount and unmount
  useEffect(() => {
    fetch("https://ipwhois.app/json/") // 10,000 free IP Geolocation requests per month
      .then(res => res.json())
      .then(
        (result) => [result.latitude, result.longitude],
        (error) => [51.0841312, 3.5741366]
      )
      .then((latlng) => {
        // Init map and set reference
        mapRef.current = L.map('map', { ...MAP_PARAMS, center: latlng });
        // Add onClick handler to map
        mapRef.current.on('click', (e) => {
          if (e.originalEvent.isTrusted) {
            // There's a bug in Leaflet on Safari desktop:
            // One click on the map will generate 2 click events
            // - one time with isTrusted = true
            // - one time with isTrusted = false
            // The click event on chrome etc has isTrusted = true
            // So filtering out these Safari double click events here
            // See https://github.com/Leaflet/Leaflet/issues/7887
            // and https://github.com/Leaflet/Leaflet/issues/7255
            props.addWaypoint(e.latlng.lat, e.latlng.lng);
          }
        });
        // Add the layer on which we draw the waypoints and the route
        layerRef.current = L.layerGroup().addTo(mapRef.current);
        setIsMapInitialized(true);
      })
  }, []);

  // Drawing the waypoints & route on the map, executed also whenever the waypoints array changes
  useEffect(() => {
    if (isMapInitialized) {
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
    }
  }, [isMapInitialized, props.waypoints]);

  return (
    <div id="map">
      {!isMapInitialized ? <div className="loader" /> : null}
    </div>
  );

}

export default Map;
