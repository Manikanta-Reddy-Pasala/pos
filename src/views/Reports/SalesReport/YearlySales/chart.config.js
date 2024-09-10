export const options = {
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    xAxes: [
      {
        gridLines: {
          drawOnChartArea: false
        },
        ticks: {
          callback: (value) => value.slice(0, 3),
          minor: {
            fontFamily: ['Nunito Sans, Roboto, sans-serif'].join(','),
            fontColor: '#222'
          }
        }
      }
    ],
    yAxes: [
      {
        gridLines: {
          drawOnChartArea: false
        },
        ticks: {
          minor: {
            fontFamily: ['Nunito Sans, Roboto, sans-serif'].join(','),
            fontColor: '#222'
          }
        }
      }
    ]
  },
  plugins: {
    legend: {
      position: 'bottom'
    },
    title: {
      display: true,
      text: 'Sale Report'
    }
  }
};
