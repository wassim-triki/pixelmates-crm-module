import React from "react";
import ReactApexChart from "react-apexcharts";

class ApexBar3 extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         series: [this.props.series],
         options: {
            chart: {
               height: 300,
               type: 'radialBar',
               offsetY: -10
             },
        
            plotOptions: {
               radialBar: {
                 startAngle: -135,
                 endAngle: 135,
                 dataLabels: {
                   name: {
                     fontSize: '16px',
                     color: undefined,
                     offsetY: 120
                   },
                   value: {
                     offsetY: 0,
                     fontSize: '34px',
                     color: 'black',
                     formatter: function (val) {
                       return val + "%";
                     }
                   }
                 }
               }
             },
             fill: {
               type: 'gradient',
             colors:'#EA7A9A',
               gradient: {
                   shade: 'dark',
                   shadeIntensity: 0.15,
                   inverseColors: false,
                   opacityFrom: 1,
                   opacityTo: 1,
                   stops: [0, 50, 65, 91]
               },
             },
             stroke: {
             colors:'#EA7A9A'
             },
             labels: [''],
   }}
   }
   render() {
      return (
         <div id="chart">
            <ReactApexChart
               options={this.state.options}
               series={this.state.series}
               type="radialBar"
               height={300}
            />
         </div>
      );
   }
}

export default ApexBar3;
