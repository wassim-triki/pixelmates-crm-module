import React from "react";

import {
  ComposableMap,
  Geographies,
  Geography,
 
} from "react-simple-maps";



const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const MapChart = () => {
  return (
    <ComposableMap projection="geoAlbersUsa">
      <Geographies geography={geoUrl}>
        {({ geographies }) => (
          <>
            {geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                stroke="#FFF"
                geography={geo}
                fill="#eff2f4"
              />
            ))}
            
          </>
        )}
      </Geographies>
    </ComposableMap>
  );
};

export default MapChart;