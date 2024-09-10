import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

function EligibleVsClaimedITCChart() {
  const [chartData, setChartData] = useState({
    labels: ['Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 
        'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 
        'Dec 2024', 'Jan 2024', 'Feb 2024', 'Mar 2024' ],
    datasets: [
      {
        label: 'Eligible',
        data: [12, 19, 3, 5, 2, 3, 11, 15, 22, 5, 8, 4],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Claimed',
        data: [15, 22, 5, 8, 4, 5, 13, 18, 25, 7, 10, 6],
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  });

  return (
    <div style={{ width: '1100px', height: '400px'}}>
      <Line data={chartData} options={{
        maintainAspectRatio:false,
        title: {
          display: true,
          text: ''
        },
        legend: {
          display: true,
          position: 'bottom'
        },
        layout: {
            padding: {
              top: 10,
              bottom: 10,
              left: 25,
              right: 0
            }
          },
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true,
              callback: function(value) {
                return value.toLocaleString();
              }
            }
          }]
        }
      }} />
    </div>
  );
}

export default EligibleVsClaimedITCChart;