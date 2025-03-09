import React, { Component } from "react";
import { Line } from "react-chartjs-2";

class TopProducts2 extends Component {
  render() {
    const data = {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: "Sales Stats",
          backgroundColor: "rgba(234,122,154,1)",
          borderColor: "rgba(234,122,154,1)",
          pointBackgroundColor: "rgba(234,122,154,1)",
          pointBorderColor: "rgba(234,122,154,1)",
          pointHoverBackgroundColor: "rgba(234,122,154,1)",
          pointHoverBorderColor: "rgba(234,122,154,1)",
          borderWidth: 0,
          data: [20, 10, 18, 10, 32, 15, 15, 22, 18, 6, 12, 13],
          fill : true
        },
      ],
    };

    const options = {
      plugins:{
        legend: {
          display: !1,
        },
      },
      title: {
        display: !1,
      },
      tooltips: {
        intersect: !1,
        mode: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10,
      },
      
      responsive: !0,
      maintainAspectRatio: !1,
      hover: {
        mode: "index",
      },
      scales: {
        x: 
          {
            display: !1,
            gridLines: !1,
            scaleLabel: {
              display: !0,
              labelString: "Month",
            },
          },
        
        y: 
          {
            display: !1,
            gridLines: !1,
            scaleLabel: {
              display: !0,
              labelString: "Value",
            },
            ticks: {
              beginAtZero: !0,
            },
          },        
      },
      elements: {
        line: {
          tension: 0.7,
        },
        point: {
          radius: 0,
          borderWidth: 0,
        },
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 5,
          bottom: 0,
        },
      },
    };

    return (
      <div style={{ height: 300 }}>
        <Line data={data} options={options} height={300} />
      </div>
    );
  }
}

export default TopProducts2;
