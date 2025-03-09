import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const WorldMap = () => {
	
  return (
    <ComposableMap>
      <Geographies geography="./features.json">
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
    </ComposableMap>
	
	
  );
};

export default WorldMap;
