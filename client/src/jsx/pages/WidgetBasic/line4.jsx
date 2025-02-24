import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'

class LineChart3 extends Component {
  render() {
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          data: [4, 5, 4, 5, 4, 5, 3.8, 5],
          backgroundColor: this.props.color ? this.props.color : '#5514A4',
          borderColor: this.props.borderColor
            ? this.props.borderColor
            : this.props.color
            ? this.props.color
            : '#5514A4',
          borderWidth: 0,
          strokeColor: this.props.borderColor
            ? this.props.borderColor
            : this.props.color
            ? this.props.color
            : '#5514A4',
          capBezierPoints: !0,
          pointColor: this.props.borderColor
            ? this.props.borderColor
            : this.props.color
            ? this.props.color
            : '#fff',
          pointBorderColor: this.props.borderColor
            ? this.props.borderColor
            : this.props.color
            ? this.props.color
            : '#fff',
          pointBackgroundColor: this.props.borderColor
            ? this.props.borderColor
            : this.props.color
            ? this.props.color
            : '#5514A4',
          borderWidth2: 2,
          pointBorderWidth: 0,
          pointRadius: 3,
          pointHoverBorderColor: this.props.color
            ? this.props.color
            : '#5514A4',
          pointHoverRadius: 0,
          pointStyle: 'line',
          fill: true
        },
      ],
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: true,
      },
      plugins:{
        legend: {
          display: false,
          labels: {
            usePointStyle: false,
          },
        },
      },
      scales: {
        x: 
          {
            display: false,
            grid: {
              display: false,
              drawBorder: false,
            },
            scaleLabel: {
              display: false,
              labelString: 'Month',
            },
            ticks: {
              beginAtZero: true,
            },
          },
        
        y: 
          {
            display: false,
            grid: {
              display: false,
              drawBorder: false,
            },
            scaleLabel: {
              display: true,
              labelString: 'Value',
            },
          },
        
      },
      title: {
        display: true,
      },
    }
    return (
      <>
        <Line
          data={data}
          options={options}
          height={this.props.height ? this.props.height : 200}
        />
      </>
    )
  }
}

export default LineChart3
