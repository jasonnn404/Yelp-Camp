import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { GeoAltFill } from "react-bootstrap-icons";
import styles from "./ClusterMap.module.css";

const ClusterMap = ({ campgroundData, mapData }) => {
  const [viewport, setViewport] = useState({
    latitude: 40.66995747013945,
    longitude: -103.59179687498357,
    zoom: 3,
    bearing: 0,
    pitch: 0,
  });
  const [popupInfo, setPopupInfo] = useState(null);
  
  // Determine which data source to use - prefer mapData if available
  const dataSource = mapData && mapData.length > 0 ? mapData : campgroundData || [];
  
  // Process and limit data to avoid header size issues
  const validMarkers = dataSource
    .filter(camp => 
      camp && 
      ((camp.geometry && 
        camp.geometry.coordinates && 
        Array.isArray(camp.geometry.coordinates) &&
        camp.geometry.coordinates.length === 2) ||
       (typeof camp.lat === 'number' && typeof camp.lng === 'number'))
    )
    .slice(0, 100); // Limit markers
    
  console.log('Valid markers for map:', validMarkers.length, dataSource.length);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setPopupInfo(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.mapContainer}>
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle={"https://api.maptiler.com/maps/streets/style.json?key=tghNMVHnl2KbnmbsG0So"}
        onViewportChange={nextViewport => setViewport(nextViewport)}
      >
        {validMarkers.map(camp => {
          // Handle both data formats (mapData or campgroundData)
          const lng = camp.lng || camp.geometry?.coordinates?.[0];
          const lat = camp.lat || camp.geometry?.coordinates?.[1];
          const id = camp.id || camp._id;
          
          return (
            <Marker
              key={id}
              latitude={lat}
              longitude={lng}
            >
              <button
                className={styles.markerBtn}
                onClick={() => setPopupInfo(camp)}
              >
                <GeoAltFill className={styles.markerIcon} />
              </button>
            </Marker>
          );
        })}

        {popupInfo && (
          <Popup
            tipSize={5}
            anchor="top"
            longitude={popupInfo.lng || popupInfo.geometry?.coordinates?.[0]}
            latitude={popupInfo.lat || popupInfo.geometry?.coordinates?.[1]}
            closeOnClick={false}
            onClose={() => setPopupInfo(null)}
            className={styles.popup}
          >
            <div>
              <h3>{popupInfo.title || "Campground"}</h3>
              <p>{popupInfo.location || "No location"}</p>
              <a href={`/campgrounds/${popupInfo.id || popupInfo._id}`} className="btn btn-sm btn-primary">
                View
              </a>
            </div>
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
};

export default ClusterMap;
