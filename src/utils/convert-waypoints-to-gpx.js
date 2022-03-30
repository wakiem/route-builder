function convertWaypointsToGpx(waypoints) {
  return `<?xml version='1.0' encoding='UTF-8'?>
<gpx version="1.1" creator="Route Builder" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <author>
      <name>Route Builder</name>
    </author>
  </metadata>
  <trk>
    <trkseg>
      ${waypoints.map((waypoint) => `<trkpt lat="${waypoint.lat}" lon="${waypoint.lng}" />`).join('\n\t\t\t')}
    </trkseg>
  </trk>
</gpx>`;
}

export default convertWaypointsToGpx;