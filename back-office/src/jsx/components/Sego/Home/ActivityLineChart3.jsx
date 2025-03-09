import React, { Component } from "react";
import { Line } from "react-chartjs-2";

const data = {
   defaultFontFamily: "Poppins",
   labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "My First dataset",
      data:  [20, 35, 70, 45, 40, 35, 30, 35, 10, 40, 60, 20],
      borderColor: '#EA7A9A',
      borderWidth: "4",
      barThickness:'flex',
      backgroundColor: 'rgba(255, 199, 182, 0.3)',
      minBarLength:10
    }
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  
  legend: {
    display: false
  },
  scales: {
    yAxes: [{
       gridColor: "navy",
      gridLines: {
        color: "rgba(0,0,0,0.1)",
        height: 50,
        drawBorder: true
      },
      ticks: {
        fontColor: "#3e4954",
        max: 100,
        min: 0,
        stepSize: 20
      },
    }],
    xAxes: [{
      barPercentage: 0.3,
      
      gridLines: {
        display: false,
        zeroLineColor: "transparent"
      },
      ticks: {
        stepSize: 20,
        fontColor: "#3e4954",
        fontFamily: "Nunito, sans-serif"
      }
    }]
  },
  elements: {
    point: {
      radius: 0,
      borderWidth: 0
    }
  },
  tooltips: {
    mode: "index",
    intersect: false,
    titleFontColor: "#888",
    bodyFontColor: "#555",
    titleFontSize: 12,
    bodyFontSize: 15,
    backgroundColor: "rgba(255,255,255,1)",
    displayColors: true,
    xPadding: 10,
    yPadding: 7,
    borderColor: "rgba(220, 220, 220, 1)",
    borderWidth: 1,
    caretSize: 6,
    caretPadding: 10
  }
};
class ActivityLineChart3 extends Component {
   render() {
      return (
         <div style={{height:"350px"}}>
            <Line data={data} options={options} height={350} />
         </div>
      );
   }
}

export default ActivityLineChart3;
