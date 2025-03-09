import React, { Component } from "react";
import { Line } from "react-chartjs-2";

const data = {
  defaultFontFamily: "Poppins",
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "My First dataset",
      data: [25, 20, 60, 41, 66, 45, 80],
      borderColor: "#3b4cb8",
      borderWidth: "1",
      backgroundColor: "rgba(64, 24, 157, .1)",
	  tension:0.4,
	  fill:true
    },
    {
      label: "My First dataset",
      data: [5, 25, 20, 41, 36, 75, 70],
      borderColor: "rgb(234, 122, 154,1)",
      borderWidth: "1",
      backgroundColor: "rgba(234, 122, 154, .5)",
	  tension:0.4,
	  fill:true
    },
  ],
};

const options = {
  plugins:{
	  legend: false,
  },
  scales: {
    y: 
      {
		  max: 100,
          min: 0,
        ticks: {
          beginAtZero: true,
          stepSize: 20,
          padding: 10,
        },
      },
    
    x: 
      {
        ticks: {
          padding: 5,
        },
      },
    
  },
};
class DualArea extends Component {
  render() {
    return (
      <div >
        <Line data={data} options={options} height={150} />
      </div>
    );
  }
}

export default DualArea;
