import React from 'react';

import convertWaypointsToGpx from '../../utils/convert-waypoints-to-gpx';

import './style.css';

const DownloadButton = (props) => {

  const downloadGpxFile = () => {
    let fileName = 'route.gpx';
    let fileContent = convertWaypointsToGpx(props.waypoints);;
    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(new File([fileContent], fileName, { type: 'application/gpx+xml' }));
    document.body.appendChild(a); // Required for FF
    a.click();
  }

  return (
    <button id="download-button" type="button" onClick={downloadGpxFile} disabled={props.disabled}>
      Download your Route
    </button>
  );

}

export default DownloadButton;
