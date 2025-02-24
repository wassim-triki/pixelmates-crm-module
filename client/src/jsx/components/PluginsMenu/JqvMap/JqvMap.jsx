import React from "react";


import MapChart from './MapChart';
import WorldMap from './WorldMap';


import PageTitle from "../../../layouts/PageTitle";


const JqvMap = () => {	
	
  return (
    <div className="h-80">
      <PageTitle activeMenu="JqvMap" pageContent="JqvMap" motherMenu="Map" />

      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">World Map</h4>
            </div>
            <div className="card-body mb-2" style={{ height: "100%" }}>            
                <div id="world-map" style={{ height: "100%" }}>                  
                  <WorldMap />
                </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">USA</h4>
            </div>
            <div className="card-body mb-2" style={{ height: "100%" }}>
			  <div id="usa" style={{ height: "100%" }}>				  
				  <MapChart />
			  </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JqvMap;
