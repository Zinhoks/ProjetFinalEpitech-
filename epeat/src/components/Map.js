import React, { useEffect, useRef } from "react";

const Map = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new window.google.maps.Map(mapContainer.current, {
      zoom: 17,
      center: { lat: 48.8221674, lng: 2.3555216 },
    });

    const marker = new window.google.maps.Marker({
      position: { lat: 48.8221674, lng: 2.3555216 },
      map: map
    });
  }, []);

  return <div ref={mapContainer} style={{ width: "40%", height: "500px" }}></div> ;
};

export default Map;