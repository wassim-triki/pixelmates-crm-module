import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";

class ChartDoughnut extends Component {
   render() {
      const data = {
         // labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
         weight: 0,
         defaultFontFamily: "Poppins",
         datasets: [
            {
               data: [20, 45, 25],
               borderWidth: 0,
               // borderColor: "rgba(255,255,255,1)",
               backgroundColor: this.props.backgroundColor
                  ? this.props.backgroundColor
                  : ["#f4f4f4", "#f4f4f4", "#f4f4f4"],
               // border: "none",
            },
         ],
      };

      const options = {
         weight: 1,
         cutoutPercentage: this.props.cutoutPercentage
            ? this.props.cutoutPercentage
            : 40,
         responsive: false,
         maintainAspectRatio: false,
         tooltips: { enabled: false },
         hover: { mode: null },
      };

      return (
         <Doughnut
            data={data}
            options={options}
            height={this.props.height ? this.props.height : 200}
         />
      );
   }
}

export default ChartDoughnut;
