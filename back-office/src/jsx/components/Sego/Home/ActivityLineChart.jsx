import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

class ActivityLineChart extends Component {
  render() {
    const { labels, dataActive } = this.props;

    // Replace or expand these with your real datasets.
    const activityData = [
      [30, 60, 30, 65, 35, 60, 40, 70, 30, 45, 30, 60], // month fallback
      // …other series if you have them…
    ];

    const data = {
      defaultFontFamily: 'Poppins',
      labels: labels.length
        ? labels
        : [
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
          label: 'Guest Count',
          data: activityData[dataActive] || [],
          borderColor: '#EA7A9A',
          borderWidth: 4,
          tension: 0.5,
          fill: true,
          backgroundColor: 'rgba(255, 199, 182, 0.3)',
        },
      ],
    };

    const options = {
      plugins: {
        legend: { display: false },
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            fontColor: '#3e4954',
            fontFamily: 'Nunito, sans-serif',
          },
        },
        y: {
          grid: {
            color: 'rgba(0,0,0,0.1)',
            drawBorder: true,
          },
          ticks: {
            max: 100,
            min: 0,
            stepSize: 20,
            fontColor: '#3e4954',
          },
        },
      },
      elements: {
        point: { radius: 0 },
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
    };

    return (
      <div style={{ height: '350px' }}>
        <Line data={data} options={options} height={350} />
      </div>
    );
  }
}

export default ActivityLineChart;
