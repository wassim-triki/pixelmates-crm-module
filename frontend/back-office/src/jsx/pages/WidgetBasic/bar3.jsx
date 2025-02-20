import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2'

class BarChart3 extends Component {
  render() {
    const data = {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      datasets: [
        {
          label: 'My First dataset',
          data: [65, 59, 80, 81, 56, 55, 40, 88, 45, 95, 54, 76],
          borderColor: this.props.color ? this.props.color : '#5615a5',
          borderWidth: '0',
          backgroundColor: this.props.color ? this.props.color : '#5615a5',
          barThickness:8
        },
      ],
    }

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
            ticks: {
              beginAtZero: true,
              display: false,
              max: 100,
              min: 0,
              stepSize: 10,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          },
        
        x: 
          {
            display: false,
            barPercentage: 0.6,
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              display: false,
            },
          },        
      },
    }

    return (
      <div className='ps-3 pe-3'>
        <Bar
          data={data}
          height={this.props.height ? this.props.height : 100}
          options={options}
        />
      </div>
    )
  }
}

export default BarChart3
