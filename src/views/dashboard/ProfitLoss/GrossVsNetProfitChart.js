import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';

function GrossVsNetProfitChart(props) {
  const [chartData, setChartData] = React.useState([]);

  useEffect(() => {
    setChartData({
      labels: props.plLabelList,
      datasets: [
        {
          label: 'Gross Profit',
          data: props.grossValues,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Net Profit',
          data: props.netValues,
          fill: false,
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    })
  }, [props]);

  return (
    <div style={{ width: '1100px', height: '400px' }}>
      <Line
        data={chartData}
        options={{
          maintainAspectRatio: false,
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
            xAxes: [
              {
                gridLines: {
                  display: false
                }
              }
            ],
            yAxes: [
              {
                gridLines: {
                  display: false
                },
                ticks: {
                  beginAtZero: true,
                  callback: function (value) {
                    return value.toLocaleString();
                  }
                }
              }
            ]
          }
        }}
      />
    </div>
  );
}

export default GrossVsNetProfitChart;