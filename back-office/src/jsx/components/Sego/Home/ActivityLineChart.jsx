// src/components/Sego/Home/ActivityLineChart.jsx
import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

class ActivityLineChart extends Component {
  render() {
    const { labels, predictions } = this.props;

    // Fallback data (if you ever need it)
    const fallbackData = Array(labels.length).fill(0);

    const data = {
      defaultFontFamily: 'Poppins',
      labels: labels.length ? labels : ['No data'],
      datasets: [
        {
          label: 'Guest Count',
          data: predictions.length ? predictions : fallbackData,
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
            fontFamily: 'Nunito, sans-serif',
          },
        },
        y: {
          grid: {
            color: 'rgba(0,0,0,0.1)',
            drawBorder: true,
          },
          ticks: {
            min: 0,
            stepSize: 20,
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

    return <Line data={data} options={options} height={350} />;
  }
}

export default ActivityLineChart;
