import React, { Component } from "react";
import { Line } from "react-chartjs-2";

class AllSell2 extends Component {
  render() {
    const data = {
      defaultFontFamily: "Poppins",
      labels: ["Jan", "Febr", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "My First dataset",
          data: [25, 60, 30, 71, 26, 85, 50],
          borderColor: "rgba(234,122,154,1)",
          borderWidth: "2",
          backgroundColor: "transparent",
          pointBackgroundColor: "rgba(234,122,154,1)",
          pointRadius: 0,
          tension:0.5
        },
      ],
    };

    const options = {
      plugins:{
        legend: false,
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: 
          {
            display: false,
            max: 100,
            min: 0,
            ticks: {
              beginAtZero: true,
              stepSize: 20,
              padding: 0,
              display: false,
            },
            gridLines: {
              drawBorder: false,
              display: false,
            },
          },
        
        x: 
          {
            display: false,
            ticks: {
              padding: 0,
              display: false,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          },
        
      },
    };
    return (
      <div style={{ height: 150 }}>
        <Line data={data} options={options} height={150} />
      </div>
    );
  }
}

export default AllSell2;
