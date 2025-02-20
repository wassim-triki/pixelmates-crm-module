import React, { Component } from "react";
import { Bar } from "react-chartjs-2";

class BarChart extends Component {
  render() {
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
          data: [15, 40, 55, 40, 25, 35, 40, 50, 85, 95, 54, 35],
          borderColor: "#EA7A9A",
          borderWidth: "0",
          backgroundColor: "#EA7A9A",
          hoverBackgroundColor: "#EA7A9A",
          className: "lineChart ",
          barThickness: 5
          
        },
      ],
    };

    const options = {
      responsive: true,      
      plugins : {
        legend: false,
      },
      maintainAspectRatio: false,
      scales: {
        y: 
          {
            display: false,
            max: 100,
            min: 0,
            stepSize: 10,
            ticks: {
              beginAtZero: true,
              display: false,
            },
            grid: {
              display: false,
              drawBorder: false,
            },
          },
        x: 
          {
            display: false,
            barPercentage: 0.4,
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              display: false,
            },
          },        
      },
    };

    return(
        <div style={{width:"180px" , height: "70px", paddingLeft:'20px'}}>
            <Bar data={data} 
              height={85} 
              width={364} 
              options={options} 
            />
        </div>
      )  
      
  }
}

export default BarChart;
