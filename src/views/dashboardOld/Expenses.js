import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  useTheme,
  makeStyles,
  colors
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: '0px 0px 12px -3px #0000004a',
    borderRadius: '10px',
    padding: '10px'
  },
  btn: {
    color: '#888',
    textTransform: 'unset',
    fontSize: '16px'
  },
  headerText: {
    color: '#263238',
    fontWeight: 'bold',
    fontSize: '20px'
  }
}));

const Expenses = ({ className, labelText, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  var dateFormat = require('dateformat');
  var date = new Date();
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  var tmrDate = dateFormat(tomorrow, 'yyyy-mm-dd');
  var todayDate = dateFormat(date, 'yyyy-mm-dd');
  const [data, SetData] = React.useState([]);

  useEffect(() => {
    getDailyData();
    return () => {
      SetData(null);
    };
  }, []);

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const getDailyData = async (fromDate, toDate) => {
    var lastDate = new Date();
    lastDate.setDate(date.getDate() - 7);

    fromDate = formatDate(lastDate);
    toDate = formatDate(tmrDate);

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    var query = await db.expenses.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            date: {
              $gte: fromDate
            }
          },
          {
            date: {
              $lt: toDate
            }
          }
        ]
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          return;
        }

        let response = data.map((item) => {
          let output = {};
          output.date = item.date;
          output.total = item.total;
          return output;
        });

        var result = [];
        await response.reduce(function (res, value) {
          if (!res[value.date]) {
            res[value.date] = {
              date: value.date,
              total: 0
            };
            result.push(res[value.date]);
          }
          res[value.date].total += value.total;
          return res;
        }, {});

        let values = [];
        let labelsList = [];
        /**
         * create a map with labels list with values as 0
         * based on start date and end date
         */

        let dataMap = new Map();

        for (var i = 6; i > 0; i--) {
          var d = new Date();
          d.setDate(d.getDate() - i);

          let shortMonth = d.toLocaleString('en-us', {
            month: 'short'
          });
          let shortDate = d.toLocaleString('en-us', {
            day: 'numeric'
          });
          dataMap.set(shortDate + ' ' + shortMonth, 0);
          labelsList.push(shortDate + ' ' + shortMonth);
          if (i === 1) {
            var today = new Date();

            let shortMonth = today.toLocaleString('en-us', {
              month: 'short'
            });
            let shortDate = today.toLocaleString('en-us', {
              day: 'numeric'
            });
            dataMap.set(shortDate + ' ' + shortMonth, 0);
            labelsList.push(shortDate + ' ' + shortMonth);
          }
        }

        result.forEach((element) => {
          let shortMonth = new Date(element.date).toLocaleString('en-us', {
            month: 'short'
          });
          let shortDate = new Date(element.date).toLocaleString('en-us', {
            day: 'numeric'
          });

          const label = shortDate + ' ' + shortMonth;

          if (dataMap.has(label)) {
            // console.log('present::', label);

            dataMap.set(label, element.total);
          } else {
            // console.log('not present::', label);
          }
        });

        // console.log('dataMap.values()', dataMap.values());
        values = Array.from(dataMap.values());

        SetData({
          datasets: [
            {
              backgroundColor:
                labelText === 'Sales' ? colors.blue[300] : '#ffaf01',
              data: values
            }
          ],
          labels: labelsList
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  function getWeekOfMonth(date) {
    let adjustedDate = date.getDate() + date.getDay();
    let prefixes = ['0', '1', '2', '3', '4', '5'];
    return parseInt(prefixes[0 | (adjustedDate / 7)]) + 1;
  }

  const getWeeklyData = async (fromDate, toDate) => {
    var currentDate = new Date();
    var first = currentDate.getDate() - currentDate.getDay();
    var firstday = new Date(currentDate.setDate(first)).toUTCString();

    var before7Weeksdate = currentDate.setDate(
      new Date(firstday).getDate() - 42
    );

    fromDate = formatDate(before7Weeksdate);
    toDate = formatDate(todayDate);

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    var query = await db.expenses.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            date: {
              $gte: fromDate
            }
          },
          {
            date: {
              $lt: toDate
            }
          }
        ]
      },
      sort: [{ date: 'asc' }]
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          return;
        }

        let response = data.map((item) => {
          let output = {};
          output.date = item.date;
          output.total = item.total;
          return output;
        });

        var result = [];
        await response.reduce(function (res, value) {
          let weekNumber = getWeekOfMonth(new Date(value.date));
          let monthShort = new Date(value.date).toLocaleString('en-us', {
            month: 'short'
          });

          let date = monthShort + ' Week ' + weekNumber;

          if (!res[date]) {
            res[date] = {
              /**
               * get moth from date
               */
              date: date,
              total: 0
            };
            result.push(res[date]);
          }
          res[date].total += value.total;
          return res;
        }, {});

        let values = [];
        let labelsList = [];
        /**
         * create a map with labels list with values as 0
         * based on start date and end date
         */

        let dataMap = new Map();

        var now = new Date();
        for (var d = new Date(fromDate); d <= now; d.setDate(d.getDate() + 1)) {
          let weekNumber = getWeekOfMonth(d);
          let monthShort = d.toLocaleString('en-us', {
            month: 'short'
          });

          let date = monthShort + ' Week ' + weekNumber;
          dataMap.set(date, 0);
        }
        labelsList = Array.from(dataMap.keys());

        result.forEach((element) => {
          const label = element.date;

          if (dataMap.has(label)) {
            dataMap.set(label, element.total);
          } else {
            // console.log('not present::', label);
          }
        });

        values = Array.from(dataMap.values());

        SetData({
          datasets: [
            {
              backgroundColor:
                labelText === 'Sales' ? colors.blue[300] : '#ffaf01',
              data: values
            }
          ],
          labels: labelsList
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  const getMonthlyData = async (fromDate, toDate) => {
    var lastDate;
    lastDate = new Date(date.getFullYear(), date.getMonth() - 7, 1);

    fromDate = formatDate(lastDate);
    toDate = formatDate(todayDate);

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    var query = await db.expenses.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            date: {
              $gte: fromDate
            }
          },
          {
            date: {
              $lt: toDate
            }
          }
        ]
      },
      sort: [{ date: 'asc' }]
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          return;
        }

        let response = data.map((item) => {
          let output = {};
          output.date = item.date;
          output.total = item.total;
          return output;
        });

        var result = [];
        await response.reduce(function (res, value) {
          let monthShort = new Date(value.date).toLocaleString('en-us', {
            month: 'short'
          });

          let yearShort = new Date(value.date).toLocaleString('en-us', {
            year: '2-digit'
          });

          let date = monthShort + ' ' + yearShort;

          if (!res[date]) {
            res[date] = {
              /**
               * get moth from date
               */
              date: date,
              total: 0
            };
            result.push(res[date]);
          }
          res[date].total += value.total;
          return res;
        }, {});

        // console.log('result::', result);

        let values = [];
        let labelsList = [];
        /**
         * create a map with labels list with values as 0
         * based on start date and end date
         */

        let dataMap = new Map();
        var today = new Date();
        var d;
        for (var i = 6; i >= 0; i--) {
          d = new Date(today.getFullYear(), today.getMonth() - i, 1);

          let shortMonth = d.toLocaleString('en-us', {
            month: 'short'
          });
          let shortYear = d.toLocaleString('en-us', {
            year: '2-digit'
          });

          dataMap.set(shortMonth + ' ' + shortYear, 0);
          labelsList.push(shortMonth + ' ' + shortYear);
        }

        result.forEach((element) => {
          const label = element.date;

          if (dataMap.has(label)) {
            // console.log('present::', label);

            dataMap.set(label, element.total);
          } else {
            // console.log('not present::', label);
          }
        });

        values = Array.from(dataMap.values());

        SetData({
          datasets: [
            {
              backgroundColor:
                labelText === 'Sales' ? colors.blue[300] : '#ffaf01',
              data: values
            }
          ],
          labels: labelsList
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  const handleChange = async (type) => {
    if (type === 'daily') {
      await getDailyData();
    } else if (type === 'weekly') {
      getWeeklyData();
    } else if (type === 'monthly') {
      getMonthlyData();
    }
  };

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          barThickness: 12,
          maxBarThickness: 10,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          ticks: {
            fontColor: theme.palette.text.secondary
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider
          }
        }
      ]
    },
    tooltips: {
      // backgroundColor: theme.palette.background.default,
      // bodyFontColor: theme.palette.text.secondary,
      // borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      // footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index'
      // titleFontColor: theme.palette.text.primary
    }
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader
        action={
          <Box>
            <Button
              variant="text"
              className={classes.btn}
              onClick={() => handleChange('daily')}
            >
              Daily
            </Button>
            <Button
              variant="text"
              className={classes.btn}
              onClick={() => handleChange('weekly')}
            >
              Weekly
            </Button>
            <Button
              className={classes.btn}
              variant="text"
              onClick={() => handleChange('monthly')}
            >
              Monthly
            </Button>
          </Box>
        }
        title={<Box className={classes.headerText}>{labelText}</Box>}
      />
      <CardContent>
        <Box height={200} position="relative">
          <Line data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

Expenses.propTypes = {
  className: PropTypes.string
};

export default Expenses;
